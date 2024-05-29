import React, { useState, useEffect, useRef, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane,faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@mui/material/Avatar';
import '../../App.css';

function TeamDetails() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [projectDetails, setProjectDetails] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [showTeamMembers, setShowTeamMembers] = useState(false);
  const websocket = useRef(null);
  const [projectMemberId, setProjectMemberId] = useState(null);
  const messagesEndRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const dropdownRef = useRef(null);
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null); // State to hold the selected message
  const [showOptions, setShowOptions] = useState(false);


  const goBack = () => {
    window.location.href = '/chat';
  };
  const backendUrl = 'http://127.0.0.1:8000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const handleImageClick = (imageUrl) => {
      setSelectedImage(imageUrl);
    };
    
    const handleCloseImage = () => {
      setSelectedImage(null);
    };
  };


  const userId = JSON.parse(localStorage.getItem('user_id'));
  const chatroom_id = JSON.parse(localStorage.getItem('chatroom_id'));
  const projectId = localStorage.getItem("project_id");

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({bottom: 0,  behavior: 'smooth' });
    }
  };


  useEffect(() => {
    const fetchMessages = async () => {
      try{
        const response = await fetch(`${backendUrl}/chat/chatroom/${chatroom_id}/messages/`)
        const data = await response.json();
        setMessages(data);
        scrollToBottom();

        const memberId = await fetch(`${backendUrl}/projects/user-details/${userId}/${projectId}/`);
        const memberIdData = await memberId.json();
        if (Array.isArray(memberIdData) && memberIdData.length > 0) {
          const firstMemberData = memberIdData[0];
          const memberId = firstMemberData.id;
          setProjectMemberId(memberId);
        } else {
          console.log('Error getting Project Member id');
        }
      }catch(e){
        console.error('Error fetching messages', e);
      }
    };

    fetchMessages();
  }, [chatroom_id, userId]);

  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chatroom/${chatroom_id}/`);

    socket.onopen = () => {
      console.log('Websocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.onclose = (e) => {
      console.log('Websocket connection closed', e);
    };

    socket.onerror = (error) => {
      console.error('Websocket error', error);
    };

    websocket.current = socket;

    return () => {
      if(websocket.current){
        websocket.current.close();
      }
    };
  }, [chatroom_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() !=='') {
      const messageData = {
        chatroom: chatroom_id,
        sender: projectMemberId,
        message: input,
      };

      if(websocket.current.readyState === WebSocket.OPEN){
        websocket.current.send(JSON.stringify(messageData));
        console.log("Message sent", messageData);
        setInput('');        
      }else{
        console.error('Websocket is not open');
      }
    }
  }


  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (projectId) {
          const response = await fetch(`${backendUrl}/projects/${projectId}/`);
          const data = await response.json();
          if (data.icon) {
            data.icon = `${backendUrl}${data.icon}`;
          }
          setProjectDetails(data);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);


  const fetchTeamMembers = async () => {
    try {
      if (projectId) {
        const response = await fetch(`${backendUrl}/projects/project-members/${projectId}/`);
        const data = await response.json();
        setTeamMembers(data);
        setShowTeamMembers(true);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };


  const handleTeamMemberClick = (username) => {
    setInput(`${input}@${username} `);
    setShowTeamMembers(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTeamMembers(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Calculate max width with slight delay to allow re-rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setMaxWidth(Math.min(window.innerWidth * 0.5, 500)); // Adjust 500 as desired max width
    }, 100); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="flex border flex-col pr-2 pl-2 rounded-md h-screen">
       <div className="flex items-center justify-between pt-4 pl-4">
        <div className="flex items-center">
          <FontAwesomeIcon onClick={goBack} className="hover:text-gray-500" icon={faArrowLeft} size="lg" />
          {projectDetails && (
            <div className="flex items-center ml-2">
              <img src={projectDetails.icon} alt="Project Logo" className="w-10 h-10 ml-1 mr-4" />
              <span className="text-xl font-bold">{projectDetails.proj_name}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 border-gray-300 bg-white">
        {/* {messages.map((message, index) => (
          <div key={index}>
            <div className={`rounded p-2 my-2 max-w-xs ${
              message.user_id === userId ? "bg-yellow-200 ml-auto rounded-lg rounded-tr-none mr-8 self-message" : "bg-[#4D989D] mr-auto rounded-lg rounded-tl-none ml-8 other-message"}`}>
              <Avatar src={`http://127.0.0.1:8000/media/${message.user_image}`} alt={message.username} />
              <strong className="text-black">{message.username}</strong>
              <p className="text-black">{message.message}</p>
              {message.sent_at}
            </div>
          </div>
        ))} */}
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            {message.user_id === userId
            ? <div className="flex items-center justify-end mb-1">
              <div className="flex items-center">
                <span className="text-sm font-bold mr-2">You</span>
                <Avatar src={`${backendUrl}/media/${message.user_image}`} alt={message.username} />
              </div>
            </div>
            : <div className="flex items-center justify-start mb-1">
            <div className="flex items-center">
              <Avatar src={`${backendUrl}/media/${message.user_image}`} alt={message.username} />
              <span className="text-sm font-bold ml-2">{message.username}</span>
            </div>
          </div>
            }
            <div className={`rounded p-2 ${
                message.user_id === userId
                  ? "bg-[#D9D9D9] ml-auto rounded-lg rounded-tr-none mr-8 self-message"
                  : "bg-[#4D989D] mr-auto rounded-lg rounded-tl-none ml-8 other-message"
              }`}
              style={{
                justifySelf: message.user_id === userId ? 'flex-end' : 'flex-start',
                minWidth: '50px', // Set a minimum width for the message bubble
                width: 'max-content', // Set a fixed width for all messages, adjust as needed
                maxWidth: `${maxWidth}px`,
                position: 'relative',
              }}><div className="mt-1">{message.message}</div></div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex items-center pl-8 pr-12 pb-32 relative" onSubmit={sendMessage}>
        <div className="relative flex-grow">
          <span
            className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black-200"
            style={{ fontSize: '20px', fontWeight: 'bold' }}
            onClick={fetchTeamMembers}
          >
            @
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-3 pl-9 bg-[#DBDBDB] border-none rounded-full focus:outline-none"
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer">
            <label htmlFor="fileInput">
              <FontAwesomeIcon icon={faPaperclip} size="lg" className="text-gray-700 hover:text-gray-900" />
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept=".docx,.doc,.pdf,.xls,.ppt,image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {showTeamMembers && (
            <div className="absolute bottom-14 bg-white border border-gray-300 rounded-lg mt-2 max-h-32 overflow-y-auto w-48 z-10 p-2">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleTeamMemberClick(member.username)}
                >
                  <div className="flex items-center">
                    <Avatar src={`${backendUrl}/media/${member.image}`} alt={member.username} sx={{width: 26, height: 26}}/>
                    <span className="ml-3">{member.username}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="ml-2 bg-[#4D989D] hover:bg-blue-700 text-white rounded-full p-2"
          style={{ outline: 'none' }}
        >
          <FontAwesomeIcon icon={faPaperPlane} size="lg" />
        </button>
      </form> 
    </div>
  );
}

export default TeamDetails;
