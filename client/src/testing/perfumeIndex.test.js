/**
 * White Box Tests — perfumeIndex.js
 * Tests the HashMap data structure and O(1) lookups
 * Run with: npm test
 */

import { buildPerfumeIndexes, getPerfumesByAttribute } from '../utils/perfumeIndex.js';

const mockPerfumes = [
  {
    id: 1, name: 'Floral Rose', brand: 'BrandA',
    category: 'Floral', gender: 'Female', priceTier: 'Mid',
    mbtiTypes: ['INFP', 'ENFP'],
    personalityTags: ['romantic', 'gentle'],
    notes: { top: ['Rose'], middle: ['Jasmine'], base: ['Sandalwood'] },
    occasion: ['Daily', 'Evening'], season: ['Spring']
  },
  {
    id: 2, name: 'Fresh Citrus', brand: 'BrandB',
    category: 'Fresh', gender: 'Male', priceTier: 'Luxury',
    mbtiTypes: ['ESTJ', 'ENTJ'],
    personalityTags: ['confident', 'decisive'],
    notes: { top: ['Bergamot', 'Lemon'], middle: ['Cedar'], base: ['Musk'] },
    occasion: ['Work', 'Daily'], season: ['Summer']
  },
  {
    id: 3, name: 'Woody Oud', brand: 'BrandA',
    category: 'Woody', gender: 'Unisex', priceTier: 'Luxury',
    mbtiTypes: ['INTJ', 'INFP'],
    personalityTags: ['mysterious', 'deep'],
    notes: { top: ['Oud'], middle: ['Amber'], base: ['Incense'] },
    occasion: ['Evening'], season: ['Autumn', 'Winter']
  }
];

describe('WB1-WB4: buildPerfumeIndexes — HashMap Construction', () => {

  let indexes;

  beforeEach(() => {
    indexes = buildPerfumeIndexes(mockPerfumes);
  });

  test('WB1 — Builds index with all required maps', () => {
    expect(indexes).toHaveProperty('byId');
    expect(indexes).toHaveProperty('byCategory');
    expect(indexes).toHaveProperty('byMbti');
    expect(indexes).toHaveProperty('byGender');
    expect(indexes).toHaveProperty('byNote');
  });

  test('WB2 — byId lookup returns correct perfume', () => {
    const perfume = indexes.byId.get(1);
    expect(perfume.name).toBe('Floral Rose');
  });

  test('WB3 — byCategory returns all perfumes in Floral category', () => {
    const floralPerfumes = getPerfumesByAttribute(indexes, 'byCategory', 'Floral');
    expect(floralPerfumes).toHaveLength(1);
    expect(floralPerfumes[0].name).toBe('Floral Rose');
  });

  test('WB4 — byMbti returns all perfumes tagged for INFP', () => {
    const infpPerfumes = getPerfumesByAttribute(indexes, 'byMbti', 'INFP');
    expect(infpPerfumes).toHaveLength(2);
  });

});

describe('WB5-WB7: getPerfumesByAttribute — Lookup Tests', () => {

  let indexes;

  beforeEach(() => {
    indexes = buildPerfumeIndexes(mockPerfumes);
  });

  test('WB5 — Lookup by gender returns correct perfumes', () => {
    const malePerfumes = getPerfumesByAttribute(indexes, 'byGender', 'Male');
    expect(malePerfumes).toHaveLength(1);
    expect(malePerfumes[0].name).toBe('Fresh Citrus');
  });

  test('WB6 — Lookup by note returns perfumes containing that note', () => {
    const rosePerfumes = getPerfumesByAttribute(indexes, 'byNote', 'Rose');
    expect(rosePerfumes).toHaveLength(1);
    expect(rosePerfumes[0].name).toBe('Floral Rose');
  });

  test('WB7 — Lookup for non-existent key returns empty array', () => {
    const result = getPerfumesByAttribute(indexes, 'byCategory', 'NonExistent');
    expect(result).toEqual([]);
  });

});