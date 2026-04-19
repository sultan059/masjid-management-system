import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { 
  DrawerContentScrollView, 
  DrawerItemList 
} from '@react-navigation/drawer';
import { 
  User, 
  Settings, 
  LogOut, 
  Languages, 
  Moon 
} from 'lucide-react-native';
import { Theme } from '../theme/Theme';

const CustomDrawerContent = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* --- Profile Header --- */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User color={Theme.colors.onPrimary} size={32} strokeWidth={1.5} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Sultan Ahmed</Text>
            <Text style={styles.userRole}>Super Admin</Text>
          </View>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>

        {/* --- Divider Placeholder (Tonal shift) --- */}
        <View style={styles.tonalDivider} />

        {/* --- Language & Theme Toggles --- */}
        <View style={styles.footerOptions}>
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIcon}>
              <Languages size={20} color={Theme.colors.onSurfaceVariant} />
            </View>
            <Text style={styles.optionText}>Bangla (বাংলা)</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>EN</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIcon}>
              <Moon size={20} color={Theme.colors.onSurfaceVariant} />
            </View>
            <Text style={styles.optionText}>Dark Mode</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* --- Logout Component --- */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          // In a real app, integrate logout logic here
          console.log('Logging out...');
        }}
      >
        <LogOut size={20} color={Theme.colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: Theme.spacing.md,
  },
  userName: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onPrimary,
  },
  userRole: {
    ...Theme.typography.labelSm,
    color: 'rgba(255,255,255,0.7)',
  },
  drawerItemsContainer: {
    flex: 1,
    paddingHorizontal: Theme.spacing.sm,
  },
  tonalDivider: {
    height: 1,
    backgroundColor: Theme.colors.outlineVariant,
    opacity: 0.2,
    marginVertical: Theme.spacing.md,
    marginHorizontal: Theme.spacing.lg,
  },
  footerOptions: {
    paddingHorizontal: Theme.spacing.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  optionIcon: {
    marginRight: Theme.spacing.md,
  },
  optionText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurface,
    flex: 1,
  },
  badge: {
    backgroundColor: Theme.colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    ...Theme.typography.labelSm,
    fontSize: 9,
    color: Theme.colors.onSurfaceVariant,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.surfaceContainerLow,
  },
  logoutText: {
    ...Theme.typography.titleMd,
    fontSize: 16,
    color: Theme.colors.error,
    marginLeft: Theme.spacing.md,
  },
});

export default CustomDrawerContent;
