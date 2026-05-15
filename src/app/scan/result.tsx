import React from 'react';
import {
  StyleSheet, View, Text, ScrollView,
  TouchableOpacity, Dimensions, Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { LinearGradient } from 'expo-linear-gradient';
import type { GeminiMineralResult } from '@/services/geminiService';
import {
  ArrowLeft, Share2, Heart, MapPin, Layers, Ruler,
  Zap, Droplets, Sun, TrendingUp, FileText, AlertTriangle,
  MessageSquare, CheckCircle2, Navigation, Mic, X
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { storageService } from '@/services/storageService';
import { useLocation, LocationData } from '@/hooks/useLocation';
import { Modal, TextInput, ActivityIndicator, Animated } from 'react-native';

const { width } = Dimensions.get('window');

// Fallback images keyed by keywords in mineral name
function getImageForMineral(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('amethyst')) return 'https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&q=80&w=800';
  if (lower.includes('sapphire')) return 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&q=80&w=800';
  if (lower.includes('emerald')) return 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=800';
  if (lower.includes('granite')) return 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800';
  if (lower.includes('quartz') || lower.includes('crystal')) return 'https://images.unsplash.com/photo-1596450514735-310325fa890c?auto=format&fit=crop&q=80&w=800';
  if (lower.includes('basalt') || lower.includes('obsidian') || lower.includes('lava')) return 'https://images.unsplash.com/photo-1506466010722-395ee2bef877?auto=format&fit=crop&q=80&w=800';
  return 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800';
}

export default function RockResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    aiResult: string; 
    imageUri?: string; 
    apiKeyMissing?: string;
    errorDetails?: string;
  }>();

  let mineral: GeminiMineralResult | null = null;
  try {
    if (params.aiResult) {
      mineral = JSON.parse(params.aiResult) as GeminiMineralResult;
    }
  } catch (e) {
    console.error('Failed to parse aiResult:', e);
  }

  const [isSaving, setIsSaving] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [userNotes, setUserNotes] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);
  
  const { location, getLocation, loading: isFetchingLocation } = useLocation();

  const successScale = React.useRef(new Animated.Value(0)).current;

  const apiKeyMissing = params.apiKeyMissing === 'true';
  const hasError = !!params.errorDetails;

  const handleFetchLocation = async () => {
    await getLocation();
  };

  const handleSave = async () => {
    if (!mineral) return;
    setIsSaving(true);
    try {
      await storageService.saveItem({
        ...mineral,
        imageUri: params.imageUri || getImageForMineral(mineral.name),
        notes: userNotes,
        location: location || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSuccess(true);
      
      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      setTimeout(() => {
        setShowSaveModal(false);
        router.replace('/(tabs)/collection');
      }, 2000);
    } catch (e) {
      alert('Failed to save to collection');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mineral) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient colors={[COLORS.background, '#0A0A0A']} style={StyleSheet.absoluteFill} />
        <AlertTriangle size={64} color={COLORS.primary} style={{ marginBottom: 10 }} />
        <Text style={styles.errorText}>Identification Failed</Text>
        <Text style={[styles.bodyText, { textAlign: 'center', paddingHorizontal: 40, opacity: 0.7 }]}>
          {params.errorDetails || 'Could not connect to the AI service. Please check your internet and API key.'}
        </Text>
        <TouchableOpacity onPress={() => router.replace('/scan')} style={[styles.errorBtn, { marginTop: 30 }]}>
          <Text style={styles.errorBtnText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.textSecondary }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageSource = params.imageUri
    ? { uri: params.imageUri }
    : { uri: getImageForMineral(mineral.name) };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.background, '#0A0A0A']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.iconBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identification Result</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Share2 color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* API Error / Warning */}
        {(apiKeyMissing || hasError) && (
          <GlassCard style={styles.warningCard} padding={14}>
            <AlertTriangle size={16} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.warningText}>
                {apiKeyMissing 
                  ? 'Demo Mode — AI Key not set in geminiService.ts' 
                  : `Gemini Error: ${params.errorDetails}`}
              </Text>
            </View>
          </GlassCard>
        )}

        {/* Scanned Photo */}
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.resultImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.imageOverlay}
          />
          <GlassCard style={styles.matchBadge} padding={8}>
            <Zap size={14} color={COLORS.success} fill={COLORS.success} />
            <Text style={styles.matchText}>{mineral.confidence} AI Match</Text>
          </GlassCard>
        </View>

        {/* Name */}
        <View style={styles.nameBlock}>
          <Text style={styles.idLabel}>IDENTIFIED AS</Text>
          <Text style={styles.mineralName}>{mineral.name}</Text>
          <Text style={styles.formula}>{mineral.formula}</Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={[styles.tagText, { color: COLORS.primary }]}>{mineral.structure} System</Text>
            </View>
          </View>
        </View>

        {/* Quick Specs */}
        <View style={styles.specsRow}>
          <GlassCard style={styles.specBox} padding={12}>
            <Ruler size={18} color={COLORS.primary} />
            <Text style={styles.specVal}>{mineral.hardness}</Text>
            <Text style={styles.specLabel}>Mohs{'\n'}Hardness</Text>
          </GlassCard>
          <GlassCard style={styles.specBox} padding={12}>
            <MapPin size={18} color={COLORS.primary} />
            <Text style={styles.specVal}>{mineral.origin.split('/')[0].trim()}</Text>
            <Text style={styles.specLabel}>Typical{'\n'}Origin</Text>
          </GlassCard>
          <GlassCard style={styles.specBox} padding={12}>
            <Layers size={18} color={COLORS.primary} />
            <Text style={styles.specVal}>{mineral.structure}</Text>
            <Text style={styles.specLabel}>Crystal{'\n'}System</Text>
          </GlassCard>
        </View>

        {/* Market Value */}
        <GlassCard style={styles.marketCard} padding={20}>
          <View style={styles.marketRow}>
            <View>
              <Text style={styles.marketLabel}>Est. Market Value</Text>
              <Text style={styles.marketPrice}>{mineral.value}</Text>
            </View>
            <View style={styles.trendBadge}>
              <TrendingUp size={15} color={COLORS.success} />
              <Text style={styles.trendText}>{mineral.trend}</Text>
            </View>
          </View>
          <Text style={styles.marketNote}>*Based on current market trends and mineral clarity standards.</Text>
        </GlassCard>

        {/* Detailed Profile */}
        <View style={styles.profileCard}>
          <View style={styles.sectionHeader}>
            <FileText size={18} color={COLORS.primary} />
            <Text style={styles.profileTitle}>Geological Profile</Text>
          </View>

          <Text style={styles.sectionSubtitle}>Description</Text>
          <Text style={styles.bodyText}>{mineral.description}</Text>

          {/* Physical Properties Grid */}
          <Text style={[styles.sectionSubtitle, { marginTop: 20 }]}>Physical Properties</Text>
          <View style={styles.propsGrid}>
            {[
              { label: 'Color', value: mineral.properties.color },
              { label: 'Lustre', value: mineral.properties.lustre },
              { label: 'Transparency', value: mineral.properties.transparency },
              { label: 'Streak', value: mineral.properties.streak },
            ].map((prop, i) => (
              <View key={i} style={styles.propCell}>
                <Text style={styles.propLabel}>{prop.label}</Text>
                <Text style={styles.propValue}>{prop.value}</Text>
              </View>
            ))}
          </View>

          {/* Uses */}
          {mineral.uses?.length > 0 && (
            <>
              <Text style={[styles.sectionSubtitle, { marginTop: 20 }]}>Common Uses</Text>
              <View style={styles.usesTags}>
                {mineral.uses.map((use, i) => (
                  <View key={i} style={styles.useTag}>
                    <Text style={styles.useTagText}>{use}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Care */}
          <Text style={[styles.sectionSubtitle, { marginTop: 20 }]}>Handling Tips</Text>
          <View style={styles.careList}>
            <View style={styles.careRow}>
              <Droplets size={15} color={COLORS.primary} />
              <Text style={styles.careText}>Protect from extreme temperature changes.</Text>
            </View>
            <View style={styles.careRow}>
              <Sun size={15} color={COLORS.primary} />
              <Text style={styles.careText}>Avoid prolonged exposure to direct sunlight.</Text>
            </View>
          </View>
        </View>

        {/* CTAs */}
        <View style={styles.ctas}>
          <GlowButton title="SAVE TO COLLECTION" onPress={() => setShowSaveModal(true)} />
          <TouchableOpacity style={styles.favoriteBtn}>
            <Heart size={18} color={COLORS.textSecondary} />
            <Text style={styles.favoriteBtnText}>Add to Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Save Modal */}
        <Modal
          visible={showSaveModal}
          transparent
          animationType="fade"
          onRequestClose={() => !isSaving && setShowSaveModal(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.saveModal} padding={24}>
              {isSuccess ? (
                <View style={styles.successContainer}>
                  <Animated.View style={{ transform: [{ scale: successScale }] }}>
                    <CheckCircle2 size={80} color={COLORS.success} />
                  </Animated.View>
                  <Text style={styles.successTitle}>Added to Vault!</Text>
                  <Text style={styles.successSub}>Specimen secured in your collection.</Text>
                </View>
              ) : (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Personal Journal</Text>
                    <TouchableOpacity onPress={() => setShowSaveModal(false)}>
                      <X size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalHint}>Add your discovery notes below.</Text>

                  <TextInput
                    style={styles.notesInput}
                    placeholder="Where did you find it? Any special details..."
                    placeholderTextColor={COLORS.textMuted}
                    multiline
                    numberOfLines={4}
                    value={userNotes}
                    onChangeText={setUserNotes}
                  />

                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={[styles.actionBtn, location && styles.actionBtnActive]}
                      onPress={handleFetchLocation}
                    >
                      {isFetchingLocation ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                      ) : (
                        <>
                          <Navigation size={18} color={location ? COLORS.background : COLORS.primary} />
                          <Text style={[styles.actionText, location && styles.actionTextActive]}>
                            {location ? 'Location Tagged' : 'Tag Location'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Mic size={18} color={COLORS.primary} />
                      <Text style={styles.actionText}>Voice Note</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity 
                      style={styles.cancelBtn} 
                      onPress={() => setShowSaveModal(false)}
                      disabled={isSaving}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.confirmBtn} 
                      onPress={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator color={COLORS.background} />
                      ) : (
                        <Text style={styles.confirmBtnText}>Secure Entry</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </GlassCard>
          </View>
        </Modal>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: SIZES.padding, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  headerTitle: {
    color: COLORS.text, fontSize: 15, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
  },
  scroll: { paddingHorizontal: 16 },
  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: 16, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)',
  },
  warningText: { color: COLORS.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 },
  imageWrapper: {
    width: '100%', height: 260, borderRadius: 24, overflow: 'hidden',
    marginTop: 16, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  resultImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  matchBadge: {
    position: 'absolute', top: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(10,10,10,0.85)',
    borderWidth: 1, borderColor: 'rgba(0,230,118,0.3)',
    borderRadius: 10,
  },
  matchText: { color: COLORS.success, fontSize: 12, fontWeight: '900' },
  nameBlock: { alignItems: 'center', marginBottom: 24 },
  idLabel: {
    color: COLORS.primary, fontSize: 11, fontWeight: '900',
    letterSpacing: 2, marginBottom: 6,
  },
  mineralName: {
    color: COLORS.text, fontSize: 34, fontWeight: '900',
    textAlign: 'center', letterSpacing: -0.5,
  },
  formula: {
    color: COLORS.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  tags: { flexDirection: 'row', marginTop: 14, gap: 8 },
  tag: {
    backgroundColor: 'rgba(255,215,0,0.08)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8,
  },
  tagText: { fontSize: 12, fontWeight: '700' },
  specsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  specBox: { width: (width - 56) / 3, alignItems: 'center' },
  specVal: {
    color: COLORS.text, fontSize: 13, fontWeight: '800',
    marginTop: 8, textAlign: 'center',
  },
  specLabel: {
    color: COLORS.textMuted, fontSize: 9, fontWeight: '600',
    marginTop: 2, textAlign: 'center', textTransform: 'uppercase',
  },
  marketCard: {
    marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.12)',
  },
  marketRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marketLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  marketPrice: { color: COLORS.primary, fontSize: 22, fontWeight: '900' },
  trendBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,230,118,0.1)',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
  },
  trendText: { color: COLORS.success, fontSize: 13, fontWeight: '900' },
  marketNote: { color: COLORS.textMuted, fontSize: 10, marginTop: 14, fontStyle: 'italic' },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24, padding: 20, marginBottom: 24,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  profileTitle: { color: COLORS.text, fontSize: 17, fontWeight: '800' },
  sectionSubtitle: {
    color: COLORS.primary, fontSize: 12, fontWeight: '900',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
  },
  bodyText: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },
  propsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  propCell: { width: '46%' },
  propLabel: { color: COLORS.textMuted, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
  propValue: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  usesTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  useTag: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  useTagText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  careList: { gap: 10 },
  careRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  careText: { color: COLORS.textMuted, fontSize: 13 },
  ctas: { gap: 14 },
  favoriteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 12,
  },
  favoriteBtnText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '700' },
  errorContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.background, gap: 20,
  },
  errorText: { color: COLORS.text, fontSize: 18, textAlign: 'center' },
  errorBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 30,
    paddingVertical: 14, borderRadius: 30,
  },
  errorBtnText: { color: COLORS.background, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  saveModal: {
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
  },
  modalHint: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    color: COLORS.text,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,215,0,0.05)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  actionBtnActive: {
    backgroundColor: COLORS.primary,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  actionTextActive: {
    color: COLORS.background,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  confirmBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 20,
  },
  successSub: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});
