import StructuredResponse from "../StructuredResponse/StructuredResponse";

function ChatBox({ messages }) {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => {
        const isBot = msg.role === "bot";
        let content;

        // try to parse bot messages as JSON
        if (isBot) {
          try {
            const parsed = JSON.parse(msg.text);
            content = <StructuredResponse data={parsed} />;
          } catch {
            content = msg.text;
          }
        } else {
          content = msg.text;
        }

        return (
          <div key={index} className={`message ${isBot ? "bot" : "user"}`}>
            <strong>{isBot ? "Assistant" : "You"}:</strong> {content}
          </div>
        );
      })}
    </div>
  );
}

export default ChatBox;