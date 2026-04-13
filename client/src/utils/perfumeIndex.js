/**
 * Perfume Index Utilities
 * 
 * Implements HashMap/Dictionary data structures for O(1) lookups
 * by various perfume attributes (notes, category, MBTI, etc.)
 */

/**
 * Helper function to add a value to a Map that stores arrays
 * @param {Map} map - The Map to add to
 * @param {string} key - The key to use
 * @param {object} value - The value to add to the array
 */
function addToMapArray(map, key, value) {
  const normalizedKey = key.toLowerCase().trim();
  if (!map.has(normalizedKey)) {
    map.set(normalizedKey, []);
  }
  map.get(normalizedKey).push(value);
}

/**
 * Build comprehensive indexes for perfume data
 * Enables O(1) lookups by various attributes
 * 
 * @param {Array} perfumes - Array of perfume objects
 * @returns {Object} Object containing all indexes as Maps
 */
export function buildPerfumeIndexes(perfumes) {
  const indexes = {
    byId: new Map(),
    byCategory: new Map(),      // scent family
    byBrand: new Map(),
    byPriceTier: new Map(),
    byGender: new Map(),
    byNote: new Map(),          // all notes (top, middle, base)
    byOccasion: new Map(),
    byPersonality: new Map(),
    byMbti: new Map(),
    bySeason: new Map()
  };

  perfumes.forEach(perfume => {
    // Index by ID (direct mapping)
    indexes.byId.set(perfume.id, perfume);

    // Index by category (scent family)
    if (perfume.category) {
      addToMapArray(indexes.byCategory, perfume.category, perfume);
    }

    // Index by brand
    if (perfume.brand) {
      addToMapArray(indexes.byBrand, perfume.brand, perfume);
    }

    // Index by price tier
    if (perfume.priceTier) {
      addToMapArray(indexes.byPriceTier, perfume.priceTier, perfume);
    }

    // Index by gender
    if (perfume.gender) {
      addToMapArray(indexes.byGender, perfume.gender, perfume);
    }

    // Index by all notes (top, middle, base)
    if (perfume.notes) {
      const allNotes = [
        ...(perfume.notes.top || []),
        ...(perfume.notes.middle || []),
        ...(perfume.notes.base || [])
      ];
      allNotes.forEach(note => addToMapArray(indexes.byNote, note, perfume));
    }

    // Index by occasion
    if (perfume.occasion) {
      perfume.occasion.forEach(occ => addToMapArray(indexes.byOccasion, occ, perfume));
    }

    // Index by personality tags
    if (perfume.personalityTags) {
      perfume.personalityTags.forEach(tag => addToMapArray(indexes.byPersonality, tag, perfume));
    }

    // Index by MBTI types
    if (perfume.mbtiTypes) {
      perfume.mbtiTypes.forEach(type => addToMapArray(indexes.byMbti, type, perfume));
    }

    // Index by season
    if (perfume.season) {
      perfume.season.forEach(s => addToMapArray(indexes.bySeason, s, perfume));
    }
  });

  return indexes;
}

/**
 * Get perfumes by a specific attribute
 * @param {Object} indexes - The indexes object from buildPerfumeIndexes
 * @param {string} indexName - Name of the index (e.g., 'byCategory', 'byMbti')
 * @param {string} key - The key to look up
 * @returns {Array} Array of matching perfumes, or empty array if not found
 */
export function getPerfumesByAttribute(indexes, indexName, key) {
  const index = indexes[indexName];
  if (!index) return [];
  
  const normalizedKey = key.toLowerCase().trim();
  return index.get(normalizedKey) || [];
}

/**
 * Get perfumes that match multiple attributes (intersection)
 * @param {Object} indexes - The indexes object
 * @param {Array} criteria - Array of {indexName, key} objects
 * @returns {Array} Array of perfumes matching all criteria
 */
export function getPerfumesByMultipleAttributes(indexes, criteria) {
  if (!criteria || criteria.length === 0) return [];

  // Get first set of matches
  let results = getPerfumesByAttribute(indexes, criteria[0].indexName, criteria[0].key);
  
  // Intersect with remaining criteria
  for (let i = 1; i < criteria.length; i++) {
    const matches = getPerfumesByAttribute(indexes, criteria[i].indexName, criteria[i].key);
    const matchIds = new Set(matches.map(p => p.id));
    results = results.filter(p => matchIds.has(p.id));
  }

  return results;
}

/**
 * Get all unique values for a specific attribute
 * @param {Object} indexes - The indexes object
 * @param {string} indexName - Name of the index
 * @returns {Array} Array of unique keys in that index
 */
export function getUniqueAttributeValues(indexes, indexName) {
  const index = indexes[indexName];
  if (!index) return [];
  return Array.from(index.keys());
}

export default { 
  buildPerfumeIndexes, 
  getPerfumesByAttribute, 
  getPerfumesByMultipleAttributes,
  getUniqueAttributeValues 
};
