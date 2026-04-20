import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Search, Filter, MoreHorizontal, Download, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import transactionService from '../services/transactionService';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions(0, 20);
      setTransactions(data.content || data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTransactions();
      return;
    }
    try {
      const data = await transactionService.searchTransactions(searchQuery);
      setTransactions(data.content || data);
    } catch (error) {
      console.error('Error searching transactions:', error);
    }
  };

  const handleFilter = async (type) => {
    try {
      const data = await transactionService.filterByType(type, 0, 20);
      setTransactions(data.content || data);
    } catch (error) {
      console.error('Error filtering transactions:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.txRow}>
      <View style={styles.txMainInfo}>
        <View style={styles.avatarPlaceholder}>
           <Text style={styles.avatarText}>{item.paidBy ? item.paidBy.charAt(0) : '?'}</Text>
        </View>
        <View style={styles.txDetails}>
           <Text style={styles.txDonor}>{item.paidBy || 'Anonymous'}</Text>
           <Text style={styles.txPurpose}>{item.purpose} • {item.paymentMethod}</Text>
        </View>
      </View>
      <View style={styles.txRight}>
         <Text style={[
           styles.txAmount,
           { color: item.type === 'DEBIT' ? Theme.colors.error : Theme.colors.secondary }
         ]}>
           {item.type === 'DEBIT' ? '-' : '+'}৳ {item.amount}
         </Text>
         <Text style={styles.txDate}>{new Date(item.transactionDate).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
         <MoreHorizontal size={18} color={Theme.colors.outline} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.openDrawer()}>
          <Menu size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>All Transactions</Text>
        <TouchableOpacity style={styles.headerIcon}>
           <Download size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
         <View style={styles.searchBox}>
            <Search size={18} color={Theme.colors.outline} />
            <TextInput
              placeholder="Search transactions..."
              style={styles.searchInput}
              placeholderTextColor={Theme.colors.outline}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
         </View>
         <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('CREDIT')}>
            <Filter size={18} color={Theme.colors.primary} />
            <Text style={styles.filterText}>Income</Text>
         </TouchableOpacity>
         <TouchableOpacity style={[styles.filterButton, styles.filterButtonDebit]} onPress={() => handleFilter('DEBIT')}>
            <Text style={[styles.filterText, styles.filterTextDebit]}>Expense</Text>
         </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
        ListEmptyComponent={() => (
           <View style={{ padding: 40, alignItems: 'center' }}>
             {loading ? <ActivityIndicator /> : <Text style={{ color: Theme.colors.onSurfaceVariant }}>No transactions found.</Text>}
           </View>
        )}
        ListHeaderComponent={() => (
           <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>SHOWING RECENT ACTIVITY</Text>
           </View>
        )}
      />
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLowest,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    height: 48,
    ...Theme.shadows.ambient,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    ...Theme.typography.bodyMd,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.roundness.md,
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
  },
  filterButtonDebit: {
    borderColor: Theme.colors.error,
  },
  filterText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
    marginLeft: 4,
  },
  filterTextDebit: {
    color: Theme.colors.error,
  },
  listContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 40,
  },
  listHeader: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  listHeaderText: {
    ...Theme.typography.labelSm,
    fontSize: 9,
    color: Theme.colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLow,
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
    marginBottom: Theme.spacing.sm,
  },
  txMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Theme.typography.titleMd,
    fontSize: 16,
    color: Theme.colors.primary,
  },
  txDetails: {
    marginLeft: Theme.spacing.md,
  },
  txDonor: {
    ...Theme.typography.titleMd,
    fontSize: 16,
    color: Theme.colors.onSurface,
  },
  txPurpose: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    marginRight: Theme.spacing.sm,
  },
  txAmount: {
    ...Theme.typography.titleMd,
    fontSize: 16,
  },
  txDate: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.outline,
    marginTop: 4,
  },
  moreButton: {
    padding: Theme.spacing.xs,
  }
});

export default TransactionsScreen;