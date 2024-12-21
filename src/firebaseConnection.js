
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"; //Rodar o banco de dados


const firebaseConfig = {
  apiKey: "AIzaSyBlqHoS6gQVbZ21TVk1H85KpPzrVbFNGEE",
  authDomain: "devcurso-1775a.firebaseapp.com",
  projectId: "devcurso-1775a",
  storageBucket: "devcurso-1775a.firebasestorage.app",
  messagingSenderId: "582183683714",
  appId: "1:582183683714:web:96cf2c2cd7f0197c18d69b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db}; //exportar conexão com banco na app.js