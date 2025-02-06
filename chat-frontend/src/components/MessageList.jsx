function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div key={message._id} className="mb-4">
          <strong>{message.sender.name}: </strong>
          {message.content}
        </div>
      ))}
    </div>
  )
}

export default MessageList

