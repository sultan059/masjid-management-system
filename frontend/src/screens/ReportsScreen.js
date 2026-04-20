import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { BarChart2, PieChart, TrendingUp, Download, ChevronRight, Filter, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import reportService from '../services/reportService';
import transactionService from '../services/transactionService';

const ReportsScreen = () => {
  const navigation = useNavigation();
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState({ weeklyIncome: 0, monthlyIncome: 0, weeklyExpense: 0, monthlyExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [dailyReport, txStats] = await Promise.all([
        reportService.getDailyReport(),
        transactionService.getTransactionStats()
      ]);

      setReportData(dailyReport);
      setStats(txStats);
    } catch (error) {
      console.error('Error fetching report data:', error);
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

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `৳ ${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `৳ ${(amount / 1000).toFixed(1)}k`;
    }
    return `৳ ${amount.toLocaleString()}`;
  };

  const cardData = [
    {
      title: 'Weekly Income',
      value: formatCurrency(stats.weeklyIncome || 0),
      growth: '+12.5%',
      icon: <TrendingUp color={Theme.colors.secondary} size={20} />
    },
    {
      title: 'Weekly Expense',
      value: formatCurrency(stats.weeklyExpense || 0),
      growth: '-5.2%',
      icon: <BarChart2 color={Theme.colors.primary} size={20} />
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.openDrawer()}>
          <Menu size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.headerIcon}>
           <Filter size={24} color={Theme.colors.onSurface} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
      >
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* --- Quick Stats --- */}
            <View style={styles.statsGrid}>
              {cardData.map((item, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <View style={styles.statIcon}>{item.icon}</View>
                    <Text style={[styles.growthText, { color: item.growth.startsWith('+') ? Theme.colors.secondary : Theme.colors.error }]}>
                      {item.growth}
                    </Text>
                  </View>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statTitle}>{item.title}</Text>
                </View>
              ))}
            </View>

            {/* --- Revenue Chart Summary (Mockup) --- */}
            <View style={styles.chartCard}>
               <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Donation Trends</Text>
                  <TouchableOpacity style={styles.downloadButton}>
                     <Download size={18} color={Theme.colors.primary} />
                  </TouchableOpacity>
               </View>

               {/* Mockup for a chart */}
               <View style={styles.mockChartContainer}>
                  <View style={[styles.chartBar, { height: '40%' }]} />
                  <View style={[styles.chartBar, { height: '60%' }]} />
                  <View style={[styles.chartBar, { height: '30%' }]} />
                  <View style={[styles.chartBar, { height: '80%', backgroundColor: Theme.colors.primary }]} />
                  <View style={[styles.chartBar, { height: '50%' }]} />
                  <View style={[styles.chartBar, { height: '70%' }]} />
               </View>
               <View style={styles.chartLabels}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <Text key={d} style={styles.chartLabel}>{d}</Text>)}
               </View>
            </View>

            {/* --- Distribution Summary --- */}
            <View style={styles.distributionSection}>
               <Text style={styles.sectionTitle}>Fund Distribution</Text>
               <View style={styles.distributionCard}>
                  {[
                    { label: 'General Masjid', percent: '45%', color: Theme.colors.primary },
                    { label: 'Zakat Fund', percent: '30%', color: Theme.colors.secondary },
                    { label: 'Maintenance', percent: '15%', color: Theme.colors.tertiary },
                    { label: 'Others', percent: '10%', color: Theme.colors.outlineVariant },
                  ].map((item, index) => (
                    <View key={index} style={styles.distItem}>
                       <View style={styles.distHeader}>
                          <View style={[styles.distColor, { backgroundColor: item.color }]} />
                          <Text style={styles.distLabel}>{item.label}</Text>
                          <Text style={styles.distPercent}>{item.percent}</Text>
                       </View>
                       <View style={styles.distTrack}>
                          <View style={[styles.distFill, { width: item.percent, backgroundColor: item.color }]} />
                       </View>
                    </View>
                  ))}
               </View>
            </View>

            <TouchableOpacity style={styles.fullReportButton}>
               <Text style={styles.fullReportText}>Generate Monthly PDF Report</Text>
               <ChevronRight size={20} color={Theme.colors.onPrimary} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
  headerIcon: {
    padding: Theme.spacing.sm,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (Dimensions.get('window').width - 48) / 2,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.ambient,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthText: {
    ...Theme.typography.labelSm,
    fontSize: 10,
  },
  statValue: {
    ...Theme.typography.headlineMd,
    fontSize: 24,
    color: Theme.colors.onSurface,
    marginTop: Theme.spacing.md,
  },
  statTitle: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  chartCard: {
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadows.ambient,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  chartTitle: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onSurface,
  },
  downloadButton: {
    padding: Theme.spacing.xs,
  },
  mockChartContainer: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.sm,
  },
  chartBar: {
    width: 24,
    backgroundColor: Theme.colors.secondaryContainer,
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
  },
  chartLabel: {
    ...Theme.typography.labelSm,
    color: Theme.colors.outline,
    fontSize: 10,
    width: 24,
    textAlign: 'center',
  },
  distributionSection: {
    marginTop: Theme.spacing.xxl,
    paddingHorizontal: Theme.spacing.lg,
  },
  sectionTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.onSurface,
    marginBottom: Theme.spacing.md,
  },
  distributionCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.ambient,
  },
  distItem: {
    marginBottom: Theme.spacing.lg,
  },
  distHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  distColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  distLabel: {
    ...Theme.typography.bodyMd,
    flex: 1,
    color: Theme.colors.onSurface,
  },
  distPercent: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurfaceVariant,
  },
  distTrack: {
    height: 6,
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: 3,
    overflow: 'hidden',
  },
  distFill: {
    height: '100%',
  },
  fullReportButton: {
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xxl,
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.lg,
    borderRadius: Theme.roundness.md,
    ...Theme.shadows.ambient,
  },
  fullReportText: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onPrimary,
    marginRight: Theme.spacing.sm,
  }
});

export default ReportsScreen;