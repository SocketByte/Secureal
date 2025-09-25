// cryptoUtils.ts
import { x25519 } from "@noble/curves/ed25519"
// =====================
// Helper: Convert ArrayBuffer <-> Base64
// =====================
const _btoa =
  typeof globalThis.btoa === "function"
    ? globalThis.btoa.bind(globalThis)
    : (str: string) => Buffer.from(str, "binary").toString("base64")

const _atob =
  typeof globalThis.atob === "function"
    ? globalThis.atob.bind(globalThis)
    : (b64: string) => Buffer.from(b64, "base64").toString("binary")

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return _btoa(binary)
}

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = _atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export const bytesToBase64 = (b: Uint8Array): string => {
  let binary = ""
  for (let i = 0; i < b.length; i++) binary += String.fromCharCode(b[i])
  return _btoa(binary)
}

export const base64ToBytes = (base64: string): Uint8Array => {
  const binary = _atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function cryptoKeyToBase64(key: CryptoKey): Promise<string> {
  const format = key.type === "public" ? "raw" : "pkcs8"
  const exported = await crypto.subtle.exportKey(format, key)
  return arrayBufferToBase64(exported)
}

// Convert Base64 → CryptoKey
export async function base64ToCryptoKey(base64: string, type: "public" | "private"): Promise<CryptoKey> {
  const format = type === "public" ? "raw" : "pkcs8"
  const keyData = base64ToArrayBuffer(base64)

  return crypto.subtle.importKey(
    format,
    keyData,
    {
      name: "ECDH",
      namedCurve: "X25519",
    },
    true, // extractable (set to false for extra security)
    type === "public" ? [] : ["deriveKey", "deriveBits"]
  )
}

// =====================
// 1. X25519 Key Pair Generation & Shared Secret
// =====================
export interface KeyPair {
  publicKey: string
  privateKey: string
}

export function generateKeyPair(): KeyPair {
  // Use the noble helper to create a random private key (32 bytes)
  // x25519.utils.randomPrivateKey() may be available; if not, use x25519.utils.randomPrivateKey or randomBytes
  // The library exposes utils; but to be robust, use x25519.utils if present.
  // Types: returns Uint8Array
  const priv: Uint8Array =
    // @ts-ignore - some versions expose utils.randomPrivateKey
    (x25519 as any).utils?.randomPrivateKey?.() ??
    // fallback: generate 32 random bytes (noble/hashes has randomBytes; but global crypto also works)
    ((): Uint8Array => {
      const b = new Uint8Array(32)
      if (typeof globalThis.crypto?.getRandomValues === "function") {
        globalThis.crypto.getRandomValues(b)
      } else {
        // Node fallback
        const nodeBuf = Buffer.from(require("crypto").randomBytes(32))
        b.set(nodeBuf)
      }
      return b
    })()

  // compute public key (Uint8Array)
  const pub = x25519.getPublicKey(priv) // returns Uint8Array (32 bytes)

  return {
    publicKey: bytesToBase64(pub),
    privateKey: bytesToBase64(priv),
  }
}

/**
 * Derive an AES-GCM CryptoKey from a base64 private key (our) and base64 public key (their)
 * Uses: noble x25519 for shared secret, then WebCrypto HKDF -> AES-GCM
 *
 * @param myPrivateBase64 - base64 private key (32 bytes)
 * @param theirPublicBase64 - base64 public key (32 bytes)
 * @param info - optional context string for HKDF
 */
export async function deriveSharedKeyHKDFFromBase64(
  myPrivateBase64: string,
  theirPublicBase64: string,
  info = "chat"
): Promise<CryptoKey> {
  const myPriv = base64ToBytes(myPrivateBase64)
  const theirPub = base64ToBytes(theirPublicBase64)

  // Get shared secret from noble X25519
  const sharedRaw = x25519.getSharedSecret(myPriv, theirPub)

  // Wrap/copy into proper Uint8Array with real ArrayBuffer
  let sharedBytes = new Uint8Array(sharedRaw)
  if (sharedBytes.length === 33 && sharedBytes[0] === 0) {
    sharedBytes = sharedBytes.slice(1)
  }

  // Now safe for WebCrypto digest
  const hashBuffer = await crypto.subtle.digest("SHA-256", sharedBytes)
  const hashedShared = new Uint8Array(hashBuffer)

  // Import HKDF key
  const hkdfKey = await crypto.subtle.importKey("raw", hashedShared, { name: "HKDF" }, false, [
    "deriveKey",
    "deriveBits",
  ])
  // Derive AES-GCM 256-bit key
  // Salt: using zeros here for simplicity; for better separation, use per-chat or per-session salt
  const salt = new Uint8Array(32) // all zeros
  const infoBytes = new TextEncoder().encode(info)

  const aesKey = await globalThis.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt,
      info: infoBytes,
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )

  return aesKey
}

// ----- 3) AES-GCM encrypt/decrypt using derived key -----
export interface EncryptedMessage {
  iv: string // base64
  ciphertext: string // base64
}

/**
 * Encrypt plaintext (utf-8) using CryptoKey (AES-GCM)
 */
export async function encryptMessage(key: CryptoKey, plaintext: string): Promise<EncryptedMessage> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)
  const iv = new Uint8Array(12)
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(iv)
  } else {
    const nodeBuf = Buffer.from(require("crypto").randomBytes(12))
    iv.set(nodeBuf)
  }

  const ciphertextBuf = await globalThis.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)

  return {
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(ciphertextBuf),
  }
}

/**
 * Decrypt base64 ciphertext (AES-GCM) into utf-8 string
 */
export async function decryptMessage(key: CryptoKey, ivBase64: string, ciphertextBase64: string): Promise<string> {
  const ivBuf = base64ToArrayBuffer(ivBase64)
  const ctBuf = base64ToArrayBuffer(ciphertextBase64)

  const plainBuf = await globalThis.crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(ivBuf) }, key, ctBuf)

  return new TextDecoder().decode(plainBuf)
}
