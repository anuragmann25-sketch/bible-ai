import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useBookmarks } from '../../context/BookmarkContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { BibleVerse, getVerseReference } from '../../data/bibleData';

function BookmarkCard({ verse, onRemove, onPress }: { verse: BibleVerse; onRemove: () => void; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.bookmarkCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.bookmarkContent}>
        <Text style={styles.bookmarkReference}>{getVerseReference(verse)}</Text>
        <Text style={styles.bookmarkText} numberOfLines={3}>{verse.text}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={22} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { resetOnboarding } = useOnboarding();
  const router = useRouter();

  const handleRemoveBookmark = (verse: BibleVerse) => {
    Alert.alert('Remove Bookmark', `Remove ${getVerseReference(verse)} from bookmarks?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeBookmark(verse) },
    ]);
  };

  const handleVersePress = (verse: BibleVerse) => {
    router.push({
      pathname: '/(tabs)/bible',
      params: {
        book: verse.book,
        chapter: verse.chapter.toString(),
        verse: verse.verse.toString(),
      },
    });
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding flow again on next app restart.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetOnboarding();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={48} color={Colors.white} />
          </View>
          <Text style={styles.userName}>Blessed User</Text>
          <Text style={styles.userSubtitle}>Walking in faith</Text>
        </View>

        <View style={styles.bookmarksSection}>
          <Text style={styles.sectionTitle}>Bookmarked Verses</Text>

          {bookmarks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No bookmarks yet</Text>
              <Text style={styles.emptyStateSubtext}>Save verses from the Bible tab</Text>
            </View>
          ) : (
            <View>
              {bookmarks.map((item) => (
                <BookmarkCard
                  key={`${item.book}-${item.chapter}-${item.verse}`}
                  verse={item}
                  onRemove={() => handleRemoveBookmark(item)}
                  onPress={() => handleVersePress(item)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleResetOnboarding}>
            <Ionicons name="refresh-outline" size={22} color={Colors.text} />
            <Text style={styles.settingsButtonText}>Restart Onboarding</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.selectedCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  bookmarksSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.unselectedCard,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  settingsButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  bookmarkCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  bookmarkContent: {
    flex: 1,
  },
  bookmarkReference: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  bookmarkText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
