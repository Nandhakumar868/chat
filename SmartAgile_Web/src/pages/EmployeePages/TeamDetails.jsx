// import React, { useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// function TeamDetails() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       setMessages([...messages, { text: input, user: "self" }]);
//       setInput("");
//     }
//   };

//   return (
//     <div className="  border border-gray-300 rounded-md  w-full h-full pt-2 pl-3 pr-3 pb-2">
//       <div className="h-80 overflow-y-auto p-4 border-gray-300 mb-4 bg-white">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`rounded p-2 my-2 max-w-xs ${
//               message.user === "self"
//                 ? "bg-blue-300 ml-auto"
//                 : "bg-gray-200 mr-auto"
//             }`}
//           >
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <form className="flex items-center" onSubmit={sendMessage}>
//         <div className="relative flex-grow">
//           <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-200"  style={{ fontSize: '20px', fontWeight: 'bold' }}>@</span>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message..."
//             className="w-full p-2 pl-9 bg-[#DBDBDB] border border-gray-300 rounded-full focus:outline-none"
//           />
//         </div>
//         <button
//           type="submit"
//           className="ml-2 bg-[#4D989D] hover:bg-blue-700 text-white"
//           style={{
//             width: '48px',
//             height: '48px',
//             borderRadius: '50%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             outline: 'none'
//           }}
//         >
//           <FontAwesomeIcon icon={faPaperPlane} size="lg" />
//         </button>
//       </form>
//     </div>
//   );
// }

// export default TeamDetails;


// import React, { useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// function TeamDetails() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const goBack = () => {
//     window.location.href = '/chat';
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       setMessages([...messages, { text: input, user: "self" }]);
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex border flex-col pr-2 pl-2 rounded-md h-screen">
//        <div className="flex items-center justify-between pt-4 pl-4">
//         <div>
          
//             <FontAwesomeIcon onClick={goBack} className="hover:text-gray-500" icon={faArrowLeft} size="md" />
         
//         </div>
//         <div className="text-lg font-semibold">Chat</div>
//         <div></div>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 border-gray-300 bg-white">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`rounded p-2 my-2 max-w-xs ${
//               message.user === "self"
//                 ? "bg-blue-300 ml-auto"
//                 : "bg-gray-200 mr-auto"
//             }`}
//           >
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <form className="flex items-center pl-8 pr-12  pb-32 " onSubmit={sendMessage}>
//         <div className="relative flex-grow">
//           <span className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black-200" style={{ fontSize: '20px', fontWeight: 'bold' }}>@</span>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message..."
//             className="w-full p-3 pl-9 bg-[#DBDBDB] border-none rounded-full focus:outline-none"
//           />
//         </div>
//         <button
//           type="submit"
//           className="ml-2 bg-[#4D989D] hover:bg-blue-700 text-white rounded-full p-2"
//           style={{ outline: 'none' }}
//         >
//           <FontAwesomeIcon icon={faPaperPlane} size="lg" />
//         </button>
//       </form>
//     </div>
//   );
// }

// export default TeamDetails;




// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// function TeamDetails() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [projectDetails, setProjectDetails] = useState({});

//   const goBack = () => {
//     window.location.href = '/chat';
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       setMessages([...messages, { text: input, user: "self" }]);
//       setInput("");
//     }
//   };

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       try {
//         // Retrieve project_id from local storage
//         const projectId = localStorage.getItem("project_id");
//         if (projectId) {
//           // Fetch project details using the project_id
//           const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}`);
//           const data = await response.json();
//           // Assuming the icon URL is available in the project details response
//           if (data.icon) {
//             data.icon = `http://127.0.0.1:8000${data.icon}`; // Assuming the server serves static files at this URL
//           }
//           setProjectDetails(data);
//         }
//       } catch (error) {
//         console.error("Error fetching project details:", error);
//       }
//     };

//     fetchProjectDetails();
//   }, []);

//   return (
//     <div className="flex border flex-col pr-2 pl-2 rounded-md h-screen">
//        <div className="flex items-center justify-between pt-4 pl-4">
//         <div>
//           <FontAwesomeIcon onClick={goBack} className="hover:text-gray-500" icon={faArrowLeft} size="md" />
//           {projectDetails && (
//             <div className="flex items-center ml-2">
//               <img src={projectDetails.icon} alt="Project Logo" className="w-8 h-8 mr-2" />
//               <span className="text-lg font-semibold">{projectDetails.proj_name}</span>
//             </div>
//           )}
//         </div>
        
//         <div></div>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 border-gray-300 bg-white">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`rounded p-2 my-2 max-w-xs ${
//               message.user === "self"
//                 ? "bg-blue-300 ml-auto"
//                 : "bg-gray-200 mr-auto"
//             }`}
//           >
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <form className="flex items-center pl-8 pr-12  pb-32 " onSubmit={sendMessage}>
//         <div className="relative flex-grow">
//           <span className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black-200" style={{ fontSize: '20px', fontWeight: 'bold' }}>@</span>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message..."
//             className="w-full p-3 pl-9 bg-[#DBDBDB] border-none rounded-full focus:outline-none"
//           />
//         </div>
//         <button
//           type="submit"
//           className="ml-2 bg-[#4D989D] hover:bg-blue-700 text-white rounded-full p-2"
//           style={{ outline: 'none' }}
//         >
//           <FontAwesomeIcon icon={faPaperPlane} size="lg" />
//         </button>
//       </form>
//     </div>
//   );
// }

// export default TeamDetails;


// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// function TeamDetails() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [projectDetails, setProjectDetails] = useState({});

//   const goBack = () => {
//     window.location.href = '/chat';
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       setMessages([...messages, { text: input, user: "self" }]);
//       setInput("");
//     }
//   };

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       try {
//         // Retrieve project_id from local storage
//         const projectId = localStorage.getItem("project_id");
//         if (projectId) {
//           // Fetch project details using the project_id
//           const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}`);
//           const data = await response.json();
//           // Assuming the icon URL is available in the project details response
//           if (data.icon) {
//             data.icon = `http://127.0.0.1:8000${data.icon}`; // Assuming the server serves static files at this URL
//           }
//           setProjectDetails(data);
//         }
//       } catch (error) {
//         console.error("Error fetching project details:", error);
//       }
//     };

//     fetchProjectDetails();
//   }, []);

//   return (
//     <div className="flex border flex-col pr-2 pl-2 rounded-md h-screen">
//        <div className="flex items-center justify-between pt-4 pl-4">
//         <div className="flex items-center">
//           <FontAwesomeIcon onClick={goBack} className="hover:text-gray-500" icon={faArrowLeft} size="md" />
//           {projectDetails && (
//             <div className="flex items-center ml-2">
//               <img src={projectDetails.icon} alt="Project Logo" className="w-10 h-10 ml-1 mr-4" />
//               <span className="text-xl font-bold">{projectDetails.proj_name}</span>
//             </div>
//           )}
//         </div>
        
//         <div></div>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 border-gray-300 bg-white">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`rounded p-2 my-2 max-w-xs ${
//               message.user === "self"
//                 ? "bg-blue-300 ml-auto"
//                 : "bg-gray-200 mr-auto"
//             }`}
//           >
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <form className="flex items-center pl-8 pr-12  pb-32 " onSubmit={sendMessage}>
//         <div className="relative flex-grow">
//           <span className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black-200" style={{ fontSize: '20px', fontWeight: 'bold' }}>@</span>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message..."
//             className="w-full p-3 pl-9 bg-[#DBDBDB] border-none rounded-full focus:outline-none"
//           />
//         </div>
//         <button
//           type="submit"
//           className="ml-2 bg-[#4D989D] hover:bg-blue-700 text-white rounded-full p-2"
//           style={{ outline: 'none' }}
//         >
//           <FontAwesomeIcon icon={faPaperPlane} size="lg" />
//         </button>
//       </form>
//     </div>
//   );
// }

// export default TeamDetails;


import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function TeamDetails() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [projectDetails, setProjectDetails] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [showTeamMembers, setShowTeamMembers] = useState(false);
  const websocketRef = useRef(null);

  const goBack = () => {
    window.location.href = '/chat';
  };


  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, user: "self" }]);
      setInput("");
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectId = localStorage.getItem("project_id");
        if (projectId) {
          const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}`);
          const data = await response.json();
          if (data.icon) {
            data.icon = `http://127.0.0.1:8000${data.icon}`;
          }
          setProjectDetails(data);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, []);

  const projectId = localStorage.getItem("project_id");
  
  useEffect(() => {
    if(projectId){
      const websocket = new WebSocket(`ws://127:0.0.1:8000/ws/chatroom/1`);
      websocketRef.current = websocket;

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, {text:data.message, user:data.user}]);
      };

      websocket.onclose = () => {
        console.log('Web socket connection closed');
      };

      return () => {
        websocket.close();
      }
    }
  })

  const fetchTeamMembers = async () => {
    try {
      if (projectId) {
        const response = await fetch(`http://127.0.0.1:8000/projects/project-members/${projectId}`);
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

  return (
    <div className="flex border flex-col pr-2 pl-2 rounded-md h-screen">
       <div className="flex items-center justify-between pt-4 pl-4">
        <div className="flex items-center">
          <FontAwesomeIcon onClick={goBack} className="hover:text-gray-500" icon={faArrowLeft} size="md" />
          {projectDetails && (
            <div className="flex items-center ml-2">
              <img src={projectDetails.icon} alt="Project Logo" className="w-10 h-10 ml-1 mr-4" />
              <span className="text-xl font-bold">{projectDetails.proj_name}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 border-gray-300 bg-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded p-2 my-2 max-w-xs ${
              message.user === "self"
                ? "bg-blue-300 ml-auto"
                : "bg-gray-200 mr-auto"
            }`}
          >
            {message.text}
          </div>
        ))}
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
          {showTeamMembers && (
            <div className="absolute bottom-14 bg-white border border-gray-300 rounded-lg mt-2 max-h-32 overflow-y-auto w-48 z-10 p-2">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleTeamMemberClick(member.username)}
                >
                  {member.username}
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
