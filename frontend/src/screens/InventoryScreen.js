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
import { Package, MoreVertical, Plus, Filter, Search, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import inventoryService from '../services/inventoryService';

const InventoryScreen = () => {
  const navigation = useNavigation();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async () => {
    try {
      const data = await inventoryService.getAllItems(0, 50);
      setInventoryItems(data.content || data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const getStockStatus = (item) => {
    if (item.quantity <= item.minQuantity) {
      return { status: 'Low Stock', isLow: true };
    }
    return { status: 'In Stock', isLow: false };
  };

  const renderItem = ({ item }) => {
    const { status, isLow } = getStockStatus(item);
    return (
      <TouchableOpacity style={styles.itemCard}>
        <View style={styles.itemIconContainer}>
          <Package size={24} color={Theme.colors.primary} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category} • {item.unit}</Text>
        </View>
        <View style={styles.itemStats}>
          <Text style={styles.itemStock}>{item.quantity}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isLow ? Theme.colors.errorContainer : Theme.colors.secondaryContainer }
          ]}>
            <Text style={[
              styles.statusText,
              { color: isLow ? Theme.colors.onErrorContainer : Theme.colors.onSecondaryContainer }
            ]}>
              {status}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color={Theme.colors.outline} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Filter & Header --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.openDrawer()}>
          <Menu size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Inventory</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Search size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Filter size={22} color={Theme.colors.onSurface} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={inventoryItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
        ListHeaderComponent={() => (
           <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                 <Text style={styles.summaryValue}>{inventoryItems.length}</Text>
                 <Text style={styles.summaryLabel}>Total Items</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                 <Text style={[styles.summaryValue, { color: Theme.colors.error }]}>
                   {inventoryItems.filter(i => i.quantity <= i.minQuantity).length}
                 </Text>
                 <Text style={styles.summaryLabel}>Low Stock</Text>
              </View>
           </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 40, alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Package size={40} color={Theme.colors.outline} />
                <Text style={{ marginTop: 10, color: Theme.colors.onSurfaceVariant }}>No inventory items</Text>
              </>
            )}
          </View>
        )}
      />

      {/* --- Floating Action Button --- */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={28} color={Theme.colors.onPrimary} />
      </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
  },
  headerIcon: {
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.xs,
  },
  listContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 100,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surfaceContainerLowest,
    padding: Theme.spacing.lg,
    borderRadius: Theme.roundness.xl,
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.ambient,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    ...Theme.typography.titleMd,
    fontSize: 24,
    color: Theme.colors.primary,
  },
  summaryLabel: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Theme.colors.outlineVariant,
    opacity: 0.3,
    marginVertical: 4,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLow,
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
    marginBottom: Theme.spacing.md,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  itemName: {
    ...Theme.typography.titleMd,
    fontSize: 16,
    color: Theme.colors.onSurface,
  },
  itemCategory: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  itemStats: {
    alignItems: 'flex-end',
    marginRight: Theme.spacing.sm,
  },
  itemStock: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onSurface,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    ...Theme.typography.labelSm,
    fontSize: 9,
  },
  moreButton: {
    padding: Theme.spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.ambient,
    elevation: 8,
  }
});

export default InventoryScreen;