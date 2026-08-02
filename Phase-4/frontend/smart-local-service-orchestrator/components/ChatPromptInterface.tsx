import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, useColorScheme,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { ColorPalette } from '../theme/colors';
import { useResponsive } from '../hooks/useResponsive';
import { INITIAL_CHAT_MESSAGES, MOCK_PROMPT_CHIPS, MOCK_PROVIDERS } from '../mock/mockData';
import { ChatBubble } from './ui/ChatBubble';
import { BookingModal } from './ui/BookingModal';
import { IconSymbol } from './ui/IconSymbol';
import { ChatMessage, Provider } from '../types';

export function ChatPromptInterface() {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;
  const { chatWidth, isWide, isDesktop } = useResponsive();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = (text?: string) => {
    const value = text || inputText;
    if (!value.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: value,
    };

    setMessages(prev => [...prev, newUserMsg]);
    if (!text) setInputText('');
    setIsProcessing(true);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      const lower = value.toLowerCase();
      let service = 'plumber';
      if (lower.includes('electric')) service = 'electrician';
      else if (lower.includes('carpenter') || lower.includes('wood')) service = 'carpenter';
      else if (lower.includes('paint')) service = 'painter';
      else if (lower.includes('clean')) service = 'cleaner';

      let zone = 'Johar';
      if (lower.includes('gulshan')) zone = 'Gulshan';
      else if (lower.includes('clifton')) zone = 'Clifton';
      else if (lower.includes('dha')) zone = 'DHA';

      const match = MOCK_PROVIDERS.find(p => p.category === service) || MOCK_PROVIDERS[0];

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `I found top-rated ${service}s available in ${zone}.`,
        extractedIntent: {
          service: service as any,
          location: zone as any,
          time: lower.includes('tomorrow') || lower.includes('kal') ? 'Tomorrow Morning' : undefined as any,
          confidence: 0.96,
          raw_prompt: value,
        },
        aiReasoning: `I recommend '${match.name}' based on their ${match.rating} ★ rating and fast ${match.response_time} response time in your area.`,
        matchedProviders: [match],
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);
  };

  const handleConfirmBooking = (provider: Provider) => {
    setSelectedProvider(provider);
    setBookingModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: t.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        
        {/* Mobile Header (Hidden on Desktop because Sidebar takes over) */}
        {!isDesktop && (
          <View style={[styles.mobileHeader, { borderBottomColor: t.border }]}>
            <Text style={[styles.mobileHeaderTitle, { color: t.textPrimary }]}>Service Search</Text>
          </View>
        )}

        {/* Timeline */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.timeline}
          contentContainerStyle={[styles.timelineInner, isDesktop && { paddingTop: 40 }, isWide && { maxWidth: chatWidth, alignSelf: 'center', width: '100%' }]}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} onConfirmBooking={handleConfirmBooking} />
          ))}
          {isProcessing && (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color={ColorPalette.primary} />
              <Text style={[styles.processingText, { color: t.textSecondary }]}>Finding providers…</Text>
            </View>
          )}
        </ScrollView>

        {/* Fixed Input Area at Bottom */}
        <View style={[styles.inputArea, { backgroundColor: t.bg, borderTopColor: isDesktop ? 'transparent' : t.border, borderTopWidth: isDesktop ? 0 : 1 }, isWide && { maxWidth: chatWidth, alignSelf: 'center', width: '100%' }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {MOCK_PROMPT_CHIPS.map((chip, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.chip, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}
                onPress={() => handleSend(chip)}
              >
                <Text style={[styles.chipText, { color: t.textPrimary }]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.inputBar, { backgroundColor: t.surface, borderColor: t.border }]}>
            <TextInput
              style={[styles.input, { color: t.textPrimary }]}
              placeholder="Ask anything..."
              placeholderTextColor={t.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: inputText.trim() ? ColorPalette.primary : t.surfaceRaised }]}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
            >
              <IconSymbol name="send" size={16} color={inputText.trim() ? '#FFFFFF' : t.textMuted} />
            </TouchableOpacity>
          </View>
          {isDesktop && <Text style={[styles.disclaimer, { color: t.textMuted }]}>Prices and availability are provided by verified independent contractors.</Text>}
        </View>
      </View>

      <BookingModal
        visible={bookingModalVisible}
        provider={selectedProvider}
        onClose={() => setBookingModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    // On desktop, we want the timeline to push the input down, but on mobile it's flex:1 naturally
  },
  mobileHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  mobileHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeline: {
    flex: 1,
  },
  timelineInner: {
    padding: 20,
    paddingBottom: 48, // ensures last card doesn't clip under input
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  processingText: {
    fontSize: 13,
  },
  inputArea: {
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 24 : 16, // more padding on web
    paddingHorizontal: 16,
  },
  chipsRow: {
    gap: 8,
    paddingBottom: 10,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24, // More pill-like similar to Gemini
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    outlineStyle: 'none', // Remove web outline
  } as any,
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
  }
});
