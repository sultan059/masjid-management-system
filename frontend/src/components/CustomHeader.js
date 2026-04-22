import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Menu, ChevronLeft } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Theme } from '../theme/Theme';

const CustomHeader = ({ 
  title, 
  subtitle, 
  showBack = false, 
  onBackPress, 
  rightComponent,
  transparent = false
}) => {
  const navigation = useNavigation();

  const handleLeftPress = () => {
    if (showBack) {
      if (onBackPress) {
        onBackPress();
      } else {
        navigation.goBack();
      }
    } else {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }
  };

  return (
    <View style={[styles.headerContainer, !transparent && styles.headerBackground]}>
      <TouchableOpacity style={styles.leftIconContainer} onPress={handleLeftPress}>
        {showBack ? (
          <ChevronLeft size={24} color={Theme.colors.onSurface} strokeWidth={2} />
        ) : (
          <Menu size={24} color={Theme.colors.onSurface} strokeWidth={2} />
        )}
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>

      <View style={styles.rightIconContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    height: 64,
  },
  headerBackground: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.surfaceContainerHigh,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  leftIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Theme.typography.titleLg,
    color: Theme.colors.onSurface,
    fontWeight: '700',
  },
  subtitle: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
    marginTop: 2,
  },
});

export default CustomHeader;
