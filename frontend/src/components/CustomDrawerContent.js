import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  User,
  Settings,
  Languages,
  Moon,
  LayoutDashboard,
  Wallet,
  Package,
  BarChart3,
  Calendar,
  Building2,
  X,
  LogOut,
} from 'lucide-react-native';
import authService from '../services/authService';
import { Theme } from '../theme/Theme';

const menuItems = [
  { name: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'Financials', label: 'Financials', icon: Wallet },
  { name: 'Inventory', label: 'Inventory', icon: Package },
  { name: 'Reports', label: 'Reports', icon: BarChart3 },
  { name: 'Events', label: 'Events', icon: Calendar },
  { name: 'MosqueInfo', label: 'Mosque Information', icon: Building2 },
];

const CustomDrawerContent = (props) => {
  const [language, setLanguage] = useState('en');
  const { onLogout } = props;
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('state', () => {
      forceUpdate((n) => n + 1);
    });
    return unsubscribe;
  }, [props.navigation]);

  const drawerState = props.navigation.getState();
  const activeRouteName = drawerState?.routes[drawerState?.index || 0]?.name || 'Dashboard';

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      props.navigation.closeDrawer();
      setTimeout(() => {
        if (onLogout) {
          onLogout();
        }
        props.navigation.navigate('DashboardUnauth');
      }, 300);
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Language Toggle Pill (Top-most) */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.languageToggle}
            onPress={toggleLanguage}
          >
            <Languages size={14} color={Theme.colors.primary} />
            <Text style={styles.languageText}>EN | বাংলা</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User color={Theme.colors.onPrimary} size={36} strokeWidth={1.5} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Ahmed Khan</Text>
            <View style={styles.roleContainer}>
              <View style={styles.roleDot} />
              <Text style={styles.userRole}>Admin</Text>
            </View>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={styles.navContainer}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRouteName === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.navItem,
                  isActive && styles.navItemActive,
                ]}
                onPress={() => {
                  props.navigation.navigate(item.name);
                  props.navigation.closeDrawer();
                }}
              >
                <Icon
                  size={22}
                  color={isActive ? Theme.colors.primary : Theme.colors.onSurfaceVariant}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <Text
                  style={[
                    styles.navText,
                    isActive && styles.navTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Settings */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => props.navigation.navigate('Settings')}
        >
          <Settings size={22} color={Theme.colors.onSurfaceVariant} strokeWidth={1.5} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={22} color={Theme.colors.error} strokeWidth={1.5} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </DrawerContentScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceContainerLowest,
  },
  scrollContent: {
    paddingTop: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  languageToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xs,
    borderRadius: Theme.roundness.xl,
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(194, 201, 187, 0.3)',
  },
  languageText: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profileHeader: {
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.xl,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: Theme.roundness.lg,
    backgroundColor: Theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  profileInfo: {},
  userName: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.tertiaryContainer,
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
  navContainer: {
    paddingHorizontal: Theme.spacing.md,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    marginVertical: 2,
  },
  navItemActive: {
    backgroundColor: 'rgba(27, 94, 32, 0.1)',
  },
  navText: {
    ...Theme.typography.bodyMd,
    marginLeft: Theme.spacing.md,
    color: Theme.colors.onSurfaceVariant,
    fontWeight: '500',
    fontSize: 15,
  },
  navTextActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  divider: {
    height: Theme.spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    marginTop: Theme.spacing.xl,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
  },
  logoutText: {
    ...Theme.typography.bodyMd,
    marginLeft: Theme.spacing.md,
    color: Theme.colors.error,
    fontWeight: '600',
    fontSize: 15,
  },
  bottomSpacer: {
    height: Theme.spacing.xxl,
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.surfaceContainerLow,
    backgroundColor: Theme.colors.surfaceContainerLowest,
  },
  versionText: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Theme.colors.outline,
    opacity: 0.5,
    fontWeight: '600',
  },
});

export default CustomDrawerContent;
