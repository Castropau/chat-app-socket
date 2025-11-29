"use client";

import { useEffect, useState, useRef } from "react";
import { getSocket } from "./lib/socket-client";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [nickname, setNickname] = useState("");
  const [joined, setJoined] = useState(false); // Track if user has joined
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!joined) return; // Only listen after joining
    const socket = getSocket();

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [joined]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit("chatMessage", `${nickname}: ${text}`);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  function handleJoin() {
    if (!nickname.trim()) return;
    setJoined(true);
  }

  if (!joined) {
    // Pre-chat screen
    return (
      <main className="p-6 flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold mb-4">Enter your name to join chat</h1>
        <div className="flex gap-2">
          <input
            className="border px-3 py-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Full name or nickname"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2"
            onClick={handleJoin}
          >
            Join
          </button>
        </div>
      </main>
    );
  }

  // Chat interface
  return (
    <main className="p-6">
      <h1 className="justify-center   text-2xl font-semibold mb-4 text-center">WORLD CHAT</h1>

      <div className="border p-3 h-72 overflow-y-auto bg-gray-50 mb-4">
        {messages.map((m, i) => (
          <p key={i}>• {m}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="border px-3 py-2 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
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
