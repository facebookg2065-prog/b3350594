
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
// Added getDoc and limit to the firestore imports
import { getFirestore, collection, addDoc, getDocs, getDoc, query, where, orderBy, limit, doc, setDoc, updateDoc, increment, serverTimestamp, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ملاحظة: يجب وضع إعدادات Firebase الخاصة بك هنا
// بما أننا في بيئة تطوير، سنستخدم الهيكل البرمجي الجاهز للربط
const firebaseConfig = {
  apiKey: "AIzaSy...", // استبدلها بمفتاحك الحقيقي
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
  // Added getDoc and limit to the exports
  collection, addDoc, getDocs, getDoc, query, where, orderBy, limit, doc, setDoc, updateDoc, increment, serverTimestamp, onSnapshot
};
