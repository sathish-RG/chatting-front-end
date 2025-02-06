'use client';

import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Sidebar from './Sidebar'
import UserList from './UserList'
import GroupList from './GroupList'
import Profile from './Profile'
import MessageArea from './MessageArea'

function Chat() {
  const [activeTab, setActiveTab] = useState('users')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [messages, setMessages] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (selectedUser) {
      // Fetch messages for selected user
      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/messages/${selectedUser._id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
          const data = await response.json()
          setMessages(data)
        } catch (error) {
          console.error('Error fetching messages:', error)
        }
      }
      fetchMessages()
    } else if (selectedGroup) {
      // Fetch messages for selected group
      const fetchGroupMessages = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/messages/group/${selectedGroup._id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
          const data = await response.json()
          setMessages(data)
        } catch (error) {
          console.error('Error fetching group messages:', error)
        }
      }
      fetchGroupMessages()
    }
  }, [selectedUser, selectedGroup, user])

  const sendMessage = async (content, file) => {
    if (selectedUser || selectedGroup) {
      try {
        const formData = new FormData()
        formData.append('content', content)
        if (selectedUser) {
          formData.append('receiverId', selectedUser._id)
        } else {
          formData.append('groupId', selectedGroup._id)
        }
        if (file) {
          formData.append('file', file)
        }

        const response = await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
          body: formData
        })
        const newMessage = await response.json()
        setMessages([...messages, newMessage])
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserList onSelectUser={(user) => { setSelectedUser(user); setSelectedGroup(null); }} />
      case 'groups':
        return <GroupList onSelectGroup={(group) => { setSelectedGroup(group); setSelectedUser(null); }} />
      case 'profile':
        return <Profile />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex">
        <div className="w-64 bg-white border-r">
          {renderMainContent()}
        </div>
        <MessageArea 
          selectedUser={selectedUser} 
          selectedGroup={selectedGroup}
          messages={messages} 
          onSendMessage={sendMessage} 
        />
      </div>
    </div>
  )
}

export default Chat
