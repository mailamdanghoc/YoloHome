import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

interface Response {
    light?: any;
}

socket.on("connect", () => {
    console.log("Connected to the server!");
});

socket.on("disconnect", () => {
    console.log("Disconnected from the server!");
})

export default socket;
