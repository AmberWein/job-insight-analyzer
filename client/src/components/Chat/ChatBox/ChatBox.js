// display the chat messages
function ChatBox({ messages }) {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.role === "user" ? "user" : "bot"}`}
        >
          <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
}

export default ChatBox;