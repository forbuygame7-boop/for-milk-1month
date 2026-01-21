// auth-guard.js (ยามเฝ้าประตู - ฉบับแก้แผนที่ให้ถูก 🗺️)

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// ✅ ใส่ Config ให้ครบทุกบรรทัด (โดยเฉพาะ databaseURL)
const firebaseConfig = {
    apiKey: "AIzaSyC9pqct58Qc61jRF-h0c2nt1ntctxF-CJc",
    authDomain: "love-chat-1month.firebaseapp.com",
    // 👇 บรรทัดนี้สำคัญมาก! ต้องชี้ไปที่ asia-southeast1
    databaseURL: "https://love-chat-1month-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "love-chat-1month",
    storageBucket: "love-chat-1month.firebasestorage.app",
    messagingSenderId: "434980133810",
    appId: "1:434980133810:web:12929b8f2843dd07c162ab"
};

// เช็คก่อนว่าเชื่อมรึยัง ถ้ายังค่อยเชื่อม (ป้องกัน Error ซ้ำซ้อน)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
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
