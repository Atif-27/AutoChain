"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import MessageRenderer from "@/components/MessageRenderer";
import Image from "next/image";
interface Option {
  id: string | number;
  name: string;
  image: string;
}
export default function ChatPage() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // useChat hook with AI SDK 5.0 API
  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    onError: (err) => {
      console.error("Chat error:", err);
    },
    onFinish: (options) => {
      console.log("Message finished:", options.message);
    },
    onData: (dataPart) => {
      console.log("Data part received:", dataPart);
    },
  });
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log("Current messages:", messages);
  console.log("Current status:", status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;

    // Send message using the new API
    sendMessage({
      text: input,
    });
    setInput("");
  };

  return (
    <div className="bg-black">
      <div className="flex flex-col md:max-w-4/5 mx-auto h-screen p-4 ">
        <div className="flex justify-between p-4">
          <h1 className="text-2xl font-bold mb-4">Smart AI Agent</h1>
          <div className="space-x-5">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto  p-4 space-y-4 bg-gray-900">
          {messages.length > 0 ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 px-6 rounded-xl w-fit ${
                  m.role === "user"
                    ? "bg-cyan-600 border border-gray-700 text-white self-end ml-auto max-w-[80%] rounded-br-none"
                    : "bg-gray-800 border border-gray-700 text-gray-100 self-start mr-auto max-w-[80%] rounded-bl-none"
                }`}
              >
                {/* Render message parts according to AI SDK 5.0 */}
                <div className="whitespace-pre-wrap">
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      // Try to detect JSON inside the text
                      try {
                        const cleanText = part.text
                          .replace(/```json/gi, "")
                          .replace(/```/g, "")
                          .trim();

                        const maybeJson = JSON.parse(cleanText);
                        if (maybeJson.type === "options") {
                          return (
                            <div key={i}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: maybeJson.title,
                                }}
                              ></div>
                              <div className="grid grid-cols-2 gap-4">
                                {(maybeJson.options as Option[]).map((opt) => (
                                  <div
                                    key={opt.id}
                                    onClick={() => {
                                      sendMessage({
                                        text: `Select ${opt!.id ?? ""}`,
                                      });
                                    }}
                                    className="flex cursor-pointer flex-col items-center p-3 bg-gray-800 rounded-xl w-fit"
                                  >
                                    <Image
                                      width={50}
                                      height={50}
                                      src={opt!.image}
                                      alt={opt!.name}
                                      className="mb-2"
                                    />
                                    <span>{opt!.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      } catch {
                        // Not JSON, just render text
                        return (
                          <div key={i}>
                            <MessageRenderer markdown={part.text} />
                          </div>
                        );
                      }
                    }

                    if (part.type === "dynamic-tool") {
                      return <span key={i}>⚙️ Tool output</span>;
                    }

                    return <span key={i}>[{part.type}]</span>;
                  })}
                </div>
              </div>
            ))
          ) : (
            <div
              className="flex flex-col items-center justify-center h-full"
            >
              <h1 className="text-2xl font-bold">
                Write a message to talk with AI
              </h1>
                <div className="flex flex-col items-center justify-center gap-2 mt-4 ">
                <div
                onClick={() => {
                  sendMessage({
                    text: "Hi, Please create a automated workflow for me",
                  });
                }}
                className="text-sm text-gray-400 cursor-pointer border border-gray-700 rounded-lg p-2 hover:bg-gray-800 transition-colors duration-300 w-fit"
                >Create an automated workflow</div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />

          {status === "streaming" && (
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-400">Assistant is typing...</p>
              <button
                onClick={stop}
                className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
              >
                Stop
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-600 text-sm">❌ {error.message}</p>
              <button
                onClick={clearError}
                className="text-xs text-red-500 underline mt-1"
              >
                Clear error
              </button>
            </div>
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSubmit}
          className="flex min-w-full md:min-w-1/2 mx-auto gap-2 mt-4"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg p-2 border-gray-700 outline-none bg-gray-700  grow"
            placeholder="Type your message..."
            disabled={status === "streaming"}
            rows={1}
          />
          <div>
            <button
              type="submit"
              disabled={status === "streaming" || !input.trim()}
              className="bg-cyan-600 cursor-pointer text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {status === "streaming" ? "..." : "Send"}
            </button>
          </div>
        </form>

        {/* Status indicator */}
        <div className="text-xs text-gray-500 mt-2 text-center">
          Status: {status}
        </div>
      </div>
    </div>
  );
}
