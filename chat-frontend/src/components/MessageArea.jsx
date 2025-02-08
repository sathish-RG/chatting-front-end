"use client"

import { useState, useRef, useEffect } from "react"
import ChatInput from "./ChatInput"

function MessageArea({
  selectedUser,
  selectedGroup,
  messages,
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  currentUser,
}) {
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editContent, setEditContent] = useState("")
  const messageEndRef = useRef(null)

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom]) // Added scrollToBottom to dependencies

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500">Select a user or group to start chatting</p>
      </div>
    )
  }

  const recipient = selectedUser || selectedGroup
  const isGroupChat = !!selectedGroup

  const canEditDelete = (message) => {
    if (isGroupChat) {
      return message.sender._id === currentUser._id || selectedGroup.admin === currentUser._id
    }
    return message.sender._id === currentUser._id
  }

  const handleEdit = (message) => {
    setEditingMessageId(message._id)
    setEditContent(message.content)
  }

  const submitEdit = () => {
    onEditMessage(editingMessageId, editContent)
    setEditingMessageId(null)
    setEditContent("")
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b p-4">
        <h2 className="text-xl font-semibold">{recipient.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${message.sender._id === currentUser._id ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender._id === currentUser._id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {editingMessageId === message._id ? (
                <div>
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-1 mb-2 text-black"
                  />
                  <button onClick={submitEdit} className="text-xs text-white bg-green-500 px-2 py-1 rounded mr-2">
                    Save
                  </button>
                  <button
                    onClick={() => setEditingMessageId(null)}
                    className="text-xs text-white bg-red-500 px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p>{message.content}</p>
                  {message.fileUrl && (
                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                      Attached File
                    </a>
                  )}
                  {canEditDelete(message) && (
                    <div className="mt-1">
                      <button
                        onClick={() => handleEdit(message)}
                        className="text-xs text-white bg-yellow-500 px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteMessage(message._id)}
                        className="text-xs text-white bg-red-500 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  )
}

export default MessageArea

