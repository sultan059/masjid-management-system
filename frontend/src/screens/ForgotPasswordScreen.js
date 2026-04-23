import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image as RNImage
} from 'react-native';
import { Mail, ChevronLeft, AlertCircle, Check } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import authService from '../services/authService';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token: resetToken } = route.params || {};

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isTokenMode = !!resetToken;

  const handleRequestReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.requestPasswordReset(email);
      setSuccess(response.message);
      if (response.resetToken) {
        // In demo mode, show the token
        setSuccess(`${response.message}\n\nDemo Token: ${response.resetToken}`);
      }
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.confirmPasswordReset(resetToken, newPassword);
      setSuccess(response.message);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
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
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={Theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* --- Branding Section --- */}
        <View style={styles.branding}>
          <RNImage source={require('../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.appName}>Masjid Management System</Text>
          <Text style={styles.forgotTitle}>
            {isTokenMode ? 'Reset Password' : 'Forgot Password'}
          </Text>
          <Text style={styles.appSubtitle}>
            {isTokenMode
              ? 'Enter your new password'
              : 'Enter your email to receive a reset link'}
          </Text>
        </View>

        {/* --- Form --- */}
        <View style={styles.formCard}>
          {!isTokenMode && !success && (
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
          )}

          {success && !isTokenMode && (
            <View style={styles.tokenDisplay}>
              <Text style={styles.tokenLabel}>Your Demo Reset Token:</Text>
              <Text style={styles.tokenText}>{success.split('\n\nDemo Token: ')[1]}</Text>
              <Text style={styles.tokenHint}>Copy this token to reset your password</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={Theme.colors.onSurfaceVariant} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Paste your token here"
                  placeholderTextColor={Theme.colors.outline}
                  value={manualToken}
                  onChangeText={setManualToken}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {isTokenMode && (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={Theme.colors.onSurfaceVariant} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  placeholderTextColor={Theme.colors.outline}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={Theme.colors.onSurfaceVariant} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  placeholderTextColor={Theme.colors.outline}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={styles.successContainer}>
              <Check size={16} color={Theme.colors.secondary} />
              <Text style={styles.successText}>Reset link generated! Check the message below.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={() => {
              if (isTokenMode) {
                handleConfirmReset();
              } else if (success && manualToken) {
                navigation.navigate('ForgotPassword', { token: manualToken });
              } else {
                handleRequestReset();
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Theme.colors.onPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isTokenMode
                  ? 'Reset Password'
                  : success && manualToken
                  ? 'Continue to Reset'
                  : 'Send Reset Link'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* --- Footer --- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Login</Text>
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
    paddingHorizontal: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  branding: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  appName: {
    ...Theme.typography.headlineMd,
    fontSize: 26,
    color: Theme.colors.onSurface,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  forgotTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 24,
    color: Theme.colors.onSurface,
    marginTop: Theme.spacing.xl,
  },
  appSubtitle: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.xl,
    padding: Theme.spacing.xl,
    ...Theme.shadows.ambient,
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
  submitButton: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    ...Theme.shadows.ambient,
    marginTop: Theme.spacing.md,
  },
  submitButtonText: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onPrimary,
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
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(34, 120, 73, 0.1)',
    padding: Theme.spacing.sm,
    borderRadius: Theme.roundness.md,
    marginBottom: Theme.spacing.md,
  },
  successText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.secondary,
    marginLeft: 4,
    flex: 1,
  },
  tokenDisplay: {
    marginBottom: Theme.spacing.md,
  },
  tokenLabel: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurfaceVariant,
    marginBottom: Theme.spacing.xs,
  },
  tokenText: {
    ...Theme.typography.bodyMd,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Theme.colors.primary,
    backgroundColor: Theme.colors.surfaceContainerLow,
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  tokenHint: {
    ...Theme.typography.labelSm,
    color: Theme.colors.outline,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
