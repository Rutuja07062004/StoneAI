import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Shield, Award, Map, Settings as SettingsIcon, LogOut, ChevronRight, Crown, Mail, Calendar } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

const ACHIEVEMENTS = [
  { id: '1', name: 'Gem Hunter', icon: '💎', color: '#3B82F6' },
  { id: '2', name: 'Cave Explorer', icon: '🔦', color: '#F59E0B' },
  { id: '3', name: 'Master ID', icon: '🧠', color: '#10B981' },
  { id: '4', name: 'Global Scout', icon: '🌍', color: '#8B5CF6' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsBtn}>
            <SettingsIcon size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }} 
                style={styles.avatar} 
              />
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                style={styles.crownContainer}
              >
                <Crown size={12} color={COLORS.background} fill={COLORS.background} />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>Elite Collector</Text>
            </View>
            
            <View style={styles.userMeta}>
              <View style={styles.metaItem}>
                <Mail size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{user?.email}</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText}>Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>Scans</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>58</Text>
            <Text style={styles.statLabel}>Collection</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Awards</Text>
          </View>
        </View>

        {/* Premium Membership Card */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={['#1A1A1A', '#2D2D2D']}
            style={styles.premiumCard}
          >
            <View style={styles.premiumHeader}>
              <Crown size={24} color={COLORS.primary} />
              <Text style={styles.premiumTitle}>StoneAI Premium</Text>
            </View>
            <Text style={styles.premiumDesc}>Exclusive access to rare mineral data and expert appraisals.</Text>
            <Text style={styles.premiumStatus}>ACTIVE UNTIL DEC 2026</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementList}>
            {ACHIEVEMENTS.map((ach) => (
              <GlassCard key={ach.id} style={styles.achievementCard}>
                <View style={[styles.achIconContainer, { backgroundColor: `${ach.color}20` }]}>
                  <Text style={styles.achIcon}>{ach.icon}</Text>
                </View>
                <Text style={styles.achName}>{ach.name}</Text>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <GlassCard style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Award size={20} color={COLORS.primary} />
                <Text style={styles.menuText}>My Achievements</Text>
              </View>
              <ChevronRight size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Map size={20} color={COLORS.primary} />
                <Text style={styles.menuText}>Discovery Locations</Text>
              </View>
              <ChevronRight size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Shield size={20} color={COLORS.primary} />
                <Text style={styles.menuText}>Privacy & Security</Text>
              </View>
              <ChevronRight size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </GlassCard>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  settingsBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.medium,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  crownContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  userName: {
    color: COLORS.text,
    fontSize: SIZES.extraLarge,
    fontWeight: '800',
    marginBottom: 8,
  },
  userMeta: {
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  rankBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  rankText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.extraLarge,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.glassBorder,
    alignSelf: 'center',
  },
  premiumCard: {
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.extraLarge,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumTitle: {
    color: COLORS.primary,
    fontSize: SIZES.large,
    fontWeight: '900',
    marginLeft: 10,
  },
  premiumDesc: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    lineHeight: 20,
    marginBottom: 16,
  },
  premiumStatus: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  section: {
    marginBottom: SIZES.extraLarge,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '800',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.medium,
  },
  achievementList: {
    paddingLeft: SIZES.padding,
  },
  achievementCard: {
    width: 110,
    padding: SIZES.medium,
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  achIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achIcon: {
    fontSize: 24,
  },
  achName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  menuCard: {
    marginHorizontal: SIZES.padding,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginLeft: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.glassBorder,
    marginHorizontal: SIZES.padding,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    marginTop: SIZES.medium,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    fontWeight: '700',
    marginLeft: 10,
  },
});
