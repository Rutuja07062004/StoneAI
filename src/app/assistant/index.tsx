import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Mic, Sparkles, ArrowLeft, MoreHorizontal } from 'lucide-react-native';

const SUGGESTIONS = [
  "How are diamonds formed?",
  "Tell me about Amethyst rarity",
  "Where can I find Emeralds?",
  "Explain Mohs hardness scale",
];

export default function AIAssistantScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Sparkles size={20} color={COLORS.primary} />
          <Text style={styles.headerTitle}>StoneAI Assistant</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreHorizontal color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chatContent}>
        {/* Welcome Message */}
        <View style={styles.aiMessageContainer}>
          <GlassCard style={styles.aiMessage}>
            <Text style={styles.messageText}>
              Hello Alex! I am your geological AI assistant. I can help you identify minerals, explain their properties, or guide you to the best discovery spots. How can I assist you today?
            </Text>
          </GlassCard>
          <Text style={styles.messageTime}>10:24 AM</Text>
        </View>

        {/* User Message Placeholder */}
        <View style={styles.userMessageContainer}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userMessage}
          >
            <Text style={[styles.messageText, { color: COLORS.background }]}>
              What is the value of my new Emerald?
            </Text>
          </LinearGradient>
          <Text style={[styles.messageTime, { textAlign: 'right' }]}>10:25 AM</Text>
        </View>

        {/* AI Typing Simulation */}
        <View style={styles.aiMessageContainer}>
          <GlassCard style={[styles.aiMessage, { width: 80 }]}>
            <View style={styles.typingDots}>
              <View style={styles.dot} />
              <View style={[styles.dot, { opacity: 0.6 }]} />
              <View style={[styles.dot, { opacity: 0.3 }]} />
            </View>
          </GlassCard>
        </View>

        {/* Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Suggested Prompts</Text>
          <View style={styles.suggestionGrid}>
            {SUGGESTIONS.map((s, i) => (
              <TouchableOpacity key={i} style={styles.suggestionItem}>
                <GlassCard style={styles.suggestionCard}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
      >
        <View style={styles.inputArea}>
          <GlassCard style={styles.inputContainer}>
            <TouchableOpacity style={styles.micBtn}>
              <Mic size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TextInput
              placeholder="Ask anything about stones..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendBtn}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                style={styles.sendIconContainer}
              >
                <Send size={18} color={COLORS.background} />
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  backBtn: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '800',
    marginLeft: 8,
  },
  moreBtn: {
    padding: 4,
  },
  chatContent: {
    padding: SIZES.padding,
    paddingTop: SIZES.large,
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginBottom: SIZES.extraLarge,
  },
  aiMessage: {
    padding: SIZES.medium,
    borderTopLeftRadius: 0,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    marginBottom: SIZES.extraLarge,
  },
  userMessage: {
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    borderBottomRightRadius: 0,
  },
  messageText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    lineHeight: 22,
  },
  messageTime: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 6,
    marginLeft: 4,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionItem: {
    width: '48%',
  },
  suggestionCard: {
    padding: SIZES.medium,
  },
  suggestionText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  inputArea: {
    padding: SIZES.padding,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
  },
  micBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
    paddingHorizontal: 12,
  },
  sendBtn: {
    padding: 4,
  },
  sendIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
