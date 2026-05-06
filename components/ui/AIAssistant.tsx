"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineChevronDown, HiUser } from "react-icons/hi";
import ReactMarkdown from "react-markdown";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-accent-light shadow-lg shadow-accent/25 flex items-center justify-center text-white transition-opacity duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Open AI Tutor"
      >
        <HiOutlineSparkles size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                  <HiOutlineSparkles size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Tutor</h3>
                  <p className="text-xs text-white/50">Ask about stocks or terms</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                aria-label="Close AI Tutor"
              >
                <HiOutlineChevronDown size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <HiOutlineSparkles size={24} className="text-white" />
                  </div>
                  <p className="text-white text-sm mb-1">I&apos;m your AI Financial Tutor!</p>
                  <p className="text-xs text-white/60 max-w-[200px]">
                    Ask me to explain jargon or check a stock&apos;s performance.
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${
                      m.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        m.role === "user"
                          ? "bg-white/10 text-white"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {m.role === "user" ? <HiUser size={16} /> : <HiOutlineSparkles size={16} />}
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
                        m.role === "user"
                          ? "bg-white/10 text-white rounded-tr-none"
                          : "bg-accent/10 border border-accent/20 text-white/90 rounded-tl-none prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:p-2"
                      }`}
                    >
                      {/* For tool calls, show a small pill */}
                      {m.toolInvocations?.map((toolInvocation) => {
                        if (toolInvocation.state === "result") {
                          return (
                            <div key={toolInvocation.toolCallId} className="mb-2 text-xs text-accent-light flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-md border border-accent/20 w-fit">
                              <HiOutlineSparkles size={12} />
                              Analyzed {toolInvocation.args.symbol}
                            </div>
                          );
                        } else {
                          return (
                            <div key={toolInvocation.toolCallId} className="mb-2 text-xs text-white/50 flex items-center gap-1">
                              <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                              Fetching data...
                            </div>
                          );
                        }
                      })}
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                ))
              )}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-accent/20 text-accent flex items-center justify-center">
                    <HiOutlineSparkles size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-accent/10 border border-accent/20 rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white/5 border-t border-white/10">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 rounded-lg bg-accent text-white hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <HiOutlinePaperAirplane size={16} className="rotate-90" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-white/30">AI can make mistakes. Verify important information.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
