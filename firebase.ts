
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, getDoc, query, where, orderBy, limit, doc, setDoc, updateDoc, increment, serverTimestamp, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// استخدام متغيرات البيئة (Vercel Environment Variables)
// ملاحظة: تأكد من إضافة هذه المتغيرات في لوحة تحكم Vercel
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSy...", // استبدلها في Vercel بـ FIREBASE_API_KEY
  authDomain: "souq-aljuma.firebaseapp.com",
  projectId: "souq-aljuma",
  storageBucket: "souq-aljuma.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, db, googleProvider, 
  signInWithPopup, signOut, onAuthStateChanged,
  collection, addDoc, getDocs, getDoc, query, where, orderBy, limit, doc, setDoc, updateDoc, increment, serverTimestamp, onSnapshot
};
