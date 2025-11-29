// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export function getSocket(): Socket {
//   if (!socket) {
//     socket = io("/", {
//       path: "/api/socket"
//     });
//   }
//   return socket;
// }
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:3000", {
      path: "/api/socket",
    });
  }
  return socket;
}
