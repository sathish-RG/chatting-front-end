"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function EditGroupModal({ isOpen, onClose, onEditGroup, group }) {
  const [groupName, setGroupName] = useState(group.name)
  const [members, setMembers] = useState(group.members)
  const [availableUsers, setAvailableUsers] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        if (response.ok) {
          const users = await response.json()
          setAvailableUsers(users.filter((u) => u._id !== user._id && !members.some((member) => member._id === u._id)))
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen, user, members])

  const handleSubmit = (e) => {
    e.preventDefault()
    const originalMembers = new Set(group.members.map((member) => member._id))
    const currentMembers = new Set(members.map((member) => member._id))

    const membersToAdd = [...currentMembers].filter((x) => !originalMembers.has(x))
    const membersToRemove = [...originalMembers].filter((x) => !currentMembers.has(x))

    onEditGroup(group._id, groupName, membersToAdd, membersToRemove)
  }

  const toggleMember = (userToToggle) => {
    setMembers((prevMembers) =>
      prevMembers.some((member) => member._id === userToToggle._id)
        ? prevMembers.filter((member) => member._id !== userToToggle._id)
        : [...prevMembers, userToToggle],
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Group</h3>
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
            <p className="mb-2 font-medium">Current Members:</p>
            {members.map((member) => (
              <div key={member._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`member-${member._id}`}
                  checked={true}
                  onChange={() => toggleMember(member)}
                  className="mr-2"
                />
                <label htmlFor={`member-${member._id}`} className="flex items-center">
                  <img
                    src={member.profilePhoto || "/default-avatar.png"}
                    alt={member.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {member.name}
                </label>
              </div>
            ))}
            <p className="mb-2 font-medium mt-4">Add Members:</p>
            {availableUsers.map((user) => (
              <div key={user._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`user-${user._id}`}
                  checked={members.some((member) => member._id === user._id)}
                  onChange={() => toggleMember(user)}
                  className="mr-2"
                />
                <label htmlFor={`user-${user._id}`} className="flex items-center">
                  <img
                    src={user.profilePhoto || "/default-avatar.png"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {user.name}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Update Group
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditGroupModal

