import { Server as IOServer, ServerOptions } from "socket.io";
import { Server as HTTPServer } from "http";

class SocketIOService {
  private static _io: IOServer;

  public static getIO(httpServer?: HTTPServer, options: Partial<ServerOptions> = {}) {
    if (!SocketIOService._io) {
      if (httpServer === undefined) {
        throw new Error("Socket IO Server requires an http server!");
      }
      SocketIOService._io = new IOServer(httpServer, options);
    } else if (httpServer !== undefined) {
      throw new Error("Socket IO Server is already initialized!");
    }
    return SocketIOService._io;
  }
}

export default SocketIOService;
