import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // Root layout handles navigation based on auth state
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the elite circle of stone collectors</Text>
        </View>

        <GlassCard style={styles.authCard}>
          <View style={styles.inputContainer}>
            <User size={20} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? (
                <EyeOff size={20} color={COLORS.textMuted} />
              ) : (
                <Eye size={20} color={COLORS.textMuted} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={styles.termsRow}>
            <TouchableOpacity 
              style={[styles.checkbox, agreeTerms && styles.checkboxChecked]} 
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              {agreeTerms && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <GlowButton
            title={loading ? "" : "Create Account"}
            onPress={handleSignup}
            style={styles.signupButton}
            disabled={loading}
          >
            {loading && <ActivityIndicator color={COLORS.background} />}
          </GlowButton>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login' as any)}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.extraLarge * 1.5,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  authCard: {
    width: '100%',
    padding: SIZES.padding,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  inputIcon: {
    marginRight: SIZES.medium,
  },
  eyeIcon: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.medium,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
    paddingRight: SIZES.large,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 2,
  },
  termsText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    flexShrink: 1,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  signupButton: {
    marginBottom: SIZES.extraLarge,
    height: 56,
    justifyContent: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.medium,
  },
  loginText: {
    color: COLORS.textSecondary,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
