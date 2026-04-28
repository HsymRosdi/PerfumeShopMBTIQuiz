/**
 * White Box Tests — quizRecommendation.js
 * Tests the MBTI majority voting algorithm and weighted scoring system
 * Run with: npm test
 */

import { calculateMbtiType, calculateRecommendationScore, getQuizRecommendations } from '../utils/quizRecommendation.js';

jest.mock('../utils/mbtiPerfumeMapping.js', () => ({
  mbtiProfiles: {
    INFP: {
      name: 'The Mediator',
      preferredCategories: ['Floral', 'Woody'],
      preferredNotes: ['rose', 'jasmine', 'sandalwood'],
      traits: ['creative', 'gentle', 'idealistic']
    },
    ESTJ: {
      name: 'The Executive',
      preferredCategories: ['Fresh', 'Citrus'],
      preferredNotes: ['bergamot', 'lemon', 'cedar'],
      traits: ['organized', 'decisive', 'traditional']
    }
  }
}));

const mockPerfume = {
  id: 1,
  name: 'Test Floral',
  brand: 'TestBrand',
  category: 'Floral',
  gender: 'Female',
  price: 80,
  mbtiTypes: ['INFP', 'ENFP'],
  personalityTags: ['creative', 'romantic'],
  notes: {
    top: ['Rose', 'Bergamot'],
    middle: ['Jasmine', 'Lily'],
    base: ['Sandalwood', 'Musk']
  },
  occasion: ['Daily', 'Evening']
};

const makeAnswers = (EI, SN, TF, JP) => [
  ...Array(EI[0]).fill({ dimension: 'EI', value: 'E' }),
  ...Array(EI[1]).fill({ dimension: 'EI', value: 'I' }),
  ...Array(SN[0]).fill({ dimension: 'SN', value: 'S' }),
  ...Array(SN[1]).fill({ dimension: 'SN', value: 'N' }),
  ...Array(TF[0]).fill({ dimension: 'TF', value: 'T' }),
  ...Array(TF[1]).fill({ dimension: 'TF', value: 'F' }),
  ...Array(JP[0]).fill({ dimension: 'JP', value: 'J' }),
  ...Array(JP[1]).fill({ dimension: 'JP', value: 'P' }),
];

// ─── calculateMbtiType Tests ─────────────────────────────────────────────────

describe('WB1-WB5: calculateMbtiType — Majority Voting Algorithm', () => {

  test('WB1 — Returns E when E:3, I:2', () => {
    const result = calculateMbtiType(makeAnswers([3,2],[3,2],[3,2],[3,2]));
    expect(result.type[0]).toBe('E');
  });

  test('WB2 — Returns F when T:1, F:4', () => {
    const result = calculateMbtiType(makeAnswers([2,3],[2,3],[1,4],[2,3]));
    expect(result.type[2]).toBe('F');
  });

  test('WB3 — Returns correct full MBTI type INFP', () => {
    const result = calculateMbtiType(makeAnswers([1,4],[1,4],[1,4],[1,4]));
    expect(result.type).toBe('INFP');
  });

  test('WB4 — Gender dimension is ignored in MBTI calculation', () => {
    const answers = [
      { dimension: 'gender', value: 'Female' },
      ...makeAnswers([3,2],[3,2],[3,2],[3,2])
    ];
    const result = calculateMbtiType(answers);
    expect(result.type).toBe('ESTJ');
    expect(result.scores.E).toBe(3);
  });

  test('WB5 — Strength is 100% when all 5 answers are same dimension', () => {
    const result = calculateMbtiType(makeAnswers([0,5],[0,5],[0,5],[0,5]));
    expect(result.strengths.EI).toBe(100);
  });

});

// ─── calculateRecommendationScore Tests ─────────────────────────────────────

describe('WB6-WB12: calculateRecommendationScore — Weighted Scoring', () => {

  const infpResult = {
    type: 'INFP',
    profile: {
      name: 'The Mediator',
      preferredCategories: ['Floral', 'Woody'],
      preferredNotes: ['rose', 'jasmine', 'sandalwood'],
      traits: ['creative', 'gentle', 'idealistic']
    }
  };

  const estjResult = {
    type: 'ESTJ',
    profile: {
      name: 'The Executive',
      preferredCategories: ['Fresh', 'Citrus'],
      preferredNotes: ['bergamot', 'lemon', 'cedar'],
      traits: ['organized', 'decisive', 'traditional']
    }
  };

  test('WB6 — MBTI match scores 40 points', () => {
    const { breakdown } = calculateRecommendationScore(mockPerfume, infpResult, 'Female');
    expect(breakdown.mbti).toBe(40);
  });

  test('WB7 — MBTI mismatch scores 0 points', () => {
    const { breakdown } = calculateRecommendationScore(mockPerfume, estjResult, 'Female');
    expect(breakdown.mbti).toBe(0);
  });

  test('WB8 — Category match scores 25 points', () => {
    const { breakdown } = calculateRecommendationScore(mockPerfume, infpResult, 'Female');
    expect(breakdown.category).toBe(25);
  });

  test('WB9 — Gender match scores 5 points', () => {
    const { breakdown } = calculateRecommendationScore(mockPerfume, infpResult, 'Female');
    expect(breakdown.gender).toBe(5);
  });

  test('WB10 — Gender mismatch scores 0 points', () => {
    const { breakdown } = calculateRecommendationScore(mockPerfume, infpResult, 'Male');
    expect(breakdown.gender).toBe(0);
  });

  test('WB11 — Unisex preference always scores 5 points', () => {
    const { breakdown } = calculateRecommendationScore(mockPerfume, infpResult, 'Unisex');
    expect(breakdown.gender).toBe(5);
  });

  test('WB12 — Total score does not exceed 100', () => {
    const { score } = calculateRecommendationScore(mockPerfume, infpResult, 'Female');
    expect(score).toBeLessThanOrEqual(100);
  });

});

// ─── getQuizRecommendations Tests ────────────────────────────────────────────

describe('WB13-WB15: getQuizRecommendations — Top-K Selection', () => {

  const mockPerfumes = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Perfume ${i + 1}`,
    brand: 'TestBrand',
    category: i % 2 === 0 ? 'Floral' : 'Fresh',
    gender: 'Female',
    price: 50 + i * 10,
    mbtiTypes: i < 3 ? ['INFP'] : ['ESTJ'],
    personalityTags: ['creative'],
    notes: { top: ['rose'], middle: ['jasmine'], base: ['sandalwood'] },
    occasion: ['Daily']
  }));

  const infpResult = {
    type: 'INFP',
    profile: {
      name: 'The Mediator',
      preferredCategories: ['Floral', 'Woody'],
      preferredNotes: ['rose', 'jasmine', 'sandalwood'],
      traits: ['creative', 'gentle']
    }
  };

  test('WB13 — Returns exactly 5 recommendations by default', () => {
    const results = getQuizRecommendations(mockPerfumes, infpResult, 'Female');
    expect(results).toHaveLength(5);
  });

  test('WB14 — Results are sorted by matchScore descending', () => {
    const results = getQuizRecommendations(mockPerfumes, infpResult, 'Female');
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].matchScore).toBeGreaterThanOrEqual(results[i + 1].matchScore);
    }
  });

  test('WB15 — Each result has a matchScore property', () => {
    const results = getQuizRecommendations(mockPerfumes, infpResult, 'Female');
    results.forEach(r => {
      expect(r).toHaveProperty('matchScore');
      expect(typeof r.matchScore).toBe('number');
    });
  });

});