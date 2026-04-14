/**
 * Quiz Recommendation Algorithm
 * 
 * Implements weighted scoring to match perfumes with MBTI personality results.
 * Uses rule-based scoring with configurable weights for different factors.
 */

import { mbtiProfiles } from './mbtiPerfumeMapping';

/**
 * Calculate MBTI type from quiz answers
 * Uses majority voting for each dimension (5 questions per dimension)
 * 
 * @param {Array} answers - Array of answer objects with {dimension, value}
 * @returns {Object} { type: 'XXXX', profile: {...}, scores: {...} }
 */
export function calculateMbtiType(answers) {
  // Initialize counters for each trait
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  
  // Count responses for each dimension
  answers.forEach(answer => {
    if (answer.dimension !== "gender" && scores.hasOwnProperty(answer.value)) {
      scores[answer.value]++;
    }
  });
  
  // Determine MBTI type based on majority (5 questions each, majority wins)
  const mbtiType = 
    (scores.E >= scores.I ? 'E' : 'I') +
    (scores.S >= scores.N ? 'S' : 'N') +
    (scores.T >= scores.F ? 'T' : 'F') +
    (scores.J >= scores.P ? 'J' : 'P');
  
  // Calculate strength percentages for each dimension
  const strengths = {
    EI: Math.round(Math.max(scores.E, scores.I) / 5 * 100),
    SN: Math.round(Math.max(scores.S, scores.N) / 5 * 100),
    TF: Math.round(Math.max(scores.T, scores.F) / 5 * 100),
    JP: Math.round(Math.max(scores.J, scores.P) / 5 * 100)
  };
  
  return {
    type: mbtiType,
    profile: mbtiProfiles[mbtiType],
    scores: scores,
    strengths: strengths
  };
}

/**
 * Scoring weights for recommendation algorithm
 * Total possible score: 100 points
 */
const RECOMMENDATION_WEIGHTS = {
  mbtiMatch: 40,         // Direct MBTI type match (perfume is tagged for this MBTI)
  categoryMatch: 25,     // Scent family matches MBTI preferences
  notesMatch: 20,        // Notes match MBTI preferred notes
  personalityMatch: 10,  // Personality tags align with MBTI traits
  gender: 5              // Gender preference match
};

/**
 * Calculate recommendation score for a single perfume
 * 
 * @param {Object} perfume - Perfume object with all attributes
 * @param {Object} mbtiResult - Result from calculateMbtiType
 * @param {string} genderPreference - User's gender preference ('Male', 'Female', 'Unisex')
 * @returns {number} Score from 0-100
 */
export function calculateRecommendationScore(perfume, mbtiResult, genderPreference) {
  let score = 0;
  const profile = mbtiResult.profile;
  const breakdown = {};
  
  // 1. Direct MBTI Match (40 points)
  // If the perfume is specifically tagged for this MBTI type
  if (perfume.mbtiTypes && perfume.mbtiTypes.includes(mbtiResult.type)) {
    score += RECOMMENDATION_WEIGHTS.mbtiMatch;
    breakdown.mbti = RECOMMENDATION_WEIGHTS.mbtiMatch;
  } else {
    breakdown.mbti = 0;
  }
  
  // 2. Category/Scent Family Match (25 points)
  // If the perfume's category is in the MBTI's preferred categories
  if (profile.preferredCategories && profile.preferredCategories.includes(perfume.category)) {
    score += RECOMMENDATION_WEIGHTS.categoryMatch;
    breakdown.category = RECOMMENDATION_WEIGHTS.categoryMatch;
  } else {
    breakdown.category = 0;
  }
  
  // 3. Notes Match (20 points - proportional to matching notes)
  if (perfume.notes && profile.preferredNotes) {
    const allPerfumeNotes = [
      ...(perfume.notes.top || []),
      ...(perfume.notes.middle || []),
      ...(perfume.notes.base || [])
    ].map(n => n.toLowerCase());
    
    const matchingNotes = profile.preferredNotes.filter(note => 
      allPerfumeNotes.some(pNote => pNote.includes(note.toLowerCase()))
    );
    
    const notesScore = (matchingNotes.length / profile.preferredNotes.length) * RECOMMENDATION_WEIGHTS.notesMatch;
    score += notesScore;
    breakdown.notes = Math.round(notesScore);
    breakdown.matchingNotes = matchingNotes;
  } else {
    breakdown.notes = 0;
    breakdown.matchingNotes = [];
  }
  
  // 4. Personality Tags Match (10 points - proportional)
  if (perfume.personalityTags && profile.traits) {
    const matchingTraits = profile.traits.filter(trait =>
      perfume.personalityTags.some(tag => 
        tag.toLowerCase().includes(trait.toLowerCase()) ||
        trait.toLowerCase().includes(tag.toLowerCase())
      )
    );
    
    const traitScore = (matchingTraits.length / profile.traits.length) * RECOMMENDATION_WEIGHTS.personalityMatch;
    score += traitScore;
    breakdown.personality = Math.round(traitScore);
    breakdown.matchingTraits = matchingTraits;
  } else {
    breakdown.personality = 0;
    breakdown.matchingTraits = [];
  }
  
  // 5. Gender Preference Match (5 points)
  // Full points if: user chose Unisex, perfume matches preference, or perfume is Unisex
  if (genderPreference === "Unisex" || 
      genderPreference === perfume.gender || 
      perfume.gender === "Unisex") {
    score += RECOMMENDATION_WEIGHTS.gender;
    breakdown.gender = RECOMMENDATION_WEIGHTS.gender;
  } else {
    breakdown.gender = 0;
  }
  
  return { score: Math.round(score), breakdown };
}

/**
 * Get top perfume recommendations based on quiz results
 * 
 * @param {Array} perfumes - Array of all perfume objects
 * @param {Object} mbtiResult - Result from calculateMbtiType
 * @param {string} genderPreference - User's gender preference
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} Array of perfumes with matchScore and matchPercentage
 */
export function getQuizRecommendations(perfumes, mbtiResult, genderPreference, limit = 5) {
  // Filter by gender preference (include Unisex perfumes always)
  let filteredPerfumes = perfumes;
  if (genderPreference !== "Unisex") {
    filteredPerfumes = perfumes.filter(p => 
      p.gender === genderPreference || p.gender === "Unisex"
    );
  }
  
  // Calculate scores for all filtered perfumes
  const scoredPerfumes = filteredPerfumes.map(perfume => {
    const { score, breakdown } = calculateRecommendationScore(perfume, mbtiResult, genderPreference);
    return {
      ...perfume,
      matchScore: score,
      matchPercentage: score, // Score is already out of 100
      scoreBreakdown: breakdown
    };
  });
  
  // Sort by score (descending) and return top results
  return scoredPerfumes
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Get a text explanation of why a perfume matched
 * @param {Object} breakdown - The scoreBreakdown from calculateRecommendationScore
 * @param {Object} profile - The MBTI profile
 * @returns {Array} Array of explanation strings
 */
export function getMatchExplanation(breakdown, profile) {
  const explanations = [];
  
  if (breakdown.mbti > 0) {
    explanations.push(`Perfect match for ${profile.name} personality type`);
  }
  
  if (breakdown.category > 0) {
    explanations.push(`Features your preferred scent family`);
  }
  
  if (breakdown.matchingNotes && breakdown.matchingNotes.length > 0) {
    explanations.push(`Contains notes you love: ${breakdown.matchingNotes.slice(0, 3).join(', ')}`);
  }
  
  if (breakdown.matchingTraits && breakdown.matchingTraits.length > 0) {
    explanations.push(`Matches your ${breakdown.matchingTraits[0]} personality`);
  }
  
  return explanations;
}

export default {
  calculateMbtiType,
  calculateRecommendationScore,
  getQuizRecommendations,
  getMatchExplanation,
  RECOMMENDATION_WEIGHTS
};
