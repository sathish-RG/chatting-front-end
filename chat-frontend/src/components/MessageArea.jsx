import ChatInput from "./ChatInput"

function MessageArea({ selectedUser, messages, onSendMessage }) {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500">Select a user to start chatting</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b p-4">
        <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message._id} className={`mb-4 ${message.sender === selectedUser._id ? "text-left" : "text-right"}`}>
            <div
              className={`inline-block p-2 rounded-lg ${message.sender === selectedUser._id ? "bg-gray-200" : "bg-blue-500 text-white"}`}
            >
              <p>{message.content}</p>
              {message.fileUrl && (
                <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                  Attached File
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  )
}

export default MessageArea

