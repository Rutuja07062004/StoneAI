import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, ScrollView,
  TouchableOpacity, Dimensions, Platform, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, Trash2, Edit3, MapPin, Layers, Ruler,
  Zap, FileText, Calendar, Info, Save, X, Navigation
} from 'lucide-react-native';
import { SafeMap } from '@/components/ui/SafeMap';
import { storageService, CollectionItem } from '@/services/storageService';

const { width } = Dimensions.get('window');

export default function CollectionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [item, setItem] = useState<CollectionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    setIsLoading(true);
    const collection = await storageService.getCollection();
    const found = collection.find(i => i.id === id);
    if (found) {
      setItem(found);
      setEditedNotes(found.notes);
    }
    setIsLoading(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove Specimen",
      "Are you sure you want to remove this specimen from your vault? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            await storageService.removeItem(id);
            router.back();
          }
        }
      ]
    );
  };

  const handleUpdateNotes = async () => {
    await storageService.updateItem(id, { notes: editedNotes });
    setItem(prev => prev ? { ...prev, notes: editedNotes } : null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: COLORS.text }}>Specimen not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.background, '#0A0A0A']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Specimen Vault</Text>
        <TouchableOpacity onPress={handleDelete} style={[styles.iconBtn, { backgroundColor: 'rgba(255,59,48,0.1)' }]}>
          <Trash2 color="#FF3B30" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Main Info Card */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.imageUri }} style={styles.resultImage} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.imageOverlay}
          />
          <View style={styles.imageContent}>
             <Text style={styles.mineralName}>{item.name}</Text>
             <View style={styles.metaRow}>
               <Calendar size={14} color={COLORS.textSecondary} />
               <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
               <View style={styles.dot} />
               <Zap size={14} color={COLORS.success} />
               <Text style={styles.metaText}>{item.confidence} Match</Text>
             </View>
          </View>
        </View>

        {/* Specs Grid */}
        <View style={styles.specsRow}>
          <GlassCard style={styles.specBox} padding={12}>
            <Ruler size={18} color={COLORS.primary} />
            <Text style={styles.specVal}>{item.hardness}</Text>
            <Text style={styles.specLabel}>Hardness</Text>
          </GlassCard>
          <GlassCard style={styles.specBox} padding={12}>
            <MapPin size={18} color={COLORS.primary} />
            <Text style={styles.specVal}>{item.origin.split('/')[0].trim()}</Text>
            <Text style={styles.specLabel}>Origin</Text>
          </GlassCard>
          <GlassCard style={styles.specBox} padding={12}>
            <Layers size={18} color={COLORS.primary} />
            <Text style={styles.specVal}>{item.structure}</Text>
            <Text style={styles.specLabel}>System</Text>
          </GlassCard>
        </View>

        {/* Journal Section */}
        <GlassCard style={styles.journalCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <FileText size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Field Notes</Text>
            </View>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Edit3 size={18} color={COLORS.primary} />
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity onPress={() => { setIsEditing(false); setEditedNotes(item.notes); }}>
                  <X size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdateNotes}>
                  <Save size={20} color={COLORS.success} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedNotes}
              onChangeText={setEditedNotes}
              multiline
              autoFocus
            />
          ) : (
            <Text style={styles.journalText}>
              {item.notes || "No notes added for this discovery."}
            </Text>
          )}

          {item.location && (
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                 <MapPin size={16} color={COLORS.primary} />
                 <Text style={styles.locationTitle}>Discovery Location</Text>
              </View>
              
              <Text style={styles.addressText}>
                {item.location.address || "Precise GPS Secured"}
              </Text>

              <View style={styles.mapWrapper}>
                <SafeMap
                  style={styles.map}
                  latitude={item.location.latitude}
                  longitude={item.location.longitude}
                />
              </View>

              <View style={styles.coordRow}>
                <Navigation size={12} color={COLORS.textMuted} />
                <Text style={styles.coordText}>
                  {item.location.latitude.toFixed(6)}, {item.location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          )}
        </GlassCard>

        {/* Geological Details */}
        <View style={styles.detailsBlock}>
          <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
            <Info size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Geological Intelligence</Text>
          </View>
          
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.propsGrid}>
            {[
              { label: 'Chemical Formula', value: item.formula },
              { label: 'Market Value', value: item.value },
              { label: 'Color', value: item.properties.color },
              { label: 'Lustre', value: item.properties.lustre },
            ].map((prop, i) => (
              <View key={i} style={styles.propItem}>
                <Text style={styles.propLabel}>{prop.label}</Text>
                <Text style={styles.propValue}>{prop.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  headerTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
  },
  scroll: { paddingHorizontal: 16 },
  imageWrapper: {
    width: '100%', height: 320, borderRadius: 24, overflow: 'hidden',
    marginTop: 16, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  resultImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 },
  imageContent: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  mineralName: { color: COLORS.text, fontSize: 32, fontWeight: '900', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  specsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  specBox: { width: (width - 56) / 3, alignItems: 'center' },
  specVal: { color: COLORS.text, fontSize: 13, fontWeight: '800', marginTop: 8 },
  specLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: '600', marginTop: 2, textTransform: 'uppercase' },
  journalCard: { marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,215,0,0.15)' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: '800' },
  journalText: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 24, fontStyle: 'italic' },
  editInput: {
    color: COLORS.text, fontSize: 15, lineHeight: 24, backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12, borderRadius: 12, minHeight: 100, textAlignVertical: 'top',
  },
  locationBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
    backgroundColor: 'rgba(255,215,0,0.05)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  locationText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  detailsBlock: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 20 },
  description: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  propsGrid: { gap: 16 },
  propItem: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 8 },
  propLabel: { color: COLORS.textMuted, fontSize: 11, textTransform: 'uppercase', marginBottom: 2 },
  propValue: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  locationContainer: { marginTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  locationTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  addressText: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 12 },
  mapWrapper: { height: 150, borderRadius: 16, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  map: { flex: 1 },
  coordRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coordText: { color: COLORS.textMuted, fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  markerCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255, 215, 0, 0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary },
  markerInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
});
