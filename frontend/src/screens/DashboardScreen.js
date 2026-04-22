import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Image as RNImage } from 'react-native';
import {
  Bell,
  Menu,
  Heart,
  Clock,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  LogIn,
  BookOpen
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import BottomNav from '../components/BottomNav';
import dashboardService from '../services/dashboardService';

const DashboardScreen = ({ isAuthenticated = false, navigation }) => {
  const nav = useNavigation();
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
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

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
        {isAuthenticated && (
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.openDrawer()}>
            <Menu size={24} color={Theme.colors.onSurface} strokeWidth={1.5} />
          </TouchableOpacity>
        )}
        <View style={styles.headerCenter}>
          <RNImage source={require('../../assets/logo.png')} style={styles.headerLogo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Masjid (Mosque)</Text>
            <Text style={styles.greeting}>Management System</Text>
          </View>
        </View>
        {!isAuthenticated && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => nav.navigate('Login')}
            activeOpacity={0.7}
          >
            <RNImage source={require('../../assets/login-icon.png')} style={styles.loginButtonImage} />
          </TouchableOpacity>
        )}
        {isAuthenticated && (
          <TouchableOpacity style={[styles.iconButton, styles.notificationBadge]}>
            <Bell size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
            <View style={styles.badge} />
          </TouchableOpacity>
        )}
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

        {/* --- Recent Announcements (Logged In) OR Read Quran (Not Logged In) --- */}
        {isAuthenticated ? (
          <>
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
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Read Quran</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Explore</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.quranCard} onPress={() => nav.navigate('ReadQuran')}>
              <View style={styles.quranContent}>
                <View style={styles.quranIconContainer}>
                  <BookOpen size={28} color={Theme.colors.primary} />
                </View>
                <View style={styles.quranTextContainer}>
                  <Text style={styles.quranTitle}>Explore the Holy Quran</Text>
                  <Text style={styles.quranSubtitle}>Read, reflect, and connect with the word of Allah</Text>
                </View>
                <ChevronRight size={24} color={Theme.colors.outline} />
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* --- Stats Band --- */}
        {isAuthenticated && (
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
        )}

      </ScrollView>

      {isAuthenticated ? (
        <BottomNav isAuthenticated={isAuthenticated} />
      ) : (
        <View style={styles.bottomCopyright}>
          <Text style={styles.copyrightText}>© 2026 Masjid Management System. All rights reserved.</Text>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerLogo: {
    width: 28,
    height: 28,
    marginRight: Theme.spacing.sm,
    resizeMode: 'contain',
  },
  greeting: {
    ...Theme.typography.labelSm,
    fontSize: 14,
    color: Theme.colors.onSurfaceVariant,
    lineHeight: 18,
    textAlign: 'center',
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
  },
  loginButton: {
    position: 'absolute',
    right: Theme.spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  loginButtonImage: {
    width: 56,
    height: 24,
    resizeMode: 'contain',
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
  quranCard: {
    marginHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.ambient,
  },
  quranContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quranIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(76, 111, 163, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quranTextContainer: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  quranTitle: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onSurface,
  },
  quranSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 4,
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
  },
  bottomCopyright: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.outline,
  },
  copyrightText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
    textAlign: 'center',
  }
});

export default DashboardScreen;