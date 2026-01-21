// config.js (Version: Support API Key & Gallery)

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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// ประกาศตัวแปร Global
window.CONFIG = {
    headline: "Loading...",
    deepMessage: "กำลังโหลดจดหมาย...",
    apiKey: "", // ✅ เพิ่มตัวแปรมารอรับ Key
    missions: [], // ✅ เพิ่มบรรทัดนี้: เพื่อรอรับข้อมูลภารกิจ
    gallery: [],
    flashMessages: [],
    colors: { background: "#ffe6e6", cat: "#fff" },
    game: { maxHearts: 9 },
    // ... (ส่วน Chat System เดิม ไม่ต้องแก้) ...
    chatSystem: {
        botName: "พี่หมี (AI)",
        adminName: "เค้าเอง (ตัวจริง)",
        profileImage: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        // ฟังก์ชันคำนวณแบตเตอรี่ (รีเซ็ตทุกเดือน)
        getLoveBattery: function() {
            // 1. หาวันที่เริ่มคบ (เช่น วันที่ 21)
            const startStr = window.CONFIG.anniversaryDate || "2025-12-21"; // วันครบรอบ
            const startObj = new Date(startStr);
            const anniDay = startObj.getDate(); // ได้เลข 21

            // 2. วันนี้
            const now = new Date();
            const currentDay = now.getDate();

            // 3. ถ้าวันนี้ตรงกับวันครบรอบเป๊ะๆ (เช่น วันที่ 21) -> เต็ม 100%
            if (currentDay === anniDay) return 100;

            // 4. คำนวณวันเริ่มต้นรอบ และวันจบรอบ
            let lastAnni = new Date(now);
            let nextAnni = new Date(now);

            if (currentDay > anniDay) {
                // ถ้าวันนี้ (25) เลยวันครบรอบ (21) มาแล้ว
                // รอบเริ่ม: วันที่ 21 เดือนนี้
                // รอบจบ: วันที่ 21 เดือนหน้า
                lastAnni.setDate(anniDay);
                nextAnni.setMonth(now.getMonth() + 1);
                nextAnni.setDate(anniDay);
            } else {
                // ถ้าวันนี้ (5) ยังไม่ถึงวันครบรอบ (21)
                // รอบเริ่ม: วันที่ 21 เดือนที่แล้ว
                // รอบจบ: วันที่ 21 เดือนนี้
                lastAnni.setMonth(now.getMonth() - 1);
                lastAnni.setDate(anniDay);
                nextAnni.setDate(anniDay);
            }

            // 5. คำนวณเปอร์เซ็นต์ความคืบหน้า
            const totalTime = nextAnni - lastAnni; // เวลาทั้งหมดในรอบนี้ (ประมาณ 30 วัน)
            const timePassed = now - lastAnni;     // เวลาที่ผ่านมาแล้ว

            let percent = (timePassed / totalTime) * 100;
            
            // ปัดเลขให้สวยๆ (ขั้นต่ำ 1% สูงสุด 100%)
            percent = Math.floor(percent);
            return percent < 1 ? 1 : (percent > 100 ? 100 : percent);
        }
    }
};

// 🔥 ดักฟังข้อมูลจาก Firebase (หัวใจสำคัญ)
onValue(ref(db, 'site_config'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        Object.assign(window.CONFIG, data); // เอาข้อมูลทั้งหมด (รวม apiKey) ยัดใส่ window.CONFIG
        console.log("🔄 Config Loaded:", data);

        // 1. อัปเดตสี
        if (typeof applyTheme === 'function') applyTheme();

        // 2. อัปเดตจดหมาย
        const letterEl = document.getElementById('letterBody');
        if (letterEl) {
            letterEl.innerHTML = window.CONFIG.deepMessage || "เขียนข้อความใน Admin หรือยังครับ?";
        }

        // 3. วาดแกลเลอรี่
        if (typeof renderGallery === 'function') renderGallery();

        // 4. วาดภารกิจ (ถ้ามีฟังก์ชันนี้อยู่)
        if (typeof renderMissions === 'function') renderMissions();
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




