"use client";

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { ChatMessage, ProviderResponse } from '../lib/types';
import { ChatBubble } from '../components/ChatBubble';
import { BookingModal } from '../components/BookingModal';
import './page.css';

export default function ChatPage() {
  const { user } = useAuth();
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
      const res = await api.orchestrate(userMsg.text);

      let responseText = res.aiReasoning.summary;
      if (res.top_provider && res.intent.is_service_request !== false) {
        responseText = `I've found ${res.all_matches.length} option${res.all_matches.length !== 1 ? 's' : ''} for ${res.intent.service || 'service'} in ${res.intent.location || 'your area'}.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        extractedIntent: res.intent,
        aiReasoning: res.aiReasoning,
        matchedProviders: res.top_provider
          ? [res.top_provider, ...res.all_matches.filter(p => p.provider_id !== res.top_provider?.provider_id)].slice(0, 3)
          : [],
      };

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setMessages(prev => [...prev, aiMsg]);
        });
      } else {
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Could not connect to the orchestrator: ${message}. Make sure the backend is running.`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const openBookingModal = (provider: ProviderResponse) => {
    setSelectedProvider(provider);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = (bookingId: number) => {
    const aiMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Booking #${bookingId} confirmed! You can track it from the Bookings page in the sidebar.`,
    };
    if (document.startViewTransition) {
      document.startViewTransition(() => setMessages(prev => [...prev, aiMsg]));
    } else {
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-content">
          <h1>
            {user ? `Hey ${user.name.split(' ')[0]}, ` : ''}what do you need help with?
          </h1>
          <p>Describe your issue in any language. Our AI will match you with the best local professional.</p>
        </div>
      </header>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a conversation</h2>
            <p>Try something like:</p>
            <div className="suggestion-chips">
              <button className="chip" onClick={() => setInputText('I need a plumber in Gulshan tomorrow morning')}>
                🔧 Plumber in Gulshan
              </button>
              <button className="chip" onClick={() => setInputText('Electrician chahiye DHA mein urgent')}>
                ⚡ Electrician in DHA
              </button>
              <button className="chip" onClick={() => setInputText('Need a painter for my apartment in Clifton')}>
                🎨 Painter in Clifton
              </button>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} onBook={openBookingModal} />
          ))
        )}

        {isProcessing && (
          <div className="loading-indicator">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
            AI is analyzing your request...
          </div>
        )}
      </div>

      <div className="input-area">
        <form onSubmit={handleSend} className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Describe what you need..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            autoFocus
          />
          <button type="submit" className="send-btn" disabled={!inputText.trim() || isProcessing}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="15" x2="9" y2="3" />
              <polyline points="3 9 9 3 15 9" />
            </svg>
          </button>
        </form>
      </div>

      <BookingModal
        provider={selectedProvider}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
