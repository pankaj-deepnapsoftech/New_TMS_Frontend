import { io } from "socket.io-client";
import { config } from "./config/env.config";

 

 export const socket = io(config.Dev === "development" ? config.LOCAL_BACKEND_URL : config.BACKEND_URL , {
    transports: ['websocket'],
    secure: config.Dev !== "development",
    withCredentials:true
});


