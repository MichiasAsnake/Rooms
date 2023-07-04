import React, { useEffect, useState, useRef } from "react";
import "firebase/firestore";
import { store } from "./firebase";
import socket from "./socket"; // Import the socket instance

const Chat = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null);
  

  useEffect(() => {
    const unsubscribe = store
      .collection("chatMessages")
      .where("roomId", "==", roomId)
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setMessages(data);
      });

    return () => unsubscribe();
  }, [roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() !== "") {
      // Send the chat message to the server
      store.collection("chatMessages").add({
        roomId,
        sender: username, // Use the prop username instead of the state
        message: newMessage,
        timestamp: new Date(),
      });

      // Clear the message input
      setNewMessage("");
    }
  };
 
  useEffect(() => {
    // Scroll to the bottom of the chat box whenever new messages are added
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="w-[384px] h-[895px] bg-slate-300">
      <div className="overflow-y-auto h-[770px] overflow-x-hidden overflow w-[384px] break-words">
        <ul className="p-2" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.sender}:</strong> {message.message}
            </li>
          ))}
        </ul>
      </div>
      <form
        className="flex flex-col bg-slate-300 items-end pr-4 pt-3 h-10 w-500px"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message"
          className=" w-[350px] p-3 mb-2 rounded-2xl"
        />
        <button
          type="submit"
          className=" w-[70px] px-4 py-2 rounded-md bg-blue-500 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
