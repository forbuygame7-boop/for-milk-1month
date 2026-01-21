// auth-guard.js (ยามเฝ้าประตูแบบนุ่มนวล 🛡️)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC9pqct58Qc61jRF-h0c2nt1ntctxF-CJc",
    authDomain: "love-chat-1month.firebaseapp.com",
    projectId: "love-chat-1month",
    storageBucket: "love-chat-1month.firebasestorage.app",
    messagingSenderId: "434980133810",
    appId: "1:434980133810:web:12929b8f2843dd07c162ab"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ฟังก์ชันตรวจสอบสิทธิ์
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        const overlay = document.getElementById('auth-overlay');
        
        if (user) {
            // ✅ ล็อกอินแล้ว -> เอาม่านบังตาออก
            console.log("Logged in as:", user.email);
            if(overlay) overlay.style.display = 'none';
        } else {
            // ❌ ยังไม่ล็อกอิน -> ดีดไปหน้า Login
            console.log("Not logged in. Redirecting...");
            if (!window.location.href.includes('login.html')) {
                window.location.href = 'login.html';
            } else {
                // ถ้าอยู่หน้า Login อยู่แล้ว ก็เอาม่านออกให้กรอกรหัส
                if(overlay) overlay.style.display = 'none';
            }
        }
    });
}

checkAuth();

// ฟังก์ชัน Logout
window.doLogout = function() {
    if(confirm("จะออกจากระบบเหรอ?")) {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        });
    }
}
