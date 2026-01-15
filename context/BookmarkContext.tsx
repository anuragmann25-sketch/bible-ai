import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BibleVerse, getVerseId } from '../data/bibleData';

const BOOKMARKS_KEY = '@bible_ai_bookmarks';

interface BookmarkContextType {
  bookmarks: BibleVerse[];
  toggleBookmark: (verse: BibleVerse) => void;
  removeBookmark: (verse: BibleVerse) => void;
  isBookmarked: (verse: BibleVerse) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BibleVerse[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const saveBookmarks = async (newBookmarks: BibleVerse[]) => {
    try {
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const toggleBookmark = useCallback((verse: BibleVerse) => {
    setBookmarks(prev => {
      const verseId = getVerseId(verse);
      const exists = prev.some(v => getVerseId(v) === verseId);
      
      const newBookmarks = exists
        ? prev.filter(v => getVerseId(v) !== verseId)
        : [...prev, verse];
      
      saveBookmarks(newBookmarks);
      return newBookmarks;
    });
  }, []);

  const removeBookmark = useCallback((verse: BibleVerse) => {
    setBookmarks(prev => {
      const verseId = getVerseId(verse);
      const newBookmarks = prev.filter(v => getVerseId(v) !== verseId);
      saveBookmarks(newBookmarks);
      return newBookmarks;
    });
  }, []);

  const isBookmarked = useCallback((verse: BibleVerse) => {
    const verseId = getVerseId(verse);
    return bookmarks.some(v => getVerseId(v) === verseId);
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
