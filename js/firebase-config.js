const firebaseConfig = {
  apiKey: "AIzaSyD1Wz7ti0U3gsvLBrvXI_c0cFopZMDNO24",
  authDomain: "gx-game.firebaseapp.com",
  databaseURL: "https://gx-game-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ Correct region
  projectId: "gx-game",
  storageBucket: "gx-game.firebasestorage.app",
  messagingSenderId: "855662576910",
  appId: "1:855662576910:web:ae927e7304c9fbc7be435f",
  measurementId: "G-TJ88CZYGQD"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
