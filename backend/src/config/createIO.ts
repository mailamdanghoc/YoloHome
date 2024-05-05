import { Server as IOServer, ServerOptions } from "socket.io";
import { Server as HTTPServer } from "http";
import SocketIOService from "../services/socketio.service";

function createIO(httpServer: HTTPServer, options: Partial<ServerOptions>): IOServer {
  return SocketIOService.getIO(httpServer, options);
}

export default createIO;
