const firebaseConfig = {
  apiKey: "AIzaSyB3DBsxPIwYD1XiS9k03nAJT-yYvAKFlIo",
  authDomain: "fortearchive-4e735.firebaseapp.com",
  projectId: "fortearchive-4e735",
  storageBucket: "fortearchive-4e735.firebasestorage.app",
  messagingSenderId: "461596731704",
  appId: "1:461596731704:web:ffb203d6959783f00039cd",
  measurementId: "G-VV5CLT93VR"
};

firebase.initializeApp(firebaseConfig);
window.firebaseDb = firebase.firestore();