/**
 * White Box Tests — similarPerfumes.js
 * Tests the similarity scoring algorithm
 * Run with: npm test
 */

import { calculateSimilarityScore, getSimilarPerfumes } from '../utils/similarPerfumes.js';

const perfumeA = {
  id: 1, name: 'Perfume A', brand: 'BrandX',
  category: 'Floral', price: 80,
  notes: { top: ['Rose', 'Bergamot'], middle: ['Jasmine'], base: ['Sandalwood'] },
  occasion: ['Daily', 'Evening']
};

const perfumeB = {
  id: 2, name: 'Perfume B', brand: 'BrandX',
  category: 'Floral', price: 90,
  notes: { top: ['Rose', 'Lemon'], middle: ['Jasmine'], base: ['Musk'] },
  occasion: ['Daily']
};

const perfumeC = {
  id: 3, name: 'Perfume C', brand: 'BrandY',
  category: 'Oriental', price: 200,
  notes: { top: ['Oud'], middle: ['Amber'], base: ['Incense'] },
  occasion: ['Evening']
};

describe('WB1-WB6: calculateSimilarityScore — Similarity Algorithm', () => {

  test('WB1 — Shared notes score > 0 when perfumes have common notes', () => {
    const { breakdown } = calculateSimilarityScore(perfumeA, perfumeB);
    expect(breakdown.notes).toBeGreaterThan(0);
  });

  test('WB2 — No shared notes scores 0 for notes', () => {
    const { breakdown } = calculateSimilarityScore(perfumeA, perfumeC);
    expect(breakdown.notes).toBe(0);
  });

  test('WB3 — Same scent family scores 25 points', () => {
    const { breakdown } = calculateSimilarityScore(perfumeA, perfumeB);
    expect(breakdown.category).toBe(25);
  });

  test('WB4 — Different scent family scores 0 points', () => {
    const { breakdown } = calculateSimilarityScore(perfumeA, perfumeC);
    expect(breakdown.category).toBe(0);
  });

  test('WB5 — Same brand scores 10 points', () => {
    const { breakdown } = calculateSimilarityScore(perfumeA, perfumeB);
    expect(breakdown.brand).toBe(10);
  });

  test('WB6 — Comparing perfume to itself returns score of 0', () => {
    const result = calculateSimilarityScore(perfumeA, perfumeA);
    expect(result).toBe(0);
  });

});

describe('WB7: getSimilarPerfumes — Top-4 Selection', () => {

  const allPerfumes = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Perfume ${i + 1}`,
    brand: i < 3 ? 'BrandX' : 'BrandY',
    category: i < 6 ? 'Floral' : 'Oriental',
    price: 50 + i * 10,
    notes: { top: ['Rose'], middle: ['Jasmine'], base: ['Sandalwood'] },
    occasion: ['Daily']
  }));

  test('WB7 — Returns exactly 4 similar perfumes by default', () => {
    const results = getSimilarPerfumes(perfumeA, allPerfumes);
    expect(results).toHaveLength(4);
  });

});