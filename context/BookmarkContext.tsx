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
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Normalize bookmark data - handle old format with v/t keys
            const normalizedBookmarks: BibleVerse[] = parsed.map((item: any) => {
              // If the item uses old format (v, t), convert to new format (verse, text)
              if (item.v !== undefined && item.t !== undefined) {
                return {
                  book: item.book || item.b || '',
                  chapter: item.chapter || item.c || 1,
                  verse: item.v,
                  text: item.t,
                };
              }
              // Already in correct format
              return {
                book: item.book || '',
                chapter: item.chapter || 1,
                verse: item.verse || 1,
                text: item.text || '',
              };
            }).filter((v: BibleVerse) => v.book && v.text); // Filter out invalid entries
            
            setBookmarks(normalizedBookmarks);
            
            // Save normalized data back to storage
            if (JSON.stringify(parsed) !== JSON.stringify(normalizedBookmarks)) {
              await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(normalizedBookmarks));
            }
          }
        } catch (parseError) {
          console.error('Corrupted bookmark data, resetting:', parseError);
          await AsyncStorage.removeItem(BOOKMARKS_KEY);
        }
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
