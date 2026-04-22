import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Image as RNImage
} from 'react-native';
import { Mail, Lock, LogIn, ChevronRight, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import authService from '../services/authService';

const LoginScreen = ({ onLogin }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      onLogin(); // Trigger state update
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* --- Branding Section --- */}
        <View style={styles.branding}>
          <RNImage source={require('../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.appName}>Masjid Management System</Text>
        </View>

        {/* --- Login Form --- */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to manage your masjid</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
               <Mail size={20} color={Theme.colors.onSurfaceVariant} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Theme.colors.outline}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
               <Lock size={20} color={Theme.colors.onSurfaceVariant} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Theme.colors.outline}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Theme.colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Login</Text>
                <ChevronRight size={20} color={Theme.colors.onPrimary} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* --- Footer --- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Request Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  branding: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  appName: {
    ...Theme.typography.headlineMd,
    fontSize: 26,
    color: Theme.colors.onSurface,
    marginTop: Theme.spacing.lg,
  },
  appSubtitle: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
  },
  formCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.xl,
    padding: Theme.spacing.xl,
    ...Theme.shadows.ambient,
  },
  formTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 24,
    color: Theme.colors.onSurface,
  },
  formSubtitle: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
    marginBottom: Theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: Theme.roundness.md,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: Theme.spacing.sm,
  },
  input: {
    ...Theme.typography.bodyMd,
    flex: 1,
    color: Theme.colors.onSurface,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Theme.spacing.xl,
  },
  forgotText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
  },
  loginButton: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    ...Theme.shadows.ambient,
  },
  loginButtonText: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onPrimary,
    marginRight: Theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.xl,
  },
  footerText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
  },
  footerLink: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.primary,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    padding: Theme.spacing.sm,
    borderRadius: Theme.roundness.md,
    marginBottom: Theme.spacing.md,
  },
  errorText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.error,
    marginLeft: 4,
  }
});

export default LoginScreen;
