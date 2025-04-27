'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Path to the logged‑in user's avatar. Replace with a real path or inject from props/auth context.
 */


export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'bot'; content: string; avatar?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto‑scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Push user message optimistically
    const userMessage: { role: 'user' | 'bot'; content: string; avatar?: string } = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_N8N_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();
      const botMessage: { role: 'user' | 'bot'; content: string; avatar?: string } = { role: 'bot', content: data.output || 'No reply received.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Error: Could not send message.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col p-4 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] px-24">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-emerald-700 mb-4 text-center">
        Chat with RAI, your research assistant
      </h1>

      {/* Chat container */}
      <Card className="flex-1 overflow-hidden shadow-xl rounded-2xl">
        <CardContent className="flex flex-col h-full p-6">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Bot avatar */}
                    {!isUser && (
                      <div className="mr-2">
                        <Bot className="w-8 h-8 text-emerald-600" />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`w-fit max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow 
                        ${isUser ? 'bg-emerald-600 text-white' : 'bg-white'}`}
                    >
                      {msg.content}
                    </div>

                    {/* User avatar */}
                    {isUser && (
                      <User/>
                    )}
                  </motion.div>
                );
              })}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end justify-start"
                >
                  <Bot className="w-8 h-8 text-emerald-600 mr-2" />
                  <div className="w-fit max-w-xs p-3 rounded-2xl shadow bg-white">
                    Typing...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="rounded-2xl"
              disabled={loading}
              autoFocus
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              size="icon"
              className="rounded-2xl aspect-square"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
