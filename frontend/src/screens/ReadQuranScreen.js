import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Theme } from '../theme/Theme';
import BottomNav from '../components/BottomNav';

const ReadQuranScreen = ({ isAuthenticated = false }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Read Quran</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
      <BottomNav isAuthenticated={isAuthenticated} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
  },
});

export default ReadQuranScreen;
