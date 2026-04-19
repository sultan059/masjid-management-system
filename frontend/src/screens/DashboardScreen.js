import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import {
  Bell,
  Menu,
  Search,
  Heart,
  Clock,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react-native';
import { Theme } from '../theme/Theme';
import dashboardService from '../services/dashboardService';

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'success':
        return <Heart size={20} color={Theme.colors.secondary} />;
      case 'warning':
        return <AlertCircle size={20} color={Theme.colors.tertiary} />;
      case 'info':
      default:
        return <Calendar size={20} color={Theme.colors.primary} />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const { balance, prayerTimes, nextPrayer, nextPrayerTime, announcements, stats, featuredEvents } = dashboardData || {};

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header: Ultra Compact --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <Menu size={24} color={Theme.colors.onSurface} strokeWidth={1.5} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Masjid Management System</Text>
            <Text style={styles.mosqueName}>Professional Masjid Manager</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.notificationBadge]}>
            <Bell size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
      >
        {/* --- Hero Section: Prayer Times --- */}
        <View style={styles.heroSection}>
          <View style={styles.prayerTimesCard}>
            <View style={styles.prayerHeader}>
              <View>
                <Text style={styles.label}>UPCOMING PRAYER</Text>
                <Text style={styles.upcomingPrayerName}>{nextPrayer || 'Asr'}</Text>
              </View>
              <Text style={styles.upcomingPrayerTime}>{nextPrayerTime || '04:15 PM'}</Text>
            </View>

            <View style={styles.prayerGrid}>
              {prayerTimes && prayerTimes.length > 0 ? (
                prayerTimes.map((prayer, index) => (
                  <View
                    key={index}
                    style={[
                      styles.prayerItem,
                      prayer.active && styles.activePrayerItem
                    ]}
                  >
                    <Text style={[styles.prayerItemName, prayer.active && styles.activeText]}>{prayer.name}</Text>
                    <Text style={[styles.prayerItemTime, prayer.active && styles.activeText]}>{prayer.time}</Text>
                  </View>
                ))
              ) : (
                [
                  { name: 'Fajr', time: '04:52 AM', active: false },
                  { name: 'Dhuhr', time: '12:05 PM', active: false },
                  { name: 'Asr', time: '04:15 PM', active: true },
                  { name: 'Maghrib', time: '06:12 PM', active: false },
                  { name: 'Isha', time: '07:34 PM', active: false },
                ].map((prayer, index) => (
                  <View
                    key={index}
                    style={[
                      styles.prayerItem,
                      prayer.active && styles.activePrayerItem
                    ]}
                  >
                    <Text style={[styles.prayerItemName, prayer.active && styles.activeText]}>{prayer.name}</Text>
                    <Text style={[styles.prayerItemTime, prayer.active && styles.activeText]}>{prayer.time}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>

        {/* --- Quick Action: Donation --- */}
        <TouchableOpacity style={styles.donationCard}>
          <View style={styles.donationContent}>
            <View style={styles.donationIconContainer}>
              <Heart size={24} color={Theme.colors.tertiary} fill={Theme.colors.tertiary} />
            </View>
            <View style={styles.donationTextContainer}>
              <Text style={styles.cardTitle}>Ramadan Sadaqah</Text>
              <Text style={styles.cardSubtitle}>Support the community kitchen</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '75%' }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.goldButton}>
               <Text style={styles.goldButtonText}>Donate</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* --- Recent Announcements --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {announcements && announcements.length > 0 ? (
            announcements.slice(0, 5).map((item, index) => (
              <TouchableOpacity key={item.id || index} style={styles.listItem}>
                <View style={styles.listItemIcon}>{getIconForType(item.icon)}</View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                  <Text style={styles.listItemDesc}>{item.description}</Text>
                  <Text style={styles.listItemTime}>{item.timeAgo}</Text>
                </View>
                <ChevronRight size={20} color={Theme.colors.outline} />
              </TouchableOpacity>
            ))
          ) : (
            [
              { title: 'Friday Khutbah Topic', desc: 'The Importance of Zakat in Community Building', time: '2h ago', icon: 'info' },
              { title: 'New Bangla Class', desc: 'Registration open for Saturday morning kids classes', time: '5h ago', icon: 'trending' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.listItem}>
                <View style={styles.listItemIcon}>
                  <Calendar color={Theme.colors.primary} size={20} />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                  <Text style={styles.listItemDesc}>{item.desc}</Text>
                  <Text style={styles.listItemTime}>{item.time}</Text>
                </View>
                <ChevronRight size={20} color={Theme.colors.outline} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* --- Stats Band --- */}
        <View style={styles.statsBand}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.musallis || 0}</Text>
            <Text style={styles.statLabel}>MUSALLIS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>৳ {stats?.weeklyIncome?.toLocaleString() || balance?.weekly?.toLocaleString() || 0}</Text>
            <Text style={styles.statLabel}>THIS WEEK</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.eventsCount || 0}</Text>
            <Text style={styles.statLabel}>EVENTS</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: Theme.spacing.md,
  },
  greeting: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurfaceVariant,
  },
  mosqueName: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onSurface,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: Theme.spacing.xs,
    marginLeft: Theme.spacing.sm,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.error,
    borderWidth: 1.5,
    borderColor: Theme.colors.surface,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxl,
  },
  heroSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
  },
  prayerTimesCard: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.roundness.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadows.ambient,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Theme.spacing.xl,
  },
  label: {
    ...Theme.typography.labelSm,
    color: 'rgba(255,255,255,0.7)',
  },
  upcomingPrayerName: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onPrimary,
    marginTop: 2,
  },
  upcomingPrayerTime: {
    ...Theme.typography.displayLg,
    fontSize: 32,
    lineHeight: 40,
    color: Theme.colors.onPrimary,
  },
  prayerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerItem: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xs,
    borderRadius: Theme.roundness.md,
  },
  activePrayerItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  prayerItemName: {
    ...Theme.typography.labelSm,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  prayerItemTime: {
    ...Theme.typography.bodyMd,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: 'rgba(255,255,255,0.9)',
  },
  activeText: {
    color: '#ffffff',
  },
  donationCard: {
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.ambient,
    borderWidth: 0,
  },
  donationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(117, 91, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donationTextContainer: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  cardTitle: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onSurface,
  },
  cardSubtitle: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Theme.colors.surfaceContainerHigh,
    borderRadius: 2,
    marginTop: Theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Theme.colors.tertiary,
  },
  goldButton: {
    backgroundColor: Theme.colors.tertiary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.roundness.md,
    marginLeft: Theme.spacing.sm,
  },
  goldButtonText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onTertiaryContainer,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.onSurface,
  },
  seeAll: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
  },
  listContainer: {
    paddingHorizontal: Theme.spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLow,
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    marginBottom: Theme.spacing.sm,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  listItemTitle: {
    ...Theme.typography.bodyMd,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Theme.colors.onSurface,
  },
  listItemDesc: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  listItemTime: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.outline,
    marginTop: 4,
  },
  statsBand: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surfaceContainerLowest,
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
    padding: Theme.spacing.lg,
    borderRadius: Theme.roundness.xl,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...Theme.shadows.ambient,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Theme.typography.titleMd,
    fontSize: 22,
    color: Theme.colors.primary,
  },
  statLabel: {
    ...Theme.typography.labelSm,
    fontSize: 9,
    color: Theme.colors.onSurfaceVariant,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Theme.colors.outlineVariant,
    opacity: 0.5,
  }
});

export default DashboardScreen;