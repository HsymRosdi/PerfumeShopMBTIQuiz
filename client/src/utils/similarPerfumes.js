/**
 * Similar Perfumes Algorithm
 * 
 * Calculates similarity scores between perfumes based on shared attributes.
 * Used for "You Might Also Like" recommendations in QuickView modal.
 */

/**
 * Similarity scoring weights
 * Total possible score: 100 points
 */
const SIMILARITY_WEIGHTS = {
  sharedNotes: 40,      // How many notes overlap
  scentFamily: 25,      // Same category/scent family
  priceCloseness: 20,   // Price within similar range
  brandSimilarity: 10,  // Same brand bonus
  occasionOverlap: 5    // Similar occasions
};

/**
 * Calculate similarity score between two perfumes
 * 
 * @param {Object} basePerfume - The reference perfume
 * @param {Object} comparePerfume - The perfume to compare against
 * @returns {number} Similarity score from 0-100
 */
export function calculateSimilarityScore(basePerfume, comparePerfume) {
  // Don't compare a perfume to itself
  if (basePerfume.id === comparePerfume.id) return 0;
  
  let score = 0;
  const breakdown = {};
  
  // 1. Shared Notes (40 points max)
  // Calculate overlap between all notes (top, middle, base)
  if (basePerfume.notes && comparePerfume.notes) {
    const baseNotes = [
      ...(basePerfume.notes.top || []),
      ...(basePerfume.notes.middle || []),
      ...(basePerfume.notes.base || [])
    ].map(n => n.toLowerCase());
    
    const compareNotes = [
      ...(comparePerfume.notes.top || []),
      ...(comparePerfume.notes.middle || []),
      ...(comparePerfume.notes.base || [])
    ].map(n => n.toLowerCase());
    
    // Count shared notes
    const sharedNotes = baseNotes.filter(note => compareNotes.includes(note));
    const sharedCount = sharedNotes.length;
    const maxNotes = Math.max(baseNotes.length, 1);
    
    // Score proportional to shared notes ratio, capped at max weight
    const notesScore = Math.min(
      (sharedCount / maxNotes) * SIMILARITY_WEIGHTS.sharedNotes * 1.5, // Boost factor
      SIMILARITY_WEIGHTS.sharedNotes
    );
    score += notesScore;
    breakdown.notes = Math.round(notesScore);
    breakdown.sharedNotes = sharedNotes;
  } else {
    breakdown.notes = 0;
    breakdown.sharedNotes = [];
  }
  
  // 2. Same Scent Family/Category (25 points)
  if (basePerfume.category === comparePerfume.category) {
    score += SIMILARITY_WEIGHTS.scentFamily;
    breakdown.category = SIMILARITY_WEIGHTS.scentFamily;
  } else {
    breakdown.category = 0;
  }
  
  // 3. Price Closeness (20 points max)
  // Full points if prices are within £20, scaled down for larger differences
  if (basePerfume.price && comparePerfume.price) {
    const priceDiff = Math.abs(basePerfume.price - comparePerfume.price);
    const maxPriceDiff = 50; // £50 tolerance for any points
    
    if (priceDiff <= maxPriceDiff) {
      const priceScore = SIMILARITY_WEIGHTS.priceCloseness * (1 - priceDiff / maxPriceDiff);
      score += priceScore;
      breakdown.price = Math.round(priceScore);
    } else {
      breakdown.price = 0;
    }
  } else {
    breakdown.price = 0;
  }
  
  // 4. Same Brand (10 points bonus)
  // Helps suggest similar products from same house
  if (basePerfume.brand === comparePerfume.brand) {
    score += SIMILARITY_WEIGHTS.brandSimilarity;
    breakdown.brand = SIMILARITY_WEIGHTS.brandSimilarity;
  } else {
    breakdown.brand = 0;
  }
  
  // 5. Occasion Overlap (5 points max)
  if (basePerfume.occasion && comparePerfume.occasion) {
    const sharedOccasions = basePerfume.occasion.filter(occ => 
      comparePerfume.occasion.includes(occ)
    );
    const occasionScore = (sharedOccasions.length / basePerfume.occasion.length) * SIMILARITY_WEIGHTS.occasionOverlap;
    score += occasionScore;
    breakdown.occasion = Math.round(occasionScore);
    breakdown.sharedOccasions = sharedOccasions;
  } else {
    breakdown.occasion = 0;
    breakdown.sharedOccasions = [];
  }
  
  return { score: Math.round(score), breakdown };
}

/**
 * Get similar perfumes for a given perfume
 * 
 * @param {Object} basePerfume - The reference perfume
 * @param {Array} allPerfumes - Array of all perfume objects
 * @param {number} limit - Maximum number of similar perfumes to return
 * @param {boolean} sameGenderOnly - Whether to only return same gender perfumes
 * @returns {Array} Array of perfumes with similarityScore
 */
export function getSimilarPerfumes(basePerfume, allPerfumes, limit = 4, sameGenderOnly = false) {
  // Filter and score all perfumes
  let perfumesToCompare = allPerfumes.filter(p => p.id !== basePerfume.id);
  
  // Optionally filter by gender
  if (sameGenderOnly && basePerfume.gender !== "Unisex") {
    perfumesToCompare = perfumesToCompare.filter(p => 
      p.gender === basePerfume.gender || p.gender === "Unisex"
    );
  }
  
  // Calculate similarity scores
  const scoredPerfumes = perfumesToCompare.map(perfume => {
    const { score, breakdown } = calculateSimilarityScore(basePerfume, perfume);
    return {
      ...perfume,
      similarityScore: score,
      similarityPercentage: score, // Already out of 100
      similarityBreakdown: breakdown
    };
  });
  
  // Sort by similarity score (descending) and return top results
  return scoredPerfumes
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Get explanation of why perfumes are similar
 * @param {Object} breakdown - The similarityBreakdown
 * @returns {Array} Array of explanation strings
 */
export function getSimilarityExplanation(breakdown) {
  const explanations = [];
  
  if (breakdown.sharedNotes && breakdown.sharedNotes.length > 0) {
    explanations.push(`Shares notes: ${breakdown.sharedNotes.slice(0, 3).join(', ')}`);
  }
  
  if (breakdown.category > 0) {
    explanations.push('Same scent family');
  }
  
  if (breakdown.price > 15) {
    explanations.push('Similar price range');
  }
  
  if (breakdown.brand > 0) {
    explanations.push('Same brand');
  }
  
  if (breakdown.sharedOccasions && breakdown.sharedOccasions.length > 0) {
    explanations.push(`For ${breakdown.sharedOccasions[0]} occasions`);
  }
  
  return explanations;
}

/**
 * Group similar perfumes by similarity type
 * Useful for displaying "Similar Notes", "Same Family", "Similar Price" sections
 * 
 * @param {Object} basePerfume - The reference perfume
 * @param {Array} allPerfumes - Array of all perfumes
 * @returns {Object} Groups of similar perfumes
 */
export function groupSimilarPerfumes(basePerfume, allPerfumes) {
  const otherPerfumes = allPerfumes.filter(p => p.id !== basePerfume.id);
  
  return {
    byNotes: otherPerfumes
      .map(p => ({ ...p, ...calculateSimilarityScore(basePerfume, p) }))
      .filter(p => p.breakdown && p.breakdown.sharedNotes && p.breakdown.sharedNotes.length > 0)
      .sort((a, b) => b.breakdown.notes - a.breakdown.notes)
      .slice(0, 4),
      
    byCategory: otherPerfumes
      .filter(p => p.category === basePerfume.category)
      .slice(0, 4),
      
    byPrice: otherPerfumes
      .filter(p => Math.abs(p.price - basePerfume.price) <= 30)
      .sort((a, b) => Math.abs(a.price - basePerfume.price) - Math.abs(b.price - basePerfume.price))
      .slice(0, 4),
      
    byBrand: otherPerfumes
      .filter(p => p.brand === basePerfume.brand)
      .slice(0, 4)
  };
}

export default {
  calculateSimilarityScore,
  getSimilarPerfumes,
  getSimilarityExplanation,
  groupSimilarPerfumes,
  SIMILARITY_WEIGHTS
};
