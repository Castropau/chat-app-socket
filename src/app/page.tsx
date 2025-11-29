"use client";

import { useEffect, useState } from "react";
import { getSocket } from "./lib/socket-client";
// import { getSocket } from "@/lib/socket-client";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = getSocket();

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  function sendMessage() {
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit("chatMessage", text);
    setText("");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Next.js 15 + Socket.IO Chat</h1>

      <div className="border p-3 h-72 overflow-y-auto bg-gray-50 mb-4">
        {messages.map((m, i) => (
          <p key={i}>• {m}</p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border px-3 py-2 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Send
        </button>
      </div>
    </main>
  );
}
