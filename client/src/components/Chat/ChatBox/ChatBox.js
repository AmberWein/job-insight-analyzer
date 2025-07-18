// // display the chat messages
// function ChatBox({ messages }) {
//   return (
//     <div className="chat-box">
//       {messages.map((msg, index) => (
//         <div
//           key={index}
//           className={`message ${msg.role === "user" ? "user" : "bot"}`}
//         >
//           <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.text}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ChatBox;


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