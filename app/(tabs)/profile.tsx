import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useBookmarks } from '../../context/BookmarkContext';
import { BibleVerse, getVerseReference } from '../../data/bibleData';

function BookmarkCard({ verse, onRemove }: { verse: BibleVerse; onRemove: () => void }) {
  return (
    <View style={styles.bookmarkCard}>
      <View style={styles.bookmarkContent}>
        <Text style={styles.bookmarkReference}>{getVerseReference(verse)}</Text>
        <Text style={styles.bookmarkText} numberOfLines={3}>{verse.text}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={22} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );
}

export default function ProfileScreen() {
  const { bookmarks, removeBookmark } = useBookmarks();

  const handleRemoveBookmark = (verse: BibleVerse) => {
    Alert.alert('Remove Bookmark', `Remove ${getVerseReference(verse)} from bookmarks?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeBookmark(verse) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-outline" size={48} color={Colors.white} />
        </View>
        <Text style={styles.userName}>Blessed User</Text>
        <Text style={styles.userSubtitle}>Walking in faith</Text>
      </View>

      {/* Bookmarks Section */}
      <View style={styles.bookmarksSection}>
        <Text style={styles.sectionTitle}>Bookmarked Verses</Text>

        {bookmarks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No bookmarks yet</Text>
            <Text style={styles.emptyStateSubtext}>Save verses from the Bible tab</Text>
          </View>
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => `${item.book}-${item.chapter}-${item.verse}`}
            renderItem={({ item }) => (
              <BookmarkCard verse={item} onRemove={() => handleRemoveBookmark(item)} />
            )}
            contentContainerStyle={styles.bookmarksList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
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
    backgroundColor: Colors.primary,
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
  bookmarksList: {
    paddingBottom: 100,
  },
  bookmarkCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
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
    color: Colors.primary,
    marginBottom: 8,
  },
  bookmarkText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
