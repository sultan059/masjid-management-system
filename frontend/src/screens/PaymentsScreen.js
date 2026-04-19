import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft, ChevronRight, Plus } from 'lucide-react-native';
import { Theme } from '../theme/Theme';
import donationService from '../services/donationService';
import transactionService from '../services/transactionService';

const PaymentsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ balance: 0, weeklyIncome: 0, weeklyExpense: 0 });

  const fetchData = async () => {
    try {
      const [transactionsData, donationsData, txStats] = await Promise.all([
        transactionService.getAllTransactions(0, 10),
        donationService.getAllDonations(0, 10),
        transactionService.getTransactionStats()
      ]);

      setTransactions(transactionsData.content || transactionsData || []);
      setDonations(donationsData.content || donationsData || []);
      setStats({
        balance: 0,
        weeklyIncome: txStats.weeklyIncome || 0,
        weeklyExpense: txStats.weeklyExpense || 0
      });
    } catch (error) {
      console.error('Error fetching payments data:', error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Combine transactions and donations into a single feed
  const combinedTransactions = [...transactions].map(tx => ({
    ...tx,
    title: tx.purpose || tx.donorName || 'Transaction',
    type: tx.type === 'CREDIT' ? 'credit' : 'debit',
    amount: formatCurrency(tx.amount),
    date: formatDate(tx.transactionDate || tx.createdAt)
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payments</Text>
        <TouchableOpacity style={styles.receiveButton}>
           <Plus size={20} color={Theme.colors.onPrimary} />
           <Text style={styles.receiveButtonText}>Receive</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
      >
        {/* --- Balance Overview --- */}
        <View style={styles.balanceCard}>
           <Text style={styles.balanceLabel}>WEEKLY FLOW</Text>
           <View style={styles.statsRow}>
              <View style={styles.statBox}>
                 <ArrowDownLeft size={16} color={Theme.colors.secondary} />
                 <Text style={styles.statText}>{formatCurrency(stats.weeklyIncome)} Income</Text>
              </View>
              <View style={styles.statBox}>
                 <ArrowUpRight size={16} color={Theme.colors.error} />
                 <Text style={styles.statText}>{formatCurrency(stats.weeklyExpense)} Expense</Text>
              </View>
           </View>
        </View>

        {/* --- Quick Search --- */}
        <View style={styles.searchContainer}>
           <TextInput
              style={styles.searchInput}
              placeholder="Search donor or transaction ID..."
              placeholderTextColor={Theme.colors.outline}
           />
        </View>

        {/* --- Recent Transactions --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Recent Activity</Text>
           <TouchableOpacity>
              <Text style={styles.seeAll}>History</Text>
           </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : combinedTransactions.length > 0 ? (
          <View style={styles.transactionList}>
             {combinedTransactions.map((tx, index) => (
               <TouchableOpacity key={tx.id || index} style={styles.txItem}>
                  <View style={[styles.txIcon, { backgroundColor: tx.type === 'credit' ? 'rgba(0, 110, 28, 0.1)' : 'rgba(186, 26, 26, 0.1)' }]}>
                     {tx.type === 'credit' ?
                       <ArrowDownLeft size={20} color={Theme.colors.secondary} /> :
                       <ArrowUpRight size={20} color={Theme.colors.error} />
                     }
                  </View>
                  <View style={styles.txInfo}>
                     <Text style={styles.txTitle}>{tx.title}</Text>
                     <Text style={styles.txDate}>{tx.date}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: tx.type === 'credit' ? Theme.colors.secondary : Theme.colors.error }]}>
                     {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                  </Text>
                  <ChevronRight size={16} color={Theme.colors.outline} />
               </TouchableOpacity>
             ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        )}

        {/* --- Payment Methods --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Payment Methods</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.methodsScroll}>
            <TouchableOpacity style={styles.methodCard}>
               <CreditCard size={24} color={Theme.colors.primary} />
               <Text style={styles.methodName}>Bank Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodCard}>
               <DollarSign size={24} color={Theme.colors.tertiary} />
               <Text style={styles.methodName}>Cash Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodCard}>
               <CreditCard size={24} color={Theme.colors.secondary} />
               <Text style={styles.methodName}>Mobile Banking</Text>
            </TouchableOpacity>
        </ScrollView>
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
  receiveButton: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.roundness.md,
    ...Theme.shadows.ambient,
  },
  receiveButtonText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onPrimary,
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxl,
  },
  balanceCard: {
    backgroundColor: Theme.colors.primary,
    marginHorizontal: Theme.spacing.lg,
    borderRadius: Theme.roundness.xl,
    padding: Theme.spacing.xl,
    marginTop: Theme.spacing.md,
    ...Theme.shadows.ambient,
  },
  balanceLabel: {
    ...Theme.typography.labelSm,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Theme.spacing.md,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: Theme.spacing.sm,
  },
  statText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onPrimary,
    marginLeft: 4,
  },
  searchContainer: {
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
  },
  searchInput: {
    backgroundColor: Theme.colors.surfaceContainerLow,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    ...Theme.typography.bodyMd,
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
  transactionList: {
    paddingHorizontal: Theme.spacing.lg,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLowest,
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.ambient,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  txTitle: {
    ...Theme.typography.titleMd,
    fontSize: 16,
    color: Theme.colors.onSurface,
  },
  txDate: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.onSurfaceVariant,
  },
  txAmount: {
    ...Theme.typography.titleMd,
    marginRight: Theme.spacing.sm,
  },
  emptyState: {
    paddingHorizontal: Theme.spacing.lg,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
  },
  methodsScroll: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  methodCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    padding: Theme.spacing.lg,
    borderRadius: Theme.roundness.lg,
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    width: 120,
    ...Theme.shadows.ambient,
  },
  methodName: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    marginTop: 8,
    color: Theme.colors.onSurface,
    textAlign: 'center',
  }
});

export default PaymentsScreen;