import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { ChatMessage, Provider } from '../../types';
import { AIReasoningCard } from './AIReasoningCard';
import { ProviderCard } from './ProviderCard';

interface ChatBubbleProps {
  message: ChatMessage;
  onConfirmBooking: (p: Provider) => void;
}

export function ChatBubble({ message, onConfirmBooking }: ChatBubbleProps) {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;
  const isUser = message.sender === 'user';

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.bubbleUser : styles.bubbleAI,
    {
      backgroundColor: isUser ? t.chatUser : t.chatAI,
      borderColor: isUser ? t.chatUser : t.border,
      borderWidth: 1,
    }
  ];

  const textStyle = [
    styles.text,
    { color: isUser ? t.chatUserText : t.chatAIText }
  ];

  let timeString = message.timestamp;
  const parsedDate = new Date(message.timestamp);
  if (!isNaN(parsedDate.getTime())) {
    timeString = parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerAI]}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message.text}</Text>
        
        {message.extractedIntent && (
          <View style={styles.interactiveIntentContainer}>
            <View style={[styles.interactiveChip, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}>
              <Text style={[styles.interactiveChipText, { color: t.textPrimary }]}>🛠️ {message.extractedIntent.service || 'Any'} ✎</Text>
            </View>
            <View style={[styles.interactiveChip, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}>
              <Text style={[styles.interactiveChipText, { color: t.textPrimary }]}>📍 {message.extractedIntent.location || 'Anywhere'} ✎</Text>
            </View>
            {message.extractedIntent.time ? (
               <View style={[styles.interactiveChip, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}>
                 <Text style={[styles.interactiveChipText, { color: t.textPrimary }]}>📅 {message.extractedIntent.time} ✎</Text>
               </View>
            ) : null}
          </View>
        )}

        {message.extractedIntent && !message.extractedIntent.time && (
           <View style={styles.dateFallbackContainer}>
             <Text style={[styles.dateFallbackTitle, { color: t.textSecondary }]}>When do you need this?</Text>
             <View style={styles.dateFallbackChips}>
                <View style={[styles.dateFallbackChip, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}><Text style={[styles.dateFallbackChipText, {color: t.textPrimary}]}>Today</Text></View>
                <View style={[styles.dateFallbackChip, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}><Text style={[styles.dateFallbackChipText, {color: t.textPrimary}]}>Tomorrow</Text></View>
                <View style={[styles.dateFallbackChip, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}><Text style={[styles.dateFallbackChipText, {color: t.textPrimary}]}>Custom Date</Text></View>
             </View>
           </View>
        )}

        {message.aiReasoning && (
          <View style={styles.reasoningContainer}>
            <AIReasoningCard reasoningText={message.aiReasoning} />
          </View>
        )}

        {message.matchedProviders && message.matchedProviders.length > 0 && (
          <View style={styles.providerContainer}>
            <ProviderCard 
              provider={message.matchedProviders[0]} 
              onConfirmBooking={onConfirmBooking} 
              isTopMatch={true} 
            />
          </View>
        )}
      </View>
      <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAI, { color: t.textMuted }]}>
        {timeString}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  containerUser: {
    alignItems: 'flex-end',
  },
  containerAI: {
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 12,
    maxWidth: '85%',
  },
  bubbleUser: {
    borderRadius: 10,
    borderBottomRightRadius: 2,
  },
  bubbleAI: {
    borderRadius: 10,
    borderBottomLeftRadius: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  interactiveIntentContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interactiveChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  interactiveChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateFallbackContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#57534E', // A subtle divider
  },
  dateFallbackTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateFallbackChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateFallbackChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateFallbackChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reasoningContainer: {
    marginTop: 12,
  },
  providerContainer: {
    marginTop: 12,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampUser: {
    textAlign: 'right',
  },
  timestampAI: {
    textAlign: 'left',
  },
});
