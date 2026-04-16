import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Save a perfume rating to Firestore
 */
export const saveRating = async ({ userId, perfumeId, perfumeName, rating, source, mbtiType = null, moodSelected = null }) => {
  try {
    await addDoc(collection(db, "ratings"), {
      userId,
      perfumeId,
      perfumeName,
      rating,
      source, // "mood" or "quiz"
      mbtiType,
      moodSelected,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error saving rating:", err);
  }
};

/**
 * Get all ratings by a specific user
 */
export const getUserRatings = async (userId) => {
  try {
    const q = query(collection(db, "ratings"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching ratings:", err);
    return [];
  }
};

/**
 * Get average rating for a specific perfume
 */
export const getPerfumeAverageRating = async (perfumeId) => {
  try {
    const q = query(collection(db, "ratings"), where("perfumeId", "==", perfumeId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const ratings = snap.docs.map(doc => doc.data().rating);
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    return { average: Math.round(avg * 10) / 10, count: ratings.length };
  } catch (err) {
    console.error("Error fetching average rating:", err);
    return null;
  }
};