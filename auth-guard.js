// auth-guard.js (ยามเฝ้าประตู + ระบบจำเครื่อง)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// config เดิมของลูกพี่
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

// ฟังก์ชันตรวจสอบสถานะ (ทำงานทันทีที่โหลดไฟล์)
function checkAuth() {
    // ซ่อนหน้าเว็บก่อน เพื่อความปลอดภัย (กันคนเห็นแวบๆ)
    document.body.style.display = 'none';

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ✅ ถ้ามีคนล็อกอินอยู่ (หรือจำเครื่องไว้)
            console.log("User is logged in:", user.email);
            document.body.style.display = 'block'; // โชว์หน้าเว็บ
        } else {
            // ❌ ถ้าไม่ได้ล็อกอิน -> ดีดไปหน้า login.html
            console.log("No user. Redirecting...");
            // ถ้าไม่ได้อยู่ที่หน้า login อยู่แล้ว ให้ดีดไป
            if (!window.location.href.includes('login.html')) {
                window.location.href = 'login.html';
            } else {
                // ถ้าอยู่ที่หน้า login ก็ให้โชว์หน้า login
                document.body.style.display = 'block';
            }
        }
    });
}

// เรียกใช้งานทันที
checkAuth();

// ฟังก์ชันสำหรับปุ่ม Logout (เอาไว้เรียกใช้จากไฟล์อื่น)
window.doLogout = function() {
    if(confirm("จะออกจากระบบเหรอ?")) {
        signOut(auth).then(() => {
            alert("ออกแล้วจ้า!");
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error(error);
        });
    }
}
