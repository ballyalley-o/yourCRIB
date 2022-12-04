import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCh1I91FzGA-afVdQOmGZvBTSf80_icXAU",
  authDomain: "your-crib-app.firebaseapp.com",
  projectId: "your-crib-app",
  storageBucket: "your-crib-app.appspot.com",
  messagingSenderId: "634269949360",
  appId: "1:634269949360:web:20eca3b1623b3268c00a75",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore()
