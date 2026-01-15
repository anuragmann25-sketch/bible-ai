export interface BibleBook {
  name: string;
  testament: 'Old Testament' | 'New Testament';
  chapters: number;
  abbreviation: string;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament (39 books)
  { name: 'Genesis', testament: 'Old Testament', chapters: 50, abbreviation: 'Gen' },
  { name: 'Exodus', testament: 'Old Testament', chapters: 40, abbreviation: 'Exod' },
  { name: 'Leviticus', testament: 'Old Testament', chapters: 27, abbreviation: 'Lev' },
  { name: 'Numbers', testament: 'Old Testament', chapters: 36, abbreviation: 'Num' },
  { name: 'Deuteronomy', testament: 'Old Testament', chapters: 34, abbreviation: 'Deut' },
  { name: 'Joshua', testament: 'Old Testament', chapters: 24, abbreviation: 'Josh' },
  { name: 'Judges', testament: 'Old Testament', chapters: 21, abbreviation: 'Judg' },
  { name: 'Ruth', testament: 'Old Testament', chapters: 4, abbreviation: 'Ruth' },
  { name: '1 Samuel', testament: 'Old Testament', chapters: 31, abbreviation: '1Sam' },
  { name: '2 Samuel', testament: 'Old Testament', chapters: 24, abbreviation: '2Sam' },
  { name: '1 Kings', testament: 'Old Testament', chapters: 22, abbreviation: '1Kgs' },
  { name: '2 Kings', testament: 'Old Testament', chapters: 25, abbreviation: '2Kgs' },
  { name: '1 Chronicles', testament: 'Old Testament', chapters: 29, abbreviation: '1Chr' },
  { name: '2 Chronicles', testament: 'Old Testament', chapters: 36, abbreviation: '2Chr' },
  { name: 'Ezra', testament: 'Old Testament', chapters: 10, abbreviation: 'Ezra' },
  { name: 'Nehemiah', testament: 'Old Testament', chapters: 13, abbreviation: 'Neh' },
  { name: 'Esther', testament: 'Old Testament', chapters: 10, abbreviation: 'Esth' },
  { name: 'Job', testament: 'Old Testament', chapters: 42, abbreviation: 'Job' },
  { name: 'Psalms', testament: 'Old Testament', chapters: 150, abbreviation: 'Ps' },
  { name: 'Proverbs', testament: 'Old Testament', chapters: 31, abbreviation: 'Prov' },
  { name: 'Ecclesiastes', testament: 'Old Testament', chapters: 12, abbreviation: 'Eccl' },
  { name: 'Song of Solomon', testament: 'Old Testament', chapters: 8, abbreviation: 'Song' },
  { name: 'Isaiah', testament: 'Old Testament', chapters: 66, abbreviation: 'Isa' },
  { name: 'Jeremiah', testament: 'Old Testament', chapters: 52, abbreviation: 'Jer' },
  { name: 'Lamentations', testament: 'Old Testament', chapters: 5, abbreviation: 'Lam' },
  { name: 'Ezekiel', testament: 'Old Testament', chapters: 48, abbreviation: 'Ezek' },
  { name: 'Daniel', testament: 'Old Testament', chapters: 12, abbreviation: 'Dan' },
  { name: 'Hosea', testament: 'Old Testament', chapters: 14, abbreviation: 'Hos' },
  { name: 'Joel', testament: 'Old Testament', chapters: 3, abbreviation: 'Joel' },
  { name: 'Amos', testament: 'Old Testament', chapters: 9, abbreviation: 'Amos' },
  { name: 'Obadiah', testament: 'Old Testament', chapters: 1, abbreviation: 'Obad' },
  { name: 'Jonah', testament: 'Old Testament', chapters: 4, abbreviation: 'Jonah' },
  { name: 'Micah', testament: 'Old Testament', chapters: 7, abbreviation: 'Mic' },
  { name: 'Nahum', testament: 'Old Testament', chapters: 3, abbreviation: 'Nah' },
  { name: 'Habakkuk', testament: 'Old Testament', chapters: 3, abbreviation: 'Hab' },
  { name: 'Zephaniah', testament: 'Old Testament', chapters: 3, abbreviation: 'Zeph' },
  { name: 'Haggai', testament: 'Old Testament', chapters: 2, abbreviation: 'Hag' },
  { name: 'Zechariah', testament: 'Old Testament', chapters: 14, abbreviation: 'Zech' },
  { name: 'Malachi', testament: 'Old Testament', chapters: 4, abbreviation: 'Mal' },
  // New Testament (27 books)
  { name: 'Matthew', testament: 'New Testament', chapters: 28, abbreviation: 'Matt' },
  { name: 'Mark', testament: 'New Testament', chapters: 16, abbreviation: 'Mark' },
  { name: 'Luke', testament: 'New Testament', chapters: 24, abbreviation: 'Luke' },
  { name: 'John', testament: 'New Testament', chapters: 21, abbreviation: 'John' },
  { name: 'Acts', testament: 'New Testament', chapters: 28, abbreviation: 'Acts' },
  { name: 'Romans', testament: 'New Testament', chapters: 16, abbreviation: 'Rom' },
  { name: '1 Corinthians', testament: 'New Testament', chapters: 16, abbreviation: '1Cor' },
  { name: '2 Corinthians', testament: 'New Testament', chapters: 13, abbreviation: '2Cor' },
  { name: 'Galatians', testament: 'New Testament', chapters: 6, abbreviation: 'Gal' },
  { name: 'Ephesians', testament: 'New Testament', chapters: 6, abbreviation: 'Eph' },
  { name: 'Philippians', testament: 'New Testament', chapters: 4, abbreviation: 'Phil' },
  { name: 'Colossians', testament: 'New Testament', chapters: 4, abbreviation: 'Col' },
  { name: '1 Thessalonians', testament: 'New Testament', chapters: 5, abbreviation: '1Thess' },
  { name: '2 Thessalonians', testament: 'New Testament', chapters: 3, abbreviation: '2Thess' },
  { name: '1 Timothy', testament: 'New Testament', chapters: 6, abbreviation: '1Tim' },
  { name: '2 Timothy', testament: 'New Testament', chapters: 4, abbreviation: '2Tim' },
  { name: 'Titus', testament: 'New Testament', chapters: 3, abbreviation: 'Titus' },
  { name: 'Philemon', testament: 'New Testament', chapters: 1, abbreviation: 'Phlm' },
  { name: 'Hebrews', testament: 'New Testament', chapters: 13, abbreviation: 'Heb' },
  { name: 'James', testament: 'New Testament', chapters: 5, abbreviation: 'Jas' },
  { name: '1 Peter', testament: 'New Testament', chapters: 5, abbreviation: '1Pet' },
  { name: '2 Peter', testament: 'New Testament', chapters: 3, abbreviation: '2Pet' },
  { name: '1 John', testament: 'New Testament', chapters: 5, abbreviation: '1John' },
  { name: '2 John', testament: 'New Testament', chapters: 1, abbreviation: '2John' },
  { name: '3 John', testament: 'New Testament', chapters: 1, abbreviation: '3John' },
  { name: 'Jude', testament: 'New Testament', chapters: 1, abbreviation: 'Jude' },
  { name: 'Revelation', testament: 'New Testament', chapters: 22, abbreviation: 'Rev' },
];

export function getVerseReference(verse: BibleVerse): string {
  return `${verse.book} ${verse.chapter}:${verse.verse}`;
}

export function getVerseId(verse: BibleVerse): string {
  return `${verse.book}-${verse.chapter}-${verse.verse}`;
}

export function parseVerseId(id: string): { book: string; chapter: number; verse: number } | null {
  const parts = id.split('-');
  if (parts.length < 3) return null;
  
  const verse = parseInt(parts.pop()!, 10);
  const chapter = parseInt(parts.pop()!, 10);
  const book = parts.join('-');
  
  return { book, chapter, verse };
}

// Featured verses for home screen
export const FEATURED_VERSES: BibleVerse[] = [
  { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.' },
  { book: 'Jeremiah', chapter: 29, verse: 11, text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.' },
  { book: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
  { book: 'Isaiah', chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
  { book: 'Romans', chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
  { book: 'Psalm', chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
  { book: 'Matthew', chapter: 11, verse: 28, text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
  { book: 'Joshua', chapter: 1, verse: 9, text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.' },
  { book: 'Psalm', chapter: 46, verse: 10, text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.' },
  { book: 'John', chapter: 14, verse: 6, text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.' },
  { book: 'Romans', chapter: 12, verse: 2, text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.' },
];
