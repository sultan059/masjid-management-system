import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { User, Mail, Phone, Shield, LogOut, ChevronRight, ChevronLeft, Edit3, X, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import BottomNav from '../components/BottomNav';
import authService from '../services/authService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Ahmed Khan',
    email: 'ahmed.khan@masjid.com',
    phone: '+880 1700 000000',
  });
  const [originalData, setOriginalData] = useState({ ...formData });

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    // For now, we'll just exit edit mode
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'DashboardUnauth' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <X size={22} color={Theme.colors.error} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Check size={22} color={Theme.colors.secondary} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color={Theme.colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Edit3 size={20} color={Theme.colors.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User color={Theme.colors.onPrimary} size={48} strokeWidth={1.5} />
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Full Name"
              placeholderTextColor={Theme.colors.outline}
            />
          ) : (
            <Text style={styles.userName}>{formData.fullName}</Text>
          )}
          <View style={styles.roleContainer}>
            <View style={styles.roleDot} />
            <Text style={styles.userRole}>Admin</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Mail size={18} color={Theme.colors.onSurfaceVariant} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.inputField}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Email"
                    placeholderTextColor={Theme.colors.outline}
                  />
                ) : (
                  <Text style={styles.infoValue}>{formData.email}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Phone size={18} color={Theme.colors.onSurfaceVariant} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValueNonEditable}>{formData.phone}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Shield size={18} color={Theme.colors.onSurfaceVariant} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>Administrator</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsLeft}>
                <Shield size={20} color={Theme.colors.onSurfaceVariant} />
                <Text style={styles.settingsText}>Change Password</Text>
              </View>
              <ChevronRight size={18} color={Theme.colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Theme.colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav isAuthenticated={true} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  cancelButton: {
    padding: Theme.spacing.xs,
  },
  saveButton: {
    padding: Theme.spacing.xs,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
  },
  editButton: {
    padding: Theme.spacing.xs,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.lg,
    borderRadius: Theme.roundness.xl,
    ...Theme.shadows.ambient,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  nameInput: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
    fontFamily: 'PlusJakartaSans_700Bold',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outline,
    paddingBottom: 4,
    minWidth: 150,
  },
  userName: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.tertiary,
    marginRight: 6,
  },
  userRole: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
  },
  sectionTitle: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onSurface,
    marginBottom: Theme.spacing.md,
  },
  infoCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.ambient,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurfaceVariant,
    fontSize: 11,
  },
  infoValue: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurface,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },
  infoValueNonEditable: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },
  inputField: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurface,
    fontFamily: 'BeVietnamPro_600SemiBold',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.primary,
    paddingVertical: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Theme.colors.outlineVariant,
    marginVertical: Theme.spacing.xs,
  },
  settingsCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.lg,
    ...Theme.shadows.ambient,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurface,
    marginLeft: Theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
  },
  logoutText: {
    ...Theme.typography.titleMd,
    color: Theme.colors.error,
    marginLeft: Theme.spacing.sm,
  },
});

export default ProfileScreen;
