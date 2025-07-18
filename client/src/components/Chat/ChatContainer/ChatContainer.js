import { useState, useCallback, useEffect, useRef } from "react";
import ChatBox from "../ChatBox/ChatBox";
import ChatInput from "../ChatInput/ChatInput";
import "../Chat.css";

const ROLE_USER = "user";
const ROLE_BOT = "bot";

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatBoxRef = useRef(null);

  // scroll to bottom when messages update
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (userMessage) => {
    const trimmed = userMessage.trim();
    if (!trimmed) return;

    // add user message immediately
    setMessages((prev) => [...prev, { role: ROLE_USER, text: trimmed }]);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      let botResponse = data.response;
      if (typeof botResponse === "object") {
        botResponse = JSON.stringify(botResponse, null, 2);
      }
      setMessages((prev) => [...prev, { role: ROLE_BOT, text: botResponse }]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        { role: ROLE_BOT, text: "Error processing request. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }, []);

  return (
    <div className="chat-container">
      <ChatBox messages={messages} ref={chatBoxRef} />
      <ChatInput onSend={sendMessage} disabled={isSending} />
    </div>
  );
}

export default ChatContainer;
