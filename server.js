// server.js
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  const io = new Server(server, {
    cors: { origin: "*" },
    path: "/api/socket"
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("chatMessage", (msg) => {
      io.emit("chatMessage", msg);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});
