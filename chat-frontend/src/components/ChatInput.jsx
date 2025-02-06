"use client"

import { useState } from "react"
import { Paperclip, Send } from "lucide-react"

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("")
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() || file) {
      onSendMessage(message, file)
      setMessage("")
      setFile(null)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t p-4 flex items-center">
      <label htmlFor="file-upload" className="cursor-pointer mr-2">
        <Paperclip className="text-gray-500" />
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
      {file && <span className="text-sm text-gray-500 mr-2">{file.name}</span>}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="ml-2 text-blue-500">
        <Send />
      </button>
    </form>
  )
}

export default ChatInput

