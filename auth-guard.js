// auth-guard.js (รุ่นเพิ่มระบบสแกนคนเข้า Admin 👮‍♂️)

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Config เดิมของลูกพี่ (ผมใส่ databaseURL ให้ครบแล้ว กันเหนียว)
const firebaseConfig = {
    apiKey: "AIzaSyC9pqct58Qc61jRF-h0c2nt1ntctxF-CJc",
    authDomain: "love-chat-1month.firebaseapp.com",
    databaseURL: "https://love-chat-1month-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "love-chat-1month",
    storageBucket: "love-chat-1month.firebasestorage.app",
    messagingSenderId: "434980133810",
    appId: "1:434980133810:web:12929b8f2843dd07c162ab"
};

// 🚨 [สำคัญ] ใส่ UID ของคนที่มีสิทธิ์เข้า Admin ที่นี่
// วิธีหา UID: กด F12 ดูใน Console จะมีบอกว่า "Your UID: xxxxx"
const ADMIN_UIDS = [
    "ใส่_UID_ของลูกพี่ตรงนี้_1",
    "ใส่_UID_ของแฟนตรงนี้_2_(ถ้าอยากให้เข้า)",
    "7XyZ..." // ตัวอย่าง (ลบบรรทัดนี้ทิ้งได้)
];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        const overlay = document.getElementById('auth-overlay');
        
        if (user) {
            console.log("✅ Logged in as:", user.email);
            console.log("🆔 Your UID:", user.uid); // <--- ดู UID ตัวเองตรงนี้!!!

            // 🛑 เช็คสิทธิ์เฉพาะหน้า Admin
            if (window.location.href.includes('admin.html')) {
                // ถ้า UID ของคนที่ล็อกอิน ไม่อยู่ในรายชื่อ ADMIN_UIDS
                if (!ADMIN_UIDS.includes(user.uid)) {
                    alert("⛔ ขออภัย! คุณไม่มีสิทธิ์เข้าถึงหน้า Admin ครับ");
                    window.location.href = 'index.html'; // ดีดกลับหน้าหลักทันที
                    return; // จบการทำงาน ไม่ให้ไปต่อ
                }
            }

            // ถ้าผ่านทุกด่าน -> เอาม่านบังตาออก
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
