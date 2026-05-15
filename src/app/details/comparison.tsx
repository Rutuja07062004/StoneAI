import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, X, Check, Minus, Ruler, Zap, Shield } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COMPARISON_DATA = [
  { label: 'Hardness (Mohs)', stone1: '7.5 - 8', stone2: '9.0', win: 2 },
  { label: 'Refractive Index', stone1: '1.57 - 1.58', stone2: '1.76 - 1.77', win: 2 },
  { label: 'Crystal System', stone1: 'Hexagonal', stone2: 'Trigonal', win: 0 },
  { label: 'Durability', stone1: 'High', stone2: 'Exceptional', win: 2 },
  { label: 'Market Rarity', stone1: 'Rare', stone2: 'Very Rare', win: 2 },
  { label: 'Value Growth', stone1: '+12%', stone2: '+18%', win: 2 },
];

export default function MineralComparisonScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comparison</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Comparison Header */}
        <View style={styles.comparisonHeader}>
          <View style={styles.stoneColumn}>
            <View style={styles.imageBox}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1596450514735-310325fa890c?auto=format&fit=crop&q=80&w=200' }} 
                style={styles.stoneThumb} 
              />
            </View>
            <Text style={styles.stoneName}>Emerald</Text>
          </View>
          
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          <View style={styles.stoneColumn}>
            <View style={styles.imageBox}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1615111784767-407421886877?auto=format&fit=crop&q=80&w=200' }} 
                style={styles.stoneThumb} 
              />
            </View>
            <Text style={styles.stoneName}>Sapphire</Text>
          </View>
        </View>

        {/* Comparison Table */}
        <GlassCard style={styles.tableCard}>
          {COMPARISON_DATA.map((row, i) => (
            <View key={i} style={[styles.tableRow, i === COMPARISON_DATA.length - 1 && styles.lastRow]}>
              <View style={styles.rowLabelContainer}>
                <Text style={styles.rowLabel}>{row.label}</Text>
              </View>
              <View style={styles.rowValues}>
                <View style={[styles.valueBox, row.win === 1 && styles.winningValue]}>
                  <Text style={[styles.valueText, row.win === 1 && styles.winningText]}>{row.stone1}</Text>
                </View>
                <View style={[styles.valueBox, row.win === 2 && styles.winningValue]}>
                  <Text style={[styles.valueText, row.win === 2 && styles.winningText]}>{row.stone2}</Text>
                </View>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Technical Deep Dive */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Specs</Text>
          <GlassCard style={styles.technicalCard}>
            <View style={styles.techItem}>
              <View style={styles.techHeader}>
                <Ruler size={16} color={COLORS.primary} />
                <Text style={styles.techLabel}>Cleavage</Text>
              </View>
              <View style={styles.techComparison}>
                <Text style={styles.techValue}>Indistinct</Text>
                <View style={styles.techDivider} />
                <Text style={styles.techValue}>None</Text>
              </View>
            </View>
            
            <View style={styles.techItem}>
              <View style={styles.techHeader}>
                <Zap size={16} color={COLORS.primary} />
                <Text style={styles.techLabel}>Luster</Text>
              </View>
              <View style={styles.techComparison}>
                <Text style={styles.techValue}>Vitreous</Text>
                <View style={styles.techDivider} />
                <Text style={styles.techValue}>Adamantine</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Conclusion */}
        <GlassCard style={styles.conclusionCard}>
          <Shield size={24} color={COLORS.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.conclusionTitle}>Expert Verdict</Text>
          <Text style={styles.conclusionText}>
            While Emerald offers unmatched color prestige, Sapphire is superior for daily wear due to its extreme hardness (9.0) and lack of cleavage.
          </Text>
        </GlassCard>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    marginBottom: SIZES.large,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '800',
  },
  shareBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  stoneColumn: {
    alignItems: 'center',
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
    marginBottom: 12,
  },
  stoneThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  stoneName: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '800',
  },
  vsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  vsText: {
    color: COLORS.background,
    fontWeight: '900',
    fontSize: 16,
  },
  tableCard: {
    padding: 0,
    marginBottom: 40,
  },
  tableRow: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLabelContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rowValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  valueBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  winningValue: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  valueText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  winningText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '800',
    marginBottom: 20,
  },
  technicalCard: {
    padding: 0,
  },
  techItem: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  techHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  techLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  techComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  techDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.glassBorder,
  },
  conclusionCard: {
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  conclusionTitle: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontWeight: '800',
    marginBottom: 8,
  },
  conclusionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
