

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function Chat() {
//   const navigate = useNavigate();
//   const [userProjects, setUserProjects] = useState([]);

//   useEffect(() => {
//     const fetchUserProjects = async () => {
//       try {
//         // Retrieve user ID from local storage
//         const userId = localStorage.getItem("user_id");

//         // Fetch user's projects data
//         const response = await fetch(
//           `http://127.0.0.1:8000/projects/user-projects/${userId}`
//         );
//         const data = await response.json();

//         const projectsWithFullIconPaths = data.map((project) => {
//           return {
//             ...project,
//             icon: `http://127.0.0.1:8000${project.icon}`, // Assuming the server serves static files at this URL
//           };
//         });

//         setUserProjects(projectsWithFullIconPaths);
//       } catch (error) {
//         console.error("Error fetching user projects:", error);
//       }
//     };

//     fetchUserProjects();
//   }, []);

//   const handleProjectClick = (projectId) => {
//     // Navigating to the project details page
//     navigate(`/chat/${projectId}`);
//   };

//   return (
//     <div className="flex flex-col w-full h-full pt-2 pl-3 pr-3 pb-2 ">
//       <div className="flex flex-1 flex-col pt-6 pr-5 pl-2 rounded-xl bg-slate-50 shadow-[0px_0px_4px_rgba(0,0,0,0.35)]">
//         <div className="flex gap-5 w-full">
//           <div className="flex-auto pl-4 text-3xl font-semibold text-black">
//             Teams
//           </div>
//         </div>
//         <div className="mt-3.5 h-px bg-black" />
//         {userProjects.map((project) => (
//           <div
//             key={project.proj_id}
//             className="flex gap-5 items-start px-6 pt-4 pb-3 mt-2 ml-3 text-2xl font-semibold text-black text-xl rounded-md bg-slate-50 shadow-[0px_4px_4px_rgba(0,0,0,0.35)]"
//             onClick={() => handleProjectClick(project.proj_id)}
//             style={{ cursor: "pointer" }}
//           >
//             <div
//               className="shrink-0 self-start w-10 h-10 rounded-full flex justify-center items-center overflow-hidden "
//               // style={{ backgroundColor: `rgba(77, 152, 157, 0.5)` }}
//             >
//               <img
//                 src={project.icon}
//                 alt={`${project.proj_name} Logo`}
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             </div>
//             <div className="flex-auto my-auto">{project.proj_name}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Chat;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        // Retrieve user ID from local storage
        const userId = localStorage.getItem("user_id");

        // Fetch user's projects data
        const response = await fetch(
          `http://127.0.0.1:8000/chat/chatroom/users/${userId}`
        );
        const data = await response.json();
        const projectData = data.project_details
        const chatroomData = data.chatroom_data
        localStorage.setItem('chatroom_id', JSON.stringify(chatroomData));

        const projectsWithFullIconPaths = projectData.map((project) => {
          return {
            ...project,
            icon: `http://127.0.0.1:8000${project.icon}`, // Assuming the server serves static files at this URL
          };
        });

        setUserProjects(projectsWithFullIconPaths);
      } catch (error) {
        console.error("Error fetching user projects:", error);
      }
    };

    fetchUserProjects();

    // return () => {
    //   localStorage.removeItem("project_id");
    // };
  }, []);

  const handleProjectClick = (projectId) => {
    // Update local storage with the clicked project ID
    localStorage.setItem("project_id", projectId);
    // Navigate to the project details page
    navigate(`/chat/${projectId}`);
  };

  return (
    <div className="flex flex-col w-full h-full pt-2 pl-3 pr-3 pb-2 ">
      <div className="flex flex-1 flex-col pt-6 pr-5 pl-2 rounded-xl bg-slate-50 shadow-[0px_0px_4px_rgba(0,0,0,0.35)]">
        <div className="flex gap-5 w-full">
          <div className="flex-auto pl-4 text-3xl font-semibold text-black">
            Teams
          </div>
        </div>
        <div className="mt-3.5 h-px bg-black" />
        {userProjects.map((project) => (
          <div
            key={project.proj_id}
            className="flex gap-5 items-start px-6 pt-4 pb-3 mt-2 ml-3 text-2xl font-semibold text-black text-xl rounded-md bg-slate-50 shadow-[0px_4px_4px_rgba(0,0,0,0.35)]"
            onClick={() => handleProjectClick(project.proj_id)}
            style={{ cursor: "pointer" }}
          >
            <div
              className="shrink-0 self-start w-10 h-10 rounded-full flex justify-center items-center overflow-hidden "
              // style={{ backgroundColor: `rgba(77, 152, 157, 0.5)` }}
            >
              <img
                src={project.icon}
                alt={`${project.proj_name} Logo`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="flex-auto my-auto">{project.proj_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
