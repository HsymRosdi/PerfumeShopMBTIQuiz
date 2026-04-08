import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const createOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};