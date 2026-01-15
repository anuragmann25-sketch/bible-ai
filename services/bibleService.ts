import { BibleBook, BibleVerse, BIBLE_BOOKS, FEATURED_VERSES } from '../data/bibleData';

// Lazy-loaded Bible data
let bibleData: Record<string, Record<string, Array<{ v: number; t: string }>>> | null = null;

async function loadBibleData() {
  if (!bibleData) {
    bibleData = require('../data/kjv.json');
  }
  return bibleData;
}

export function getBooks(): BibleBook[] {
  return BIBLE_BOOKS;
}

export function getBookByName(name: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(b => b.name.toLowerCase() === name.toLowerCase());
}

export interface ChapterData {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export function getChapter(bookName: string, chapter: number): ChapterData | null {
  try {
    const data = require('../data/kjv.json');
    const bookData = data[bookName];
    
    if (!bookData) return null;
    
    const chapterData = bookData[chapter.toString()];
    if (!chapterData) return null;
    
    const verses: BibleVerse[] = chapterData.map((v: { v: number; t: string }) => ({
      book: bookName,
      chapter,
      verse: v.v,
      text: v.t,
    }));
    
    return { book: bookName, chapter, verses };
  } catch (error) {
    console.error('Error loading chapter:', error);
    return null;
  }
}

export function getVerse(bookName: string, chapter: number, verse: number): BibleVerse | null {
  const chapterData = getChapter(bookName, chapter);
  if (!chapterData) return null;
  
  return chapterData.verses.find(v => v.verse === verse) || null;
}

export function getRandomVerse(): BibleVerse {
  const randomIndex = Math.floor(Math.random() * FEATURED_VERSES.length);
  return FEATURED_VERSES[randomIndex];
}

export function searchVerses(query: string, limit: number = 50): BibleVerse[] {
  if (!query.trim()) return [];
  
  const results: BibleVerse[] = [];
  const searchLower = query.toLowerCase();
  
  try {
    const data = require('../data/kjv.json');
    
    for (const bookName of Object.keys(data)) {
      if (results.length >= limit) break;
      
      const book = data[bookName];
      for (const chapterNum of Object.keys(book)) {
        if (results.length >= limit) break;
        
        const chapter = book[chapterNum];
        for (const verse of chapter) {
          if (results.length >= limit) break;
          
          if (verse.t.toLowerCase().includes(searchLower)) {
            results.push({
              book: bookName,
              chapter: parseInt(chapterNum, 10),
              verse: verse.v,
              text: verse.t,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error searching verses:', error);
  }
  
  return results;
}
