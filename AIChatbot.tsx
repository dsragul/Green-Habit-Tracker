import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  MessageSquare,
  Send,
  X,
  Trash2,
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  ChevronDown,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ChatMessage, UserProfile, DashboardStats } from '../types';

interface AIChatbotProps {
  chatMessages: ChatMessage[];
  onSendMessage: (messageText: string) => Promise<void>;
  onClearChat: () => void;
  user: UserProfile;
  stats: DashboardStats;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({
  chatMessages,
  onSendMessage,
  onClearChat,
  user,
  stats
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    setInputPrompt('');
    setIsLoading(true);

    try {
      await onSendMessage(prompt);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API Voice Input
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser version. Try typing your query!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = user.preferredLanguage === 'Spanish' ? 'es-ES' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputPrompt(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON (Bento Pill Floating Action) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 px-4.5 py-3.5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-emerald-300/40 group backdrop-blur-md"
        aria-label="Open AI Sustainability Advisor Chatbot"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        </div>
        <span className="hidden sm:inline font-black tracking-tight">AI Advisor</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/70 font-bold border border-white/20">
          Online
        </span>
      </button>

      {/* FLOATING CHAT BENTO DRAWER */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[80vh] bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl shadow-emerald-950/10 flex flex-col overflow-hidden backdrop-blur-2xl">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white flex items-center justify-between border-b border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight flex items-center gap-1.5">
                  Eco Sustainability AI
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-[11px] text-emerald-300 font-medium">
                  Personalized for {user.name} ({stats.currentStreak}d Streak)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onClearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
                aria-label="Close Chat Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages History List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50 dark:bg-slate-950/50">
            {chatMessages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2 ${isAssistant ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isAssistant
                          ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 shadow-sm'
                          : 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Suggested Questions Chips (if present) */}
                    {isAssistant && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Suggested Questions</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(q)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800 text-[11px] font-semibold text-left transition"
                            >
                              💡 {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Animation */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-400">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Category Bar */}
          <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => handleSend('How can I reduce my household electricity bill?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-slate-700 transition"
            >
              ⚡ Electricity Tips
            </button>
            <button
              onClick={() => handleSend('What are the best recycling methods for plastics and cans?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-slate-700 transition"
            >
              ♻️ Recycling Guide
            </button>
            <button
              onClick={() => handleSend('Suggest an eco challenge based on my history')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-slate-700 transition"
            >
              🌱 Custom Challenge
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl border transition ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Voice Input (Speech-to-text)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI Sustainability Advisor..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!inputPrompt.trim() || isLoading}
              className={`p-2.5 rounded-xl transition ${
                inputPrompt.trim() && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>

          </div>

        </div>
      )}
    </>
  );
};
