import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Loader2, Trash2, Bot, User } from 'lucide-react';
import api from '../utils/api';
import MatrixText from './MatrixText';
import HoverSlatButton from './HoverSlatButton';

function ChatTerminal({ marketData }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I'm Zara, an AI trading intelligence agent specialized in Polymarket and crypto markets.

I track whale movements, market sentiment, and price predictions in real-time. I also publish signals on my Telegram channel and Twitter @SignalsZara.

What would you like to know about the markets? I can help with:
- Polymarket predictions and whale activity
- Crypto price analysis
- Trading signals and market trends

Note: This is not financial advice. Always DYOR.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.chat(userMessage, sessionId);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Sorry, I encountered an error. Please try again.',
        error: true
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = async () => {
    try {
      await api.clearChat(sessionId);
      setMessages([{
        role: 'assistant',
        content: 'Chat cleared! How can I help you? 🤖'
      }]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-white" />
            <MatrixText 
              text="ZARA TERMINAL" 
              className="font-display text-sm font-bold tracking-wider text-white"
              initialDelay={500}
              letterAnimationDuration={300}
              letterInterval={50}
            />
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <div className="w-3 h-3 rounded-full bg-gray-400" />
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-300"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll scanline">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-300 to-gray-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-black" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gray-800 border border-gray-700 text-white'
                  : message.error
                  ? 'bg-gray-900 border border-gray-700 text-gray-400'
                  : 'bg-gray-900 border border-gray-800 text-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {formatMessage(message.content)}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-300 to-gray-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="text-sm text-gray-400">Analyzing markets...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-black/50">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Zara about markets, tokens, signals..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-gray-600 transition-colors font-mono"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">
              <span className="cursor-blink">_</span>
            </div>
          </div>
          {isLoading ? (
            <div className="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-500 rounded-xl flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            </div>
          ) : (
            <HoverSlatButton
              initialText=" SEND "
              hoverText=" ZARA "
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatTerminal;
