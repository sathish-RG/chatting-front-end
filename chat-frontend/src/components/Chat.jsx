"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Sidebar from "./Sidebar"
import UserList from "./UserList"
import GroupList from "./GroupList"
import Profile from "./Profile"
import MessageArea from "./MessageArea"

function Chat() {
  const [activeTab, setActiveTab] = useState("users")
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [messages, setMessages] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(`http://localhost:5000/api/messages/user/${selectedUser._id}`)
    } else if (selectedGroup) {
      fetchMessages(`http://localhost:5000/api/messages/group/${selectedGroup._id}`)
    }
  }, [selectedUser, selectedGroup])

  const fetchMessages = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async (content, file) => {
    if (selectedUser || selectedGroup) {
      try {
        const formData = new FormData()
        formData.append("content", content)
        formData.append("chatId", selectedUser ? selectedUser._id : selectedGroup._id)
        if (file) {
          formData.append("file", file)
        }

        const response = await fetch("http://localhost:5000/api/messages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        })
        if (!response.ok) {
          throw new Error("Failed to send message")
        }
        const newMessage = await response.json()
        setMessages([...messages, newMessage])
      } catch (error) {
        console.error("Error sending message:", error)
      }
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to delete message")
      }
      setMessages(messages.filter((message) => message._id !== messageId))
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const editMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: newContent }),
      })
      if (!response.ok) {
        throw new Error("Failed to edit message")
      }
      const updatedMessage = await response.json()
      setMessages(messages.map((message) => (message._id === messageId ? updatedMessage : message)))
    } catch (error) {
      console.error("Error editing message:", error)
    }
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <UserList
            onSelectUser={(user) => {
              setSelectedUser(user)
              setSelectedGroup(null)
            }}
          />
        )
      case "groups":
        return (
          <GroupList
            onSelectGroup={(group) => {
              setSelectedGroup(group)
              setSelectedUser(null)
            }}
          />
        )
      case "profile":
        return <Profile />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex">
        <div className="w-64 bg-white border-r">{renderMainContent()}</div>
        <MessageArea
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          messages={messages}
          onSendMessage={sendMessage}
          onDeleteMessage={deleteMessage}
          onEditMessage={editMessage}
          currentUser={user}
        />
      </div>
    </div>
  )
}

export default Chat

