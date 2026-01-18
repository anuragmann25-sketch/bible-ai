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

// Featured short verses for home screen
export const FEATURED_VERSES: BibleVerse[] = [
  { book: 'Psalms', chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
  { book: 'Psalms', chapter: 46, verse: 10, text: 'Be still, and know that I am God.' },
  { book: 'Psalms', chapter: 27, verse: 1, text: 'The LORD is my light and my salvation; whom shall I fear?' },
  { book: 'Psalms', chapter: 118, verse: 24, text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.' },
  { book: 'Psalms', chapter: 34, verse: 8, text: 'O taste and see that the LORD is good.' },
  { book: 'Psalms', chapter: 119, verse: 105, text: 'Thy word is a lamp unto my feet, and a light unto my path.' },
  { book: 'Psalms', chapter: 37, verse: 4, text: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.' },
  { book: 'Psalms', chapter: 56, verse: 3, text: 'What time I am afraid, I will trust in thee.' },
  { book: 'Psalms', chapter: 139, verse: 14, text: 'I am fearfully and wonderfully made.' },
  { book: 'Psalms', chapter: 16, verse: 8, text: 'I have set the LORD always before me.' },
  { book: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart.' },
  { book: 'Proverbs', chapter: 16, verse: 3, text: 'Commit thy works unto the LORD, and thy thoughts shall be established.' },
  { book: 'Proverbs', chapter: 18, verse: 10, text: 'The name of the LORD is a strong tower: the righteous runneth into it, and is safe.' },
  { book: 'Proverbs', chapter: 3, verse: 6, text: 'In all thy ways acknowledge him, and he shall direct thy paths.' },
  { book: 'Isaiah', chapter: 40, verse: 31, text: 'They that wait upon the LORD shall renew their strength.' },
  { book: 'Isaiah', chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee.' },
  { book: 'Isaiah', chapter: 26, verse: 3, text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee.' },
  { book: 'Matthew', chapter: 11, verse: 28, text: 'Come unto me, all ye that labour, and I will give you rest.' },
  { book: 'Matthew', chapter: 6, verse: 33, text: 'Seek ye first the kingdom of God, and his righteousness.' },
  { book: 'Matthew', chapter: 5, verse: 14, text: 'Ye are the light of the world.' },
  { book: 'John', chapter: 14, verse: 27, text: 'Peace I leave with you, my peace I give unto you.' },
  { book: 'John', chapter: 8, verse: 12, text: 'I am the light of the world.' },
  { book: 'John', chapter: 14, verse: 6, text: 'I am the way, the truth, and the life.' },
  { book: 'John', chapter: 16, verse: 33, text: 'Be of good cheer; I have overcome the world.' },
  { book: 'John', chapter: 8, verse: 32, text: 'The truth shall make you free.' },
  { book: 'Romans', chapter: 8, verse: 28, text: 'All things work together for good to them that love God.' },
  { book: 'Romans', chapter: 8, verse: 31, text: 'If God be for us, who can be against us?' },
  { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.' },
  { book: 'Philippians', chapter: 4, verse: 7, text: 'The peace of God shall keep your hearts and minds.' },
  { book: 'Philippians', chapter: 4, verse: 4, text: 'Rejoice in the Lord always: and again I say, Rejoice.' },
  { book: 'Hebrews', chapter: 11, verse: 1, text: 'Faith is the substance of things hoped for.' },
  { book: 'Hebrews', chapter: 13, verse: 5, text: 'I will never leave thee, nor forsake thee.' },
  { book: 'James', chapter: 1, verse: 5, text: 'If any of you lack wisdom, let him ask of God.' },
  { book: '1 Peter', chapter: 5, verse: 7, text: 'Casting all your care upon him; for he careth for you.' },
  { book: '1 John', chapter: 4, verse: 8, text: 'God is love.' },
  { book: '1 John', chapter: 4, verse: 18, text: 'Perfect love casteth out fear.' },
  { book: '2 Corinthians', chapter: 5, verse: 7, text: 'We walk by faith, not by sight.' },
  { book: '2 Corinthians', chapter: 12, verse: 9, text: 'My grace is sufficient for thee.' },
  { book: 'Galatians', chapter: 5, verse: 22, text: 'The fruit of the Spirit is love, joy, peace.' },
  { book: 'Jeremiah', chapter: 29, verse: 11, text: 'I know the plans I have for you, saith the LORD, plans for peace.' },
  { book: 'Lamentations', chapter: 3, verse: 23, text: 'Great is thy faithfulness.' },
  { book: 'Joshua', chapter: 1, verse: 9, text: 'Be strong and of a good courage.' },
  { book: 'Micah', chapter: 6, verse: 8, text: 'Walk humbly with thy God.' },
];
