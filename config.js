// config.js (Safe Version 🛡️)

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9pqct58Qc61jRF-h0c2nt1ntctxF-CJc",
  authDomain: "love-chat-1month.firebaseapp.com",
  databaseURL: "https://love-chat-1month-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "love-chat-1month",
  storageBucket: "love-chat-1month.firebasestorage.app",
  messagingSenderId: "434980133810",
  appId: "1:434980133810:web:12929b8f2843dd07c162ab"
};

// 🔥 เช็คก่อนว่ามี App อยู่แล้วไหม? ถ้ามีก็ใช้ตัวเดิม (กัน Error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// ประกาศตัวแปร Global ไว้รอรับค่า
window.CONFIG = {
    headline: "Loading...",
    colors: { background: "#ffe6e6", cat: "#fff" },
    game: { maxHearts: 9 }, // ค่าเริ่มต้น
    chatSystem: {
        botName: "พี่หมี (AI)",
        adminName: "เค้าเอง (ตัวจริง)",
        profileImage: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        getLoveBattery: function() {
            const startStr = window.CONFIG.anniversaryDate || "2025-12-21";
            const start = new Date(startStr);
            const now = new Date();
            const diffTime = Math.abs(now - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let battery = 50 + diffDays;
            return battery > 100 ? 100 : battery;
        }
    }
};

// ดักฟังการเปลี่ยนแปลงจาก Firebase
onValue(ref(db, 'site_config'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        Object.assign(window.CONFIG, data);
        console.log("🔄 Config Updated:", data);

        // เปลี่ยนสีทันที
        if (typeof applyTheme === 'function') applyTheme();
        
        // ถ้าเกมเริ่มไปแล้ว แล้วมีการเปลี่ยนค่าหัวใจ ให้รีเซ็ตเกมใหม่ (ถ้าจำเป็น)
        // หรือปล่อยไว้ให้มีผลตอนรีเฟรชหน้าเว็บก็ได้ครับ
    }
});

window.applyTheme = function() {
    if (!window.CONFIG.colors) return;
    document.body.style.backgroundColor = window.CONFIG.colors.background;
    document.body.style.color = window.CONFIG.colors.text;
    const btns = document.querySelectorAll('.btn, button');
    btns.forEach(b => b.style.backgroundColor = window.CONFIG.colors.button);
    
    // เปลี่ยนสีแมว
    const cat = document.getElementById('naughty-cat-body'); // แก้ ID ให้ตรง
    if(cat) cat.style.backgroundColor = window.CONFIG.colors.cat || "#333";
    
    // เปลี่ยนสีหู/หางแมวด้วย
    const ears = document.querySelectorAll('.cat-ear');
    ears.forEach(e => e.style.borderBottomColor = window.CONFIG.colors.cat || "#333");
    const tail = document.querySelector('.cat-tail');
    if(tail) tail.style.backgroundColor = window.CONFIG.colors.cat || "#333";
    const legs = document.querySelectorAll('.cat-leg');
    legs.forEach(l => l.style.backgroundColor = window.CONFIG.colors.cat || "#333");
};
