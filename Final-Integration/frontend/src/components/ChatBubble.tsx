import React from 'react';
import { ChatMessage, ProviderResponse } from '../lib/types';
import { ProviderCard } from './ProviderCard';
import './ChatBubble.css';

interface ChatBubbleProps {
  message: ChatMessage;
  onBook: (provider: ProviderResponse) => void;
}

export function ChatBubble({ message, onBook }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`chat-bubble-container ${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <div className="chat-avatar ai-avatar flex-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2L5 8.3 2 5.4l4.2-.8L8 1z"/>
          </svg>
        </div>
      )}

      <div className="chat-content-wrapper">
        <div className={`chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble glass'}`}>
          <p className="chat-text">{message.text}</p>
          <span className="chat-time">{message.timestamp}</span>
        </div>

        {!isUser && message.aiReasoning && (message.text !== message.aiReasoning.summary || (message.aiReasoning.key_factors && message.aiReasoning.key_factors.length > 0)) && (
          <div className="ai-reasoning">
            <div className="reasoning-header">
              <span className="sparkle">✨</span> AI Analysis
            </div>
            {message.text !== message.aiReasoning.summary && (
              <p className="reasoning-summary">{message.aiReasoning.summary}</p>
            )}
            {message.aiReasoning.key_factors && message.aiReasoning.key_factors.length > 0 && (
              <ul className="reasoning-factors">
                {message.aiReasoning.key_factors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!isUser && message.matchedProviders && message.matchedProviders.length > 0 && (
          <div className="chat-providers">
            {message.matchedProviders.map(provider => (
              <ProviderCard
                key={provider.provider_id}
                provider={provider}
                onBook={onBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
