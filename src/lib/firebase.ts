import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = firebaseConfig.apiKey ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) : null as any;
const db = firebaseConfig.apiKey ? getFirestore(app) : null as any;
const auth = firebaseConfig.apiKey ? getAuth(app) : null as any;

export async function saveMessage(chatId: string, prompt: string, response: string) {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      prompt,
      response,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export { app, db, auth };
