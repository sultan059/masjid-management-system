import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Home, Wallet, CreditCard, Package, User } from 'lucide-react-native';
import { Theme } from '../theme/Theme';

const navItems = [
  { name: 'Dashboard', label: 'Home', icon: Home },
  { name: 'Transactions', label: 'Transactions', icon: Wallet },
  { name: 'Financials', label: 'Payments', icon: CreditCard },
  { name: 'Inventory', label: 'Inventory', icon: Package },
  { name: 'MosqueInfo', label: 'Profile', icon: User },
];

const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getActiveRoute = () => {
    const currentRoute = route.name;
    if (currentRoute === 'MosqueInfo') return 'MosqueInfo';
    return currentRoute;
  };

  const activeRoute = getActiveRoute();

  const isActive = (itemName) => {
    if (itemName === 'Profile' && activeRoute === 'MosqueInfo') return true;
    return itemName === activeRoute;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navInner}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.name);
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => {
                if (!active) {
                  navigation.navigate(item.name);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon
                  size={22}
                  color={active ? Theme.colors.primary : '#71717a'}
                  strokeWidth={active ? 2 : 1.5}
                />
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingBottom: 28,
    paddingTop: 12,
  },
  navInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(27, 94, 32, 0.1)',
    borderRadius: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  iconContainerActive: {},
  label: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 10,
    color: '#71717a',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  labelActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
});

export default BottomNav;
