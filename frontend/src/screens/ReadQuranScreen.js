import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated
} from 'react-native';
import { ChevronLeft, Play, Square, Settings2, Globe, Volume2, BookOpen } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Theme } from '../theme/Theme';
import BottomNav from '../components/BottomNav';
import LogoSmall from '../components/LogoSmall';

const ReadQuranScreen = ({ isAuthenticated = false, navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);

  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);

  const [translationLanguage, setTranslationLanguage] = useState('bn'); // 'bn' or 'en'
  const [showLanguageToggle, setShowLanguageToggle] = useState(false);

  const [playingAyahId, setPlayingAyahId] = useState(null);
  const soundRef = useRef(null);

  // Fetch Surahs list
  useEffect(() => {
    fetchSurahs();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const json = await response.json();
      if (json.code === 200) {
        setSurahs(json.data);
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
    } finally {
      setLoadingSurahs(false);
    }
  };

  const loadSurah = async (surahNumber, surahDetails) => {
    setSelectedSurah(surahDetails);
    setLoadingAyahs(true);
    setAyahs([]);
    stopAudio();

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,bn.bengali,en.asad,ar.alafasy`);
      const json = await response.json();
      
      if (json.code === 200) {
        const arabicData = json.data[0].ayahs;
        const bnData = json.data[1].ayahs;
        const enData = json.data[2].ayahs;
        const audioData = json.data[3].ayahs;

        const combinedAyahs = arabicData.map((ayah, index) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          arabicText: ayah.text,
          bnTranslation: bnData[index].text,
          enTranslation: enData[index].text,
          audioUrl: audioData[index].audio,
        }));
        
        setAyahs(combinedAyahs);
      }
    } catch (error) {
      console.error('Error loading surah details:', error);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const playAudio = async (audioUrl, ayahNumberInSurah) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      
      if (playingAyahId === ayahNumberInSurah) {
        setPlayingAyahId(null);
        return; // act as stop
      }

      setPlayingAyahId(ayahNumberInSurah);

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingAyahId(null);
        }
      });
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAyahId(null);
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {}
      soundRef.current = null;
    }
    setPlayingAyahId(null);
  };

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.surahCard}
      onPress={() => loadSurah(item.number, item)}
    >
      <View style={styles.surahNumberContainer}>
        <Text style={styles.surahNumber}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahEnglishName}>{item.englishName}</Text>
        <Text style={styles.surahDetails}>{item.revelationType} • {item.numberOfAyahs} Verses</Text>
      </View>
      <Text style={styles.surahArabicName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderAyahItem = ({ item }) => {
    const isPlaying = playingAyahId === item.numberInSurah;
    const translation = translationLanguage === 'bn' ? item.bnTranslation : item.enTranslation;

    return (
      <View style={[styles.ayahCard, isPlaying && styles.ayahCardPlaying]}>
        <View style={styles.ayahHeader}>
          <View style={styles.ayahNumberBadge}>
            <Text style={styles.ayahNumberText}>{item.numberInSurah}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.playButton, isPlaying && styles.stopButton]}
            onPress={() => playAudio(item.audioUrl, item.numberInSurah)}
          >
            {isPlaying ? (
              <Square size={16} color={Theme.colors.surface} fill={Theme.colors.surface} />
            ) : (
              <Play size={16} color={Theme.colors.primary} fill={Theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.arabicText}>{item.arabicText}</Text>
        <Text style={styles.translationText}>{translation}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {selectedSurah ? (
          <TouchableOpacity style={styles.backButton} onPress={() => { setSelectedSurah(null); stopAudio(); }}>
            <ChevronLeft size={24} color={Theme.colors.onSurface} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={Theme.colors.onSurface} />
          </TouchableOpacity>
        )}
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {selectedSurah ? selectedSurah.englishName : 'Holy Quran'}
          </Text>
          {selectedSurah && (
             <Text style={styles.headerSubtitle}>{selectedSurah.name}</Text>
          )}
        </View>

        {selectedSurah ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.langButton}
              onPress={() => setTranslationLanguage(prev => prev === 'bn' ? 'en' : 'bn')}
            >
              <Globe size={20} color={Theme.colors.primary} />
              <Text style={styles.langText}>{translationLanguage.toUpperCase()}</Text>
            </TouchableOpacity>
            <LogoSmall style={{ marginLeft: 12 }} />
          </View>
        ) : (
          <LogoSmall style={{ marginLeft: 12 }} />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!selectedSurah ? (
          // Surah List
          loadingSurahs ? (
            <ActivityIndicator size="large" color={Theme.colors.primary} style={styles.loader} />
          ) : (
            <FlatList
              data={surahs}
              keyExtractor={(item) => item.number.toString()}
              renderItem={renderSurahItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )
        ) : (
          // Ayahs List
          loadingAyahs ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Theme.colors.primary} />
              <Text style={styles.loadingText}>Loading Ayahs...</Text>
            </View>
          ) : (
            <FlatList
              data={ayahs}
              keyExtractor={(item) => item.number.toString()}
              renderItem={renderAyahItem}
              contentContainerStyle={styles.ayahListContainer}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.bismillahContainer}>
                  <Text style={styles.bismillahText}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</Text>
                </View>
              }
            />
          )
        )}
      </View>

      {!selectedSurah && <BottomNav isAuthenticated={isAuthenticated} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.onSurface,
  },
  headerSubtitle: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
    marginTop: 2,
    fontSize: 16,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceContainerLow,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: Theme.roundness.full,
  },
  langText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.primary,
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: Theme.spacing.xxl,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.onSurfaceVariant,
    marginTop: Theme.spacing.md,
  },
  listContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxl,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.surfaceContainerHigh,
  },
  surahNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  surahNumber: {
    ...Theme.typography.labelMd,
    color: Theme.colors.onSurfaceVariant,
  },
  surahInfo: {
    flex: 1,
  },
  surahEnglishName: {
    ...Theme.typography.titleMd,
    color: Theme.colors.onSurface,
  },
  surahDetails: {
    ...Theme.typography.bodySm,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  surahArabicName: {
    ...Theme.typography.titleLg,
    color: Theme.colors.primary,
    fontSize: 22,
  },
  ayahListContainer: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  bismillahContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.xl,
    paddingVertical: Theme.spacing.lg,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.lg,
    ...Theme.shadows.ambient,
  },
  bismillahText: {
    fontSize: 28,
    color: Theme.colors.onSurface,
    textAlign: 'center',
  },
  ayahCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.ambient,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ayahCardPlaying: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(76, 111, 163, 0.05)',
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  ayahNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahNumberText: {
    ...Theme.typography.labelSm,
    color: Theme.colors.onSurface,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: Theme.colors.primary,
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 40,
    color: Theme.colors.onSurface,
    textAlign: 'right',
    marginBottom: Theme.spacing.md,
  },
  translationText: {
    ...Theme.typography.bodyLg,
    color: Theme.colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: 'left',
  },
});

export default ReadQuranScreen;
