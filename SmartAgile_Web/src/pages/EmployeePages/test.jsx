// ChatRoom.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatRoom = ({ chatroomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const websocket = useRef(null);

  useEffect(() => {
    // Fetch initial messages from the REST API
    axios.get(`/chat/chatroom/${chatroomId}/messages`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });

    // Set up WebSocket connection
    const socket = new WebSocket(`ws://${window.location.host}/ws/chatroom/${chatroomId}/`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocket.current = socket;

    return () => {
      socket.close();
    };
  }, [chatroomId]);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        sender: userId,
        message: newMessage,
      };

      // Send message via WebSocket
      websocket.current.send(JSON.stringify(messageData));

      // Optionally, send message via REST API (as a fallback or for persistence)
      axios.post(`/chat/chatroom/${chatroomId}/messages`, messageData)
        .then(response => {
          setNewMessage('');
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
