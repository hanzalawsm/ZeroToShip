"use client";

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { ChatMessage, ProviderResponse } from '../lib/types';
import { ChatBubble } from '../components/ChatBubble';
import { BookingModal } from '../components/BookingModal';
import './page.css';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderResponse | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Need to use transition API if supported for the AI bubble reveal
      const fetchResponse = async () => {
        const res = await api.orchestrate(userMsg.text);
        
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `I've found some options for ${res.intent.service} services in ${res.intent.location || 'your area'}.`,
          extractedIntent: res.intent,
          aiReasoning: res.aiReasoning,
          matchedProviders: res.top_provider ? [res.top_provider, ...res.all_matches.filter(p => p.provider_id !== res.top_provider?.provider_id)].slice(0,3) : res.all_matches
        };

        if (document.startViewTransition) {
          document.startViewTransition(() => {
            setMessages(prev => [...prev, aiMsg]);
          });
        } else {
          setMessages(prev => [...prev, aiMsg]);
        }
      };

      await fetchResponse();

    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Error connecting to the orchestrator: ${error.message}. Is the backend running?`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const openBookingModal = (provider: ProviderResponse) => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      alert("Please login from the navigation bar to book a service.");
      return;
    }
    setSelectedProvider(provider);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = (bookingId: number) => {
    const aiMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Booking #${bookingId} confirmed successfully! You can track it in your profile.`,
    };
    if (document.startViewTransition) {
      document.startViewTransition(() => setMessages(prev => [...prev, aiMsg]));
    } else {
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  return (
    <main className="main-container">
      <header className="header">
        <div className="title-area">
          <h1 className="accent-gradient">Smart Local Orchestrator</h1>
          <p>Describe your issue, and AI will find the best pro for the job.</p>
        </div>
      </header>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <h2>How can I help you today?</h2>
            <p>Try saying something like "I need a plumber in Gulshan tomorrow morning to fix a leaking pipe."</p>
          </div>
        ) : (
          messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} onBook={openBookingModal} />
          ))
        )}
        
        {isProcessing && (
          <div className="loading-indicator">
            <span className="spinner">✧</span> AI is analyzing your request...
          </div>
        )}
      </div>

      <div className="input-area">
        <form onSubmit={handleSend} className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your request here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            autoFocus
          />
          <button type="submit" className="send-btn" disabled={!inputText.trim() || isProcessing}>
            ↑
          </button>
        </form>
      </div>

      <BookingModal 
        provider={selectedProvider}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </main>
  );
}
