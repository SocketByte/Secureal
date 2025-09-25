import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { Contact, useClientData, useSelectedContact } from "@/app/state/data.state"
import { useEffect, useState } from "react"

interface UserProps {
  name: string
  lastMessage: string
  lastMessageDate: number
  avatarUrl?: string
  selected?: boolean
}

const User = (props: UserProps) => {
  const { name, lastMessage, lastMessageDate, avatarUrl, selected } = props

  return (
    <div
      className={cn(
        "flex items-center w-full px-3 py-3 bg-transparent hover:bg-secondary/70 cursor-pointer select-none",
        {
          "bg-primary text-white hover:bg-primary": selected,
        }
      )}
    >
      <div className="mr-3 flex-shrink-0">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col flex-1 justify-center min-w-0">
        <div className="flex justify-between items-center min-w-0">
          <span className="font-medium truncate min-w-0 leading-5">{name}</span>
          <time
            className={cn("text-xs text-muted-foreground ml-2 flex-shrink-0", {
              "text-white": selected,
            })}
          >
            {new Date(lastMessageDate).toLocaleTimeString(["pl-PL"], {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </time>
        </div>

        <div className="min-w-0">
          <p
            className={cn("text-xs text-muted-foreground truncate", {
              "text-white": selected,
            })}
          >
            {lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export const Users = () => {
  const [selectedContact, setSelectedContact] = useSelectedContact()
  const [data, setData] = useClientData()

  const [contacts, setContacts] = useState<Contact[]>()
  useEffect(() => {
    if (data) {
      fetch(`http://${data.serverAddress}:${data.serverPort}/user/${data.id}/chats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.serverKey}`,
        },
      })
        .then((res) => res.json())
        .then((json: Contact[]) => {
          if (contacts) {
            json.forEach((newContact) => {
              const oldContact = contacts.find((c) => c.otherUser.id === newContact.otherUser.id)
              if (oldContact && oldContact.otherUser.publicKey !== newContact.otherUser.publicKey) {
                // TODO: Mark this user as illegitimate
                console.log(`public key changed for ${newContact.otherUser.id}`)
              }
            })
          }

          setContacts(json)
          setData({
            ...data,
            contacts: json,
          })

          if (json.length > 0) {
            setSelectedContact(json[0].otherUser.id)
          }
        })
    }
  }, [])

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="p-3">
        <Input name="search" placeholder="Search..." className="bg-background/30!" />
      </div>

      <div className="flex-1 min-h-0 w-full">
        <div className="flex flex-col min-w-0 overflow-auto">
          {contacts &&
            contacts.map((contact) => (
              <div
                className="w-full h-full"
                key={contact.otherUser.username}
                onClick={() => {
                  setSelectedContact(contact.otherUser.id)
                }}
              >
                <User
                  name={contact.otherUser.username}
                  lastMessage="<TBD>"
                  lastMessageDate={Date.now()}
                  avatarUrl={contact.otherUser.avatarUrl}
                  selected={selectedContact === contact.otherUser.id}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
