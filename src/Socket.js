import { io } from "socket.io-client";

 

const socket = io(import.meta.env.VITE_APP === "development" ? import.meta.env.VITE_LOCAL_BACKEND_URL : import.meta.env.VITE_BACKEND_URL , {
    transports: ['websocket'],
    secure: import.meta.env.VITE_APP !== "development",
    withCredentials:true
});


export  {socket}