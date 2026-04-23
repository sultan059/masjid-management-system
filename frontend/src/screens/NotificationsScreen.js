import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Bell, MessageSquare, Info, AlertTriangle, ChevronRight, Check, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import BottomNav from '../components/BottomNav';
import LogoSmall from '../components/LogoSmall';
import notificationService from '../services/notificationService';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAllNotifications();
      // Backend returns List, not Page
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS': return <Check size={20} color={Theme.colors.secondary} />;
      case 'WARNING': return <AlertTriangle size={20} color={Theme.colors.error} />;
      case 'INFO': return <Info size={20} color={Theme.colors.primary} />;
      case 'ERROR': return <AlertTriangle size={20} color={Theme.colors.error} />;
      default: return <Bell size={20} color={Theme.colors.onSurfaceVariant} />;
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <View style={[styles.iconContainer, { backgroundColor: item.read ? Theme.colors.surfaceContainerLow : Theme.colors.surfaceContainerLowest }]}>
        {getIcon(item.type)}
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadText]}>{item.title}</Text>
          <Text style={styles.notificationTime}>{getTimeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.notificationBody} numberOfLines={2}>{item.body}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.openDrawer()}>
          <Menu size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={markAllRead}>
           <Text style={styles.markRead}>Mark all read</Text>
          </TouchableOpacity>
          <LogoSmall style={{ marginLeft: 12 }} />
        </View>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
        ListEmptyComponent={() => (
          <View style={{ padding: 40, alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Bell size={40} color={Theme.colors.outline} />
                <Text style={{ marginTop: 10, color: Theme.colors.onSurfaceVariant }}>No notifications</Text>
              </>
            )}
          </View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <BottomNav />
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
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
  },
  markRead: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
  },
  listContent: {
    paddingHorizontal: Theme.spacing.lg,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLowest,
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.ambient,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    ...Theme.typography.titleMd,
    fontSize: 16,
    color: Theme.colors.onSurface,
    flex: 1,
  },
  unreadText: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  notificationTime: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.outline,
    marginLeft: Theme.spacing.sm,
  },
  notificationBody: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary,
    position: 'absolute',
    top: 12,
    right: 12,
  }
});

export default NotificationsScreen;