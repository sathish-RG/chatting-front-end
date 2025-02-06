"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data.filter((u) => u._id !== user._id))
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()

    // Set up WebSocket connection for real-time status updates
    const socket = new WebSocket("ws://localhost:5000")

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "statusUpdate") {
        setUsers((prevUsers) => prevUsers.map((u) => (u._id === data.userId ? { ...u, status: data.status } : u)))
      }
    }

    return () => {
      socket.close()
    }
  }, [user])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Users</h2>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <li key={user._id} className="p-4 hover:bg-gray-100 cursor-pointer" onClick={() => onSelectUser(user)}>
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={user.profilePhoto || "/default-avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    user.status === "online" ? "bg-green-500" : user.status === "away" ? "bg-yellow-500" : "bg-gray-500"
                  }`}
                ></span>
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList

