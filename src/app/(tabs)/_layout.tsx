import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '@/constants/theme';
import { Home, Compass, FolderHeart, User, Scan } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5, 5, 5, 0.95)' }]} />
          )
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }: { color: string }) => <Compass size={24} color={color} />,
        }}
      />
      
      {/* Custom Scan Button Middle Tab */}
      <Tabs.Screen
        name="scan_placeholder"
        options={{
          tabBarButton: ({ children, onPress, ...props }) => {
            // Sanitize props to avoid null vs undefined conflicts in TouchableOpacity
            const { delayLongPress, ...safeProps } = props as any;
            return (
              <TouchableOpacity
                onPress={(e) => {
                  router.push('/scan');
                  onPress?.(e);
                }}
                style={styles.scanButtonContainer}
                activeOpacity={0.8}
                {...safeProps}
              >
                <View style={styles.scanButton}>
                  <Scan size={30} color={COLORS.background} />
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }: { color: string }) => <FolderHeart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    elevation: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  scanButtonContainer: {
    top: Platform.OS === 'ios' ? -35 : -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
});
