// config.js (Version: Auto-Update Letter 💌)

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

// เช็คก่อนว่ามี App หรือยัง (กัน Error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// ประกาศตัวแปร Global ไว้รอรับค่า
window.CONFIG = {
    headline: "Loading...",
    deepMessage: "กำลังโหลดจดหมาย...", // ✅ ใส่ค่าเริ่มต้นไว้ กันขึ้น undefined
    colors: { background: "#ffe6e6", cat: "#fff" },
    game: { maxHearts: 9 },
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

// 🔥 ดักฟังข้อมูลจาก Firebase
onValue(ref(db, 'site_config'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        Object.assign(window.CONFIG, data);
        console.log("🔄 ข้อมูลมาแล้ว:", data);

        
        // 1. อัปเดตสีทันที
        if (typeof applyTheme === 'function') applyTheme();

        // 2. อัปเดตจดหมายทันที
        const letterEl = document.getElementById('letterBody');
        if (letterEl) {
            letterEl.innerHTML = window.CONFIG.deepMessage || "เขียนข้อความใน Admin หรือยังครับ?";
        }

        // 3. ✅ สั่งวาดแกลเลอรี่ใหม่ (เพิ่มบรรทัดนี้!)
        if (typeof renderGallery === 'function') renderGallery();
    }
});

// ฟังก์ชันเปลี่ยนสี
window.applyTheme = function() {
    if (!window.CONFIG.colors) return;
    document.body.style.backgroundColor = window.CONFIG.colors.background;
    document.body.style.color = window.CONFIG.colors.text;
    const btns = document.querySelectorAll('.btn, button');
    btns.forEach(b => b.style.backgroundColor = window.CONFIG.colors.button);
    
    // เปลี่ยนสีแมว
    const cat = document.getElementById('naughty-cat-body');
    if(cat) cat.style.backgroundColor = window.CONFIG.colors.cat || "#333";
    
    const ears = document.querySelectorAll('.cat-ear');
    ears.forEach(e => e.style.borderBottomColor = window.CONFIG.colors.cat || "#333");
    const tail = document.querySelector('.cat-tail');
    if(tail) tail.style.backgroundColor = window.CONFIG.colors.cat || "#333";
    const legs = document.querySelectorAll('.cat-leg');
    legs.forEach(l => l.style.backgroundColor = window.CONFIG.colors.cat || "#333");
};

