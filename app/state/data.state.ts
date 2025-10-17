import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type Contact = {
  id: string
  type: "PRIVATE" | "GROUP"
  name?: string
  otherUser: {
    id: string
    username: string
    avatarUrl: string
    publicKey: string
  }
  lastMessage?: any
}

export type ClientData = {
  id: string
  username: string
  avatarUrl: string
  serverAddress: string
  serverPort: string
  serverKey: string
  publicKey: string
  privateKey: string
  pinHash: string
  visibility: "available" | "away" | "unseen"
  contacts: Contact[]
}

const clientData = atom<ClientData>({
  id: "cmfi9w0f60000vdfkbt0585l5",
  username: "SocketByte",
  avatarUrl: "https://github.com/shadcn.png",
  serverAddress: "89.69.180.180",
  serverPort: "51277",
  serverKey: "308a530fba8b685de8dbeb0e8aa7550ad232293185272061cd6c9f89f9f43d99",
  publicKey: "T+0cQCJxKR/NER76isvN556bxUR9FERyOA0h0UmVo08=",
  privateKey: "TwhTwPEpo0zHihOTwC50Pfmo9Z/nEq3GzXsgXmZzfvM=",
  pinHash: "$2a$12$1j451rE0545IQtly2FvJe.gQDAPLQsyiGTsCFh7uvl8snzdkTUC/u",
  visibility: "available",
  contacts: [],
})

const selectedContact = atom("mikigal")

export const useClientData = () => {
  return useAtom(clientData)
}

export const useSelectedContact = () => {
  return useAtom(selectedContact)
}

export const useContact = (): Contact | undefined => {
  const [data] = useAtom(clientData)
  const [selectedContactId] = useSelectedContact()

  return data.contacts.find((c) => c.id === selectedContactId || c.otherUser.id === selectedContactId)
}
