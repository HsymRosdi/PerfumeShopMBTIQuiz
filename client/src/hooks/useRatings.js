import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Custom hook that fetches all ratings from Firestore
 * and returns a Map of perfumeId -> { average, count }
 * Uses HashMap for O(1) lookups — same concept as perfumeIndex.js
 */
const useRatings = () => {
  const [ratingsMap, setRatingsMap] = useState({});
  const [loadingRatings, setLoadingRatings] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const snap = await getDocs(collection(db, "ratings"));
        const allRatings = snap.docs.map(doc => doc.data());

        // Build HashMap: perfumeId -> { total, count }
        const map = {};
        allRatings.forEach(({ perfumeId, rating }) => {
          if (!map[perfumeId]) {
            map[perfumeId] = { total: 0, count: 0 };
          }
          map[perfumeId].total += rating;
          map[perfumeId].count += 1;
        });

        // Calculate averages
        const avgMap = {};
        Object.entries(map).forEach(([id, { total, count }]) => {
          avgMap[id] = {
            average: Math.round((total / count) * 10) / 10,
            count,
          };
        });

        setRatingsMap(avgMap);
      } catch (err) {
        console.error("Error fetching ratings:", err);
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchRatings();
  }, []);

  return { ratingsMap, loadingRatings };
};

export default useRatings;