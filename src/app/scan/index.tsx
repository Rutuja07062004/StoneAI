import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { X, Zap, Image as ImageIcon, RotateCw, Camera as CameraIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system/legacy';

const { width, height } = Dimensions.get('window');

export default function CameraScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: height * 0.35,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const navigateWithImage = async (uri: string) => {
    try {
      router.push({
        pathname: '/scan/processing',
        params: { imageUri: uri },
      });
    } catch (e) {
      console.error('Failed to navigate:', e);
      setIsCapturing(false);
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Flash animation
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
          skipProcessing: true,
        });
        if (photo?.uri) {
          await navigateWithImage(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        setIsCapturing(false);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      await navigateWithImage(result.assets[0].uri);
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is needed to identify minerals</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Camera Access</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.cameraPreview}
        facing={type}
        enableTorch={flash}
      />

      {/* Flash Effect */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', opacity: flashAnim, zIndex: 99 }]}
        pointerEvents="none"
      />

      <View style={styles.overlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <X color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Mineral</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setFlash(!flash)}>
            <Zap color={flash ? COLORS.primary : '#fff'} size={24} />
          </TouchableOpacity>
        </View>

        {/* Scan Frame */}
        <View style={styles.scanFrameContainer}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]}>
              <LinearGradient
                colors={['transparent', COLORS.primary, 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.scanLineGradient}
              />
            </Animated.View>
          </View>
          <Text style={styles.hintText}>Hold steady — AI will identify the mineral</Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
            <ImageIcon color="#fff" size={24} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture} activeOpacity={0.8} disabled={isCapturing}>
            <View style={[styles.captureBtnOuter, isCapturing && { opacity: 0.5 }]}>
              <View style={styles.captureBtnInner}>
                {isCapturing
                  ? <ActivityIndicator color={COLORS.background} />
                  : <CameraIcon color={COLORS.background} size={30} />
                }
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={toggleCameraType}>
            <RotateCw color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraPreview: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingVertical: 60 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  iconBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  scanFrameContainer: { alignItems: 'center' },
  scanFrame: {
    width: width * 0.75, height: height * 0.35,
    position: 'relative', overflow: 'hidden',
  },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: COLORS.primary },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  scanLine: { width: '100%', height: 2, zIndex: 10 },
  scanLineGradient: { flex: 1, opacity: 0.9 },
  hintText: {
    color: '#fff', marginTop: 24, fontSize: 14, fontWeight: '600',
    textAlign: 'center', paddingHorizontal: 40,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  secondaryBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  captureBtnOuter: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  captureBtnInner: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  permissionContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.background, padding: SIZES.padding,
  },
  permissionText: { color: COLORS.text, textAlign: 'center', fontSize: 18, marginBottom: 30 },
  permissionBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 30,
    paddingVertical: 15, borderRadius: 30, marginBottom: 20,
  },
  permissionBtnText: { color: COLORS.background, fontWeight: '800', fontSize: 16 },
  backBtn: { padding: 10 },
  backBtnText: { color: COLORS.textSecondary, fontSize: 14 },
});
