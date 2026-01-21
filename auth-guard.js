// auth-guard.js (รุ่นเพิ่มปุ่มลับ Admin 🕵️‍♂️)

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC9pqct58Qc61jRF-h0c2nt1ntctxF-CJc",
    authDomain: "love-chat-1month.firebaseapp.com",
    databaseURL: "https://love-chat-1month-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "love-chat-1month",
    storageBucket: "love-chat-1month.firebasestorage.app",
    messagingSenderId: "434980133810",
    appId: "1:434980133810:web:12929b8f2843dd07c162ab"
};

// 🚨 ใส่ UID ของลูกพี่ที่นี่ (ดูจาก Console: 🆔 Your UID)
const ADMIN_UIDS = [
    "Vh161dkrxLUP5wXjqfGR1a6S5tB3", 
    "เช่น_abc123456789xyz"
];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        const overlay = document.getElementById('auth-overlay');
        
        if (user) {
            console.log("✅ Logged in:", user.email);
            console.log("🆔 Your UID:", user.uid); 

            // 1. เช็คว่าใช่ Admin ตัวจริงไหม?
            if (ADMIN_UIDS.includes(user.uid)) {
                
                // ✅ ถ้าใช่: สั่งโชว์ปุ่ม Admin (ที่หน้า Index)
                const adminBtn = document.getElementById('adminBtn');
                if (adminBtn) {
                    adminBtn.style.display = 'inline-block'; // โผล่ออกมาซะ!
                }
                
            } else {
                // ❌ ถ้าไม่ใช่ Admin: ห้ามเข้าหน้า admin.html เด็ดขาด
                if (window.location.href.includes('admin.html')) {
                    alert("⛔ เฉพาะแอดมินเท่านั้นครับ!");
                    window.location.href = 'index.html';
                }
            }

            // เอาม่านบังตาออก
            if(overlay) overlay.style.display = 'none';

        } else {
            // ยังไม่ล็อกอิน -> ไปหน้า Login
            if (!window.location.href.includes('login.html')) {
                window.location.href = 'login.html';
            } else {
                if(overlay) overlay.style.display = 'none';
            }
        }
    });
}

checkAuth();

window.doLogout = function() {
    if(confirm("จะออกจากระบบเหรอ?")) {
        signOut(auth).then(() => { window.location.href = 'login.html'; });
    }
}
