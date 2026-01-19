import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { BIBLE_BOOKS, BibleBook, BibleVerse } from '../../data/bibleData';
import { getChapter } from '../../services/bibleService';
import { useBookmarks } from '../../context/BookmarkContext';

const { width } = Dimensions.get('window');
const GRID_COLUMNS = 6;
const GRID_PADDING = 20;
const GRID_GAP = 10;
const CELL_SIZE = (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

type ViewState =
  | { type: 'books'; filter: 'all' | 'old' | 'new' }
  | { type: 'chapters'; book: BibleBook }
  | { type: 'verses'; book: BibleBook; chapter: number; highlightVerse?: number };

const BOOK_PREVIEWS: Record<string, string> = {
  'Genesis': 'In the beginning God created the heavens and the earth...',
  'Exodus': 'These are the names of the sons of Israel who went to Egypt...',
  'Matthew': 'This is the genealogy of Jesus the Messiah...',
  'John': 'In the beginning was the Word, and the Word was with God...',
  'Psalms': 'Blessed is the one who does not walk in step with the wicked...',
  'Proverbs': 'The proverbs of Solomon son of David, king of Israel...',
};

function BookCard({ book, onPress, index }: { book: BibleBook; onPress: () => void; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = Math.min(index * 50, 400);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
    ]).start();
  }, []);

  const preview = BOOK_PREVIEWS[book.name] || `The book of ${book.name}...`;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity style={styles.bookCard} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.bookIconContainer}>
          <Ionicons name="book-outline" size={28} color={Colors.text} />
        </View>
        <View style={styles.bookInfo}>
          <View style={styles.bookHeader}>
            <Text style={styles.bookName}>{book.name}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </View>
          <Text style={styles.bookMeta}>{book.testament} • {book.chapters} Chapters</Text>
          <Text style={styles.bookPreview} numberOfLines={2}>{preview}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ChapterCell({ chapter, onPress, index }: { chapter: number; onPress: () => void; index: number }) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = Math.min(index * 15, 300);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, delay, useNativeDriver: true, tension: 50, friction: 7 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={[styles.chapterCell, { width: CELL_SIZE, height: CELL_SIZE }]} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.chapterNumber}>{chapter}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function VerseCard({ verse, index, isHighlighted }: { verse: BibleVerse; index: number; isHighlighted?: boolean }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;
  const [showHighlight, setShowHighlight] = useState(isHighlighted);
  const bookmarked = isBookmarked(verse);

  useEffect(() => {
    const delay = Math.min(index * 40, 350);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, delay, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(slideAnim, { toValue: 0, duration: 380, delay, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isHighlighted) {
      setShowHighlight(true);
      const timer = setTimeout(() => {
        setShowHighlight(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  return (
    <Animated.View style={[
      styles.verseCard,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      showHighlight && styles.verseCardHighlighted,
    ]}>
      <View style={styles.verseNumberContainer}>
        <Text style={styles.verseNumber}>{verse.verse}</Text>
      </View>
      <Text style={styles.verseText}>{verse.text}</Text>
      <TouchableOpacity style={styles.bookmarkButton} onPress={() => toggleBookmark(verse)}>
        <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={bookmarked ? Colors.text : Colors.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function FilterButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.filterButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function BooksListScreen({ filter, searchQuery, setSearchQuery, setFilter, onSelectBook }: {
  filter: 'all' | 'old' | 'new'; searchQuery: string; setSearchQuery: (q: string) => void;
  setFilter: (f: 'all' | 'old' | 'new') => void; onSelectBook: (book: BibleBook) => void;
}) {
  const filteredBooks = useMemo(() => {
    let books = BIBLE_BOOKS;
    if (filter === 'old') books = books.filter((b) => b.testament === 'Old Testament');
    if (filter === 'new') books = books.filter((b) => b.testament === 'New Testament');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      books = books.filter((b) => b.name.toLowerCase().includes(q));
    }
    return books;
  }, [filter, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.listHeader}>
        <Text style={styles.headerTitle}>Holy Bible</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
        <View style={styles.filterContainer}>
          <FilterButton label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterButton label="Old Testament" active={filter === 'old'} onPress={() => setFilter('old')} />
          <FilterButton label="New Testament" active={filter === 'new'} onPress={() => setFilter('new')} />
        </View>
      </View>
      <FlatList
        key={`${filter}-${searchQuery}`}
        data={filteredBooks}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => <BookCard book={item} onPress={() => onSelectBook(item)} index={index} />}
        contentContainerStyle={styles.bookListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No books found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function ChaptersGridScreen({ book, onBack, onSelectChapter }: { book: BibleBook; onBack: () => void; onSelectChapter: (chapter: number) => void }) {
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
  const renderRow = ({ item: rowIndex }: { item: number }) => {
    const startIndex = rowIndex * GRID_COLUMNS;
    const rowChapters = chapters.slice(startIndex, startIndex + GRID_COLUMNS);
    return (
      <View style={styles.chapterRow}>
        {rowChapters.map((chapter, idx) => <ChapterCell key={chapter} chapter={chapter} onPress={() => onSelectChapter(chapter)} index={startIndex + idx} />)}
      </View>
    );
  };
  const rowCount = Math.ceil(chapters.length / GRID_COLUMNS);
  const rowIndices = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.chapterHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
          <Text style={styles.backText}>Books</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{book.name}</Text>
        <Text style={styles.headerSubtitle}>{book.chapters} chapters</Text>
      </View>
      <FlatList data={rowIndices} keyExtractor={(item) => item.toString()} renderItem={renderRow}
        contentContainerStyle={styles.chapterListContent} showsVerticalScrollIndicator={false} />
    </SafeAreaView>
  );
}

function VersesListScreen({ book, chapter, onBack, highlightVerse }: { book: BibleBook; chapter: number; onBack: () => void; highlightVerse?: number }) {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const chapterData = getChapter(book.name, chapter);
    if (chapterData) setVerses(chapterData.verses);
  }, [book.name, chapter]);

  useEffect(() => {
    if (highlightVerse && verses.length > 0 && flatListRef.current) {
      const verseIndex = verses.findIndex((v) => v.verse === highlightVerse);
      if (verseIndex >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: verseIndex,
            animated: true,
            viewPosition: 0.3,
          });
        }, 500);
      }
    }
  }, [highlightVerse, verses]);

  const handleScrollToIndexFailed = (info: { index: number }) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.chapterHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
          <Text style={styles.backText}>{book.name}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chapter {chapter}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={verses}
        keyExtractor={(item) => `${item.book}-${item.chapter}-${item.verse}`}
        renderItem={({ item, index }) => (
          <VerseCard verse={item} index={index} isHighlighted={highlightVerse === item.verse} />
        )}
        contentContainerStyle={styles.verseListContent}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </SafeAreaView>
  );
}

export default function BibleScreen() {
  const params = useLocalSearchParams<{ book?: string; chapter?: string; verse?: string }>();
  const [viewState, setViewState] = useState<ViewState>({ type: 'books', filter: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [processedParams, setProcessedParams] = useState(false);

  useEffect(() => {
    if (params.book && params.chapter && !processedParams) {
      const bookName = params.book;
      const chapterNum = parseInt(params.chapter, 10);
      const verseNum = params.verse ? parseInt(params.verse, 10) : undefined;

      const book = BIBLE_BOOKS.find((b) => b.name === bookName);
      if (book && chapterNum) {
        setViewState({
          type: 'verses',
          book,
          chapter: chapterNum,
          highlightVerse: verseNum,
        });
        setProcessedParams(true);
      }
    }
  }, [params.book, params.chapter, params.verse, processedParams]);

  useEffect(() => {
    if (params.book && params.chapter) {
      setProcessedParams(false);
    }
  }, [params.book, params.chapter, params.verse]);

  const handleSelectBook = useCallback((book: BibleBook) => setViewState({ type: 'chapters', book }), []);
  const handleSelectChapter = useCallback((chapter: number) => {
    if (viewState.type === 'chapters') setViewState({ type: 'verses', book: viewState.book, chapter });
  }, [viewState]);
  const handleBackFromChapters = useCallback(() => setViewState({ type: 'books', filter: 'all' }), []);
  const handleBackFromVerses = useCallback(() => {
    if (viewState.type === 'verses') setViewState({ type: 'chapters', book: viewState.book });
  }, [viewState]);
  const handleSetFilter = useCallback((filter: 'all' | 'old' | 'new') => setViewState({ type: 'books', filter }), []);

  if (viewState.type === 'books') {
    return <BooksListScreen filter={viewState.filter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setFilter={handleSetFilter} onSelectBook={handleSelectBook} />;
  }
  if (viewState.type === 'chapters') {
    return <ChaptersGridScreen book={viewState.book} onBack={handleBackFromChapters} onSelectChapter={handleSelectChapter} />;
  }
  if (viewState.type === 'verses') {
    return <VersesListScreen book={viewState.book} chapter={viewState.chapter} onBack={handleBackFromVerses} highlightVerse={viewState.highlightVerse} />;
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  chapterHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: -16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  backText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.unselectedCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: Colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.unselectedCard,
  },
  filterButtonActive: {
    backgroundColor: Colors.selectedCard,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  bookListContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  chapterListContent: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: 100,
  },
  chapterRow: {
    flexDirection: 'row',
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  verseListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    gap: 16,
  },
  bookIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.unselectedCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  bookMeta: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  bookPreview: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 22,
  },
  chapterCell: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  verseCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
  },
  verseCardHighlighted: {
    backgroundColor: Colors.unselectedCard,
    borderColor: Colors.text,
  },
  verseNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.unselectedCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    color: Colors.text,
    lineHeight: 26,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
