'use client';

import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function CreateGroupModal({ isOpen, onClose, onCreateGroup }) {
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [availableUsers, setAvailableUsers] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
        if (response.ok) {
          const users = await response.json()
          setAvailableUsers(users.filter(u => u._id !== user._id))
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen, user])

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateGroup(groupName, selectedUsers)
    setGroupName('')
    setSelectedUsers([])
    onClose()
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create New Group</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div className="mb-4 max-h-60 overflow-y-auto">
            <p className="mb-2 font-medium">Select Users:</p>
            {availableUsers.map(user => (
              <div key={user._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={user._id}
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="mr-2"
                />
                <label htmlFor={user._id} className="flex items-center">
                  <img src={user.profilePhoto || '/default-avatar.png'} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                  {user.name}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGroupModal
