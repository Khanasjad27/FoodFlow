import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, X, Send, Sparkles, Bot, User, RefreshCw } from 'lucide-react';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: 'Hi! I can help explain how FoodFlow AI works — AI match scores, claiming, QR verification, and pickups. What would you like to know?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        text: data.reply || "I'm sorry, I couldn't process that request right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: 'Our AI Match Engine considers meal expiry urgency (40%), NGO capacity (30%), and historical reliability score (30%) to prioritize redistributions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTED_QUESTIONS = [
    'How does the Match Score work?',
    'What food types can be posted?',
    'How do NGOs claim a listing?',
    'Basic food safety guidelines?',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#3e7053] hover:bg-[#325b43] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group focus:outline-hidden ring-4 ring-[#3e7053]/20"
          title="Open FoodFlow AI Assistant"
          id="btn-open-chat"
        >
          <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d97757] rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-[#d8e2d8] w-[90vw] sm:w-[380px] h-[520px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-[#1e2e25]">
          {/* Header */}
          <div className="bg-[#1e2e25] text-white p-4 border-b border-[#2d4235] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3e7053] border border-[#528d6a] flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight leading-none text-white">FoodFlow Assistant</h3>
                <span className="text-[10px] text-[#a8d3b8] flex items-center space-x-1 mt-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8d3b8] animate-ping inline-block" />
                  <span>Gemini AI Engine</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-[#a8d3b8] hover:text-white p-1 rounded-lg hover:bg-[#2d4235] transition-colors"
              id="btn-close-chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f8faf8] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-[#3e7053] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#3e7053] text-white rounded-tr-xs font-medium'
                      : 'bg-white text-[#1e2e25] border border-[#d8e2d8] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.sender === 'user' ? 'text-[#c3dccf] text-right' : 'text-[#889b8e]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-[#1e2e25] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-[#556b5e] text-xs p-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#3e7053]" />
                <span>FoodFlow Assistant thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-[#e2e9e2] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#f0f4f1] hover:bg-[#e2e9e2] text-[#245237] border border-[#d2dfd5] text-[10px] font-medium transition-all hover:scale-105 flex-shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#e2e9e2] flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about matching, claiming, food safety..."
              className="flex-1 p-2 text-xs bg-[#f8faf8] border border-[#d2dfd5] text-[#1e2e25] placeholder-[#889b8e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
              disabled={loading}
              id="input-chat-message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="group p-2 rounded-xl bg-[#3e7053] hover:bg-[#325b43] disabled:opacity-50 text-white font-bold transition-all shadow-2xs hover:shadow-xs"
              id="btn-send-chat"
            >
              <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
