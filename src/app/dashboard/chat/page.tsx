'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_N8N_API_URL!, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      console.log(data);

      const botMessage = {
        role: "bot",
        content: data.output || "No reply received."
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", content: "Error: Could not send message." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-4">
      {/* Messages */}
      <div className="flex-1 overflow-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-sm ${msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg max-w-sm bg-gray-100">
            Typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-l-lg p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#01693E] hover:bg-blue-700 text-white px-4 rounded-r-lg"
          disabled={!input.trim() || loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
