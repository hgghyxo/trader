import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyBvmFgBXbyN8Jph5Dg6mrMQjg_trBs139E',
	authDomain: 'trader-c31a5.firebaseapp.com',
	databaseURL: 'https://trader-c31a5-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'trader-c31a5',
	storageBucket: 'trader-c31a5.appspot.com',
	messagingSenderId: '480848709107',
	appId: '1:480848709107:web:ca8b71bf1caf4b75647e86',
	measurementId: 'G-0PB80V1NKQ'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
