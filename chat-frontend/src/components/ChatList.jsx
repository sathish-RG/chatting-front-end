function ChatList({ chats, onSelectChat }) {
  return (
    <div className="w-1/4 bg-white border-r">
      <h2 className="text-2xl font-bold p-4">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} className="p-4 hover:bg-gray-100 cursor-pointer" onClick={() => onSelectChat(chat)}>
            {chat.isGroupChat ? chat.chatName : chat.users[0].name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatList

