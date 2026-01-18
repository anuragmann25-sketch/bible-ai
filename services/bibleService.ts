import bibleData from '../data/kjv.json';
import { BibleVerse } from '../data/bibleData';

interface ChapterData {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

// The KJV JSON structure: { BookName: { ChapterNum: [ {v: verseNum, t: text}, ... ] } }
interface VerseEntry {
  v: number;
  t: string;
}

interface BibleJSON {
  [book: string]: {
    [chapter: string]: VerseEntry[];
  };
}

const typedBibleData = bibleData as BibleJSON;

export function getChapter(bookName: string, chapterNumber: number): ChapterData | null {
  const bookData = typedBibleData[bookName];
  if (!bookData) return null;

  const chapterData = bookData[chapterNumber.toString()];
  if (!chapterData || !Array.isArray(chapterData)) return null;

  const verses: BibleVerse[] = chapterData.map((entry: VerseEntry) => ({
    book: bookName,
    chapter: chapterNumber,
    verse: entry.v,
    text: entry.t,
  }));

  verses.sort((a, b) => a.verse - b.verse);

  return {
    book: bookName,
    chapter: chapterNumber,
    verses,
  };
}

export function searchVerses(query: string, limit: number = 50): BibleVerse[] {
  const results: BibleVerse[] = [];
  const lowerQuery = query.toLowerCase();

  for (const [bookName, chapters] of Object.entries(typedBibleData)) {
    for (const [chapterNum, verses] of Object.entries(chapters)) {
      if (!Array.isArray(verses)) continue;
      for (const entry of verses) {
        if (entry.t && entry.t.toLowerCase().includes(lowerQuery)) {
          results.push({
            book: bookName,
            chapter: parseInt(chapterNum, 10),
            verse: entry.v,
            text: entry.t,
          });
          if (results.length >= limit) return results;
        }
      }
    }
  }

  return results;
}
