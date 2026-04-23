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
  Image as RNImage,
} from 'react-native';
import { Lock, ChevronLeft, AlertCircle, Check, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import authService from '../services/authService';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (oldPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.changePassword(oldPassword, newPassword);
      setSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigation.goBack();
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
          <Text style={styles.title}>Change Password</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* --- Branding Section --- */}
        <View style={styles.branding}>
          <RNImage source={require('../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.appName}>Masjid Management System</Text>
        </View>

        {/* --- Form --- */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Set New Password</Text>
          <Text style={styles.formSubtitle}>Ensure your new password is secure</Text>

          {/* Old Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={Theme.colors.onSurfaceVariant} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor={Theme.colors.outline}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOldPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <EyeOff size={20} color={Theme.colors.onSurfaceVariant} />
              ) : (
                <Eye size={20} color={Theme.colors.onSurfaceVariant} />
              )}
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={Theme.colors.onSurfaceVariant} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={Theme.colors.outline}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff size={20} color={Theme.colors.onSurfaceVariant} />
              ) : (
                <Eye size={20} color={Theme.colors.onSurfaceVariant} />
              )}
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={Theme.colors.onSurfaceVariant} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={Theme.colors.outline}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={Theme.colors.onSurfaceVariant} />
              ) : (
                <Eye size={20} color={Theme.colors.onSurfaceVariant} />
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={styles.successContainer}>
              <Check size={16} color={Theme.colors.secondary} />
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Theme.colors.onPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* --- Footer --- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Password requirements:</Text>
          <Text style={styles.footerHint}>- At least 6 characters</Text>
          <Text style={styles.footerHint}>- Different from current password</Text>
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
    justifyContent: 'space-between',
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
  },
  branding: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  appName: {
    ...Theme.typography.headlineMd,
    fontSize: 22,
    color: Theme.colors.onSurface,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.xl,
    padding: Theme.spacing.xl,
    ...Theme.shadows.ambient,
  },
  formTitle: {
    ...Theme.typography.titleLg,
    color: Theme.colors.onSurface,
    marginBottom: Theme.spacing.xs,
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
  eyeButton: {
    padding: Theme.spacing.xs,
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
    marginTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
  },
  footerText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurfaceVariant,
    marginBottom: Theme.spacing.xs,
  },
  footerHint: {
    ...Theme.typography.bodySm,
    color: Theme.colors.outline,
    marginTop: 2,
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
    alignItems: 'center',
    backgroundColor: 'rgba(34, 120, 73, 0.1)',
    padding: Theme.spacing.sm,
    borderRadius: Theme.roundness.md,
    marginBottom: Theme.spacing.md,
  },
  successText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.secondary,
    marginLeft: 4,
  },
});

export default ChangePasswordScreen;
