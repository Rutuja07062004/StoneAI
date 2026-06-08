import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Shield, Award, Map, Settings as SettingsIcon, LogOut, ChevronRight, Crown, Mail, Calendar, Camera, X, Check } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const ACHIEVEMENTS = [
  { id: '1', name: 'Gem Hunter', icon: '💎', color: '#3B82F6' },
  { id: '2', name: 'Cave Explorer', icon: '🔦', color: '#F59E0B' },
  { id: '3', name: 'Master ID', icon: '🧠', color: '#10B981' },
  { id: '4', name: 'Global Scout', icon: '🌍', color: '#8B5CF6' },
];

const PRESET_AVATARS = [
  { id: 'sapphire', name: 'Sapphire', url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&q=80&w=200' },
  { id: 'emerald', name: 'Emerald', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200' },
  { id: 'ruby', name: 'Ruby', url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=200' },
  { id: 'topaz', name: 'Amber', url: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&q=80&w=200' },
  { id: 'obsidian', name: 'Obsidian', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=200' },
  { id: 'diamond', name: 'Quartz', url: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=200' },
];

const DEFAULT_AVATAR = PRESET_AVATARS[0].url;

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSelectedAvatar(user.avatar || DEFAULT_AVATAR);
    }
  }, [user, modalVisible]);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission to access gallery is required to upload an avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setSelectedAvatar(base64Image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    
    setUpdating(true);
    try {
      await updateProfile({
        name: name.trim(),
        avatar: selectedAvatar,
      });
      setModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

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
          <TouchableOpacity style={styles.settingsBtn} onPress={() => setModalVisible(true)}>
            <SettingsIcon size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
              <Image 
                source={{ uri: user?.avatar || DEFAULT_AVATAR }} 
                style={styles.avatar} 
              />
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                style={styles.crownContainer}
              >
                <Crown size={12} color={COLORS.background} fill={COLORS.background} />
              </LinearGradient>
              <View style={styles.editBadge}>
                <Camera size={10} color={COLORS.text} />
              </View>
            </TouchableOpacity>
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

      {/* Edit Profile & Settings Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          if (!updating) setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} disabled={updating}>
                <X size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              {/* Profile Image & Custom Upload */}
              <View style={styles.modalAvatarSection}>
                <TouchableOpacity onPress={handlePickImage} disabled={updating} activeOpacity={0.8}>
                  <View style={styles.modalAvatarContainer}>
                    <Image source={{ uri: selectedAvatar }} style={styles.modalAvatar} />
                    <View style={styles.modalCameraOverlay}>
                      <Camera size={14} color="#FFF" />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage} disabled={updating}>
                  <Text style={styles.uploadBtnText}>Upload Custom Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name"
                  placeholderTextColor={COLORS.textMuted}
                  editable={!updating}
                />
              </View>

              {/* Presets Grid */}
              <View style={styles.presetsSection}>
                <Text style={styles.inputLabel}>Choose Preset Avatar</Text>
                <View style={styles.presetsGrid}>
                  {PRESET_AVATARS.map((item) => {
                    const isSelected = selectedAvatar === item.url;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.presetItem,
                          isSelected && styles.presetItemActive
                        ]}
                        onPress={() => setSelectedAvatar(item.url)}
                        disabled={updating}
                        activeOpacity={0.7}
                      >
                        <Image source={{ uri: item.url }} style={styles.presetImage} />
                        {isSelected && (
                          <View style={styles.selectedIndicator}>
                            <Check size={10} color="#000" strokeWidth={3} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
                disabled={updating}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.saveBtn]}
                onPress={handleSave}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    paddingBottom: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '800',
  },
  modalForm: {
    flexGrow: 0,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  modalAvatarContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  modalAvatar: {
    width: '100%',
    height: '100%',
  },
  modalCameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  uploadBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: SIZES.large,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    fontSize: 15,
  },
  presetsSection: {
    marginBottom: SIZES.small,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  presetItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  presetItemActive: {
    borderColor: COLORS.primary,
  },
  presetImage: {
    width: '100%',
    height: '100%',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: SIZES.medium,
    paddingTop: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorder,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  saveBtnText: {
    color: COLORS.background,
    fontWeight: '800',
    fontSize: 14,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
});
