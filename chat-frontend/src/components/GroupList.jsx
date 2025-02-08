"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import CreateGroupModal from "./CreateGroupModal"
import EditGroupModal from "./EditGroupModal"

function GroupList({ onSelectGroup }) {
  const [groups, setGroups] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/groups", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch groups")
      }
      const data = await response.json()
      setGroups(data)
    } catch (error) {
      console.error("Error fetching groups:", error)
    }
  }

  const handleCreateGroup = async (groupName, selectedUsers) => {
    try {
      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: groupName, members: selectedUsers }),
      })
      if (!response.ok) {
        throw new Error("Failed to create group")
      }
      const newGroup = await response.json()
      setGroups([...groups, newGroup])
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("Error creating group:", error)
    }
  }

  const handleEditGroup = async (groupId, groupName, membersToAdd, membersToRemove) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: groupName, addMembers: membersToAdd, removeMembers: membersToRemove }),
      })
      if (!response.ok) {
        throw new Error("Failed to update group")
      }
      const updatedGroup = await response.json()
      setGroups(groups.map((group) => (group._id === updatedGroup._id ? updatedGroup : group)))
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating group:", error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Groups</h2>
        <button
          className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Group
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <li key={group._id} className="p-4 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center justify-between">
              <div onClick={() => onSelectGroup(group)}>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-gray-500">{group.members.length} members</p>
              </div>
              {group.admin === user._id && (
                <button
                  onClick={() => {
                    setSelectedGroup(group)
                    setIsEditModalOpen(true)
                  }}
                  className="bg-gray-200 text-gray-700 py-1 px-2 rounded text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
      {selectedGroup && (
        <EditGroupModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEditGroup={handleEditGroup}
          group={selectedGroup}
        />
      )}
    </div>
  )
}

export default GroupList

