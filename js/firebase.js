// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCM-d5GDZ8iSgAI_Yqj680I7YzvnA9h1aM",
	authDomain: "camfes-omiya-2023.firebaseapp.com",
	projectId: "camfes-omiya-2023",
	storageBucket: "camfes-omiya-2023.appspot.com",
	messagingSenderId: "49475582523",
	appId: "1:49475582523:web:f18450092686be3463ba1e",
	measurementId: "G-TEPYBS1GPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
