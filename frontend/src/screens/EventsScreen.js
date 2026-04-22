import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground as RnImageBackground,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Calendar, Clock, MapPin, Users, ChevronRight, Plus, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../theme/Theme';
import BottomNav from '../components/BottomNav';
import CustomHeader from '../components/CustomHeader';
import eventService from '../services/eventService';

const EventsScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const [allEventsData, featuredData] = await Promise.all([
        eventService.getAllEvents(0, 20),
        eventService.getFeaturedEvents()
      ]);
      setEvents(allEventsData.content || allEventsData);
      setFeaturedEvents(featuredData.content || featuredData || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader 
        title="Events" 
        rightComponent={
          <TouchableOpacity>
             <Calendar size={24} color={Theme.colors.onSurface} strokeWidth={1.5} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
      >
        {/* --- Featured Event --- */}
        {featuredEvents.length > 0 && (
          <TouchableOpacity style={styles.featuredCard}>
            <RnImageBackground
              source={{ uri: featuredEvents[0].imageUrl || 'https://images.unsplash.com/photo-1542834759-4091398f7739?auto=format&fit=crop&q=80&w=400' }}
              style={styles.featuredImage}
              imageStyle={{ borderRadius: Theme.roundness.xl }}
            >
              <View style={styles.featuredOverlay}>
                <View style={styles.featuredBadge}>
                   <Text style={styles.featuredBadgeText}>FEATURED</Text>
                </View>
                <Text style={styles.featuredTitle}>{featuredEvents[0].title}</Text>
                <View style={styles.featuredStats}>
                   <View style={styles.featuredStatItem}>
                      <Calendar size={14} color="#ffffff" />
                      <Text style={styles.featuredStatText}>{formatFullDate(featuredEvents[0].date)}</Text>
                   </View>
                   <View style={styles.featuredStatItem}>
                      <Clock size={14} color="#ffffff" />
                      <Text style={styles.featuredStatText}>{featuredEvents[0].time}</Text>
                   </View>
                </View>
              </View>
            </RnImageBackground>
          </TouchableOpacity>
        )}

        {/* --- Upcoming Events List --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Upcoming Events</Text>
        </View>

        {loading && events.length === 0 ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.eventList}>
             {events.map((event) => {
               const dateInfo = formatDate(event.eventDate || event.date);
               return (
                 <TouchableOpacity key={event.id} style={styles.eventCard}>
                    <View style={styles.eventDateBox}>
                       <Text style={styles.eventDateMonth}>{dateInfo.month}</Text>
                       <Text style={styles.eventDateDay}>{dateInfo.day}</Text>
                    </View>
                    <View style={styles.eventInfo}>
                       <Text style={styles.eventType}>{event.type?.toUpperCase() || 'EVENT'}</Text>
                       <Text style={styles.eventTitle}>{event.title}</Text>
                       <View style={styles.eventMeta}>
                          <View style={styles.metaItem}>
                             <Clock size={14} color={Theme.colors.onSurfaceVariant} />
                             <Text style={styles.metaText}>{formatTime(event.eventDate || event.date)}</Text>
                          </View>
                          <View style={styles.metaItem}>
                             <MapPin size={14} color={Theme.colors.onSurfaceVariant} />
                             <Text style={styles.metaText}>{event.location}</Text>
                          </View>
                          {event.attendeeCount && (
                            <View style={styles.metaItem}>
                               <Users size={14} color={Theme.colors.onSurfaceVariant} />
                               <Text style={styles.metaText}>{event.attendeeCount}</Text>
                            </View>
                          )}
                       </View>
                    </View>
                    <ChevronRight size={20} color={Theme.colors.outline} />
                 </TouchableOpacity>
               );
             })}
          </View>
        )}
      </ScrollView>

      {/* --- Floating Action Button --- */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={28} color={Theme.colors.onPrimary} />
      </TouchableOpacity>

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
  headerIcon: {
    padding: Theme.spacing.sm,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  featuredCard: {
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    height: 200,
    ...Theme.shadows.ambient,
  },
  featuredImage: {
    flex: 1,
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: Theme.roundness.xl,
    padding: Theme.spacing.lg,
    justifyContent: 'flex-end',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: Theme.spacing.sm,
  },
  featuredBadgeText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onTertiaryContainer,
    fontSize: 9,
  },
  featuredTitle: {
    ...Theme.typography.headlineMd,
    color: '#ffffff',
    fontSize: 22,
  },
  featuredStats: {
    flexDirection: 'row',
    marginTop: Theme.spacing.sm,
  },
  featuredStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  featuredStatText: {
    ...Theme.typography.labelSm,
    color: '#ffffff',
    marginLeft: 4,
  },
  sectionHeader: {
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.onSurface,
  },
  eventList: {
    paddingHorizontal: Theme.spacing.lg,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLowest,
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.ambient,
  },
  eventDateBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDateMonth: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
    fontSize: 10,
  },
  eventDateDay: {
    ...Theme.typography.headlineMd,
    fontSize: 22,
    color: Theme.colors.onSurface,
  },
  eventInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  eventType: {
    ...Theme.typography.labelSm,
    color: Theme.colors.tertiary,
    fontSize: 9,
    letterSpacing: 1,
  },
  eventTitle: {
    ...Theme.typography.titleMd,
    fontSize: 16,
    color: Theme.colors.onSurface,
    marginTop: 2,
  },
  eventMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  metaText: {
    ...Theme.typography.bodyMd,
    fontSize: 10,
    color: Theme.colors.onSurfaceVariant,
    marginLeft: 4,
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

export default EventsScreen;