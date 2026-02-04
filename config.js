// config.js (ฉบับแก้ไข: ลบตัวแปรซ้ำที่ทำให้เว็บค้าง)

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

window.CONFIG = {
    headline: "Loading...",
    deepMessage: "กำลังโหลดจดหมาย...",
    apiKey: "", 
    missions: [],
    gallery: [],
    flashMessages: [],
    colors: { background: "#ffe6e6", cat: "#fff" },
    game: { maxHearts: 9 },
    chatSystem: {
        botName: "พี่หมี (AI)",
        adminName: "เค้าเอง (ตัวจริง)",
        profileImage: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        getLoveBattery: function() {
            const startStr = window.CONFIG.anniversaryDate || "2025-12-21";
            const startObj = new Date(startStr);
            const anniDay = startObj.getDate(); 
            const now = new Date();
            const currentDay = now.getDate();

            if (currentDay === anniDay) return 100;

            let lastAnni = new Date(now);
            let nextAnni = new Date(now);

            if (currentDay > anniDay) {
                lastAnni.setDate(anniDay);
                nextAnni.setMonth(now.getMonth() + 1);
                nextAnni.setDate(anniDay);
            } else {
                lastAnni.setMonth(now.getMonth() - 1);
                lastAnni.setDate(anniDay);
                nextAnni.setDate(anniDay);
            }

            const totalTime = nextAnni - lastAnni; 
            const timePassed = now - lastAnni;     

            let percent = (timePassed / totalTime) * 100;
            percent = Math.floor(percent);
            return percent < 1 ? 1 : (percent > 100 ? 100 : percent);
        }
    }
};

onValue(ref(db, 'site_config'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        Object.assign(window.CONFIG, data); 
        console.log("🔄 Config Loaded:", data);

        if (typeof applyTheme === 'function') applyTheme();

        const letterEl = document.getElementById('letterBody');
        if (letterEl) {
            letterEl.innerHTML = window.CONFIG.deepMessage || "เขียนข้อความใน Admin หรือยังครับ?";
        }

        if (typeof renderGallery === 'function') renderGallery();
        if (typeof renderMissions === 'function') renderMissions();

        // --- แก้ไขตรงนี้: ลบโค้ดที่ซ้ำกันออก ---
        
        // 1. ปุ่ม Timeline
        const tlBtn = document.getElementById('timelineBtn');
        if (tlBtn) {
            tlBtn.style.display = window.CONFIG.showTimelineBtn ? 'inline-block' : 'none';
        }

        // 2. ปุ่ม Valentine (ของขวัญ)
        const valBtn = document.getElementById('valentineBtn');
        if (valBtn && window.CONFIG.valentine) {
            valBtn.style.display = window.CONFIG.valentine.showBtn ? 'inline-block' : 'none';
        }
    }
});

window.applyTheme = function() {
    if (!window.CONFIG.colors) return;
    document.body.style.backgroundColor = window.CONFIG.colors.background;
    document.body.style.color = window.CONFIG.colors.text;
    const btns = document.querySelectorAll('.btn, button');
    btns.forEach(b => b.style.backgroundColor = window.CONFIG.colors.button);
    
    const cat = document.getElementById('naughty-cat-body');
    if(cat) cat.style.backgroundColor = window.CONFIG.colors.cat || "#333";
    
    const ears = document.querySelectorAll('.cat-ear');
    ears.forEach(e => e.style.borderBottomColor = window.CONFIG.colors.cat || "#333");
    const tail = document.querySelector('.cat-tail');
    if(tail) tail.style.backgroundColor = window.CONFIG.colors.cat || "#333";
    const legs = document.querySelectorAll('.cat-leg');
    legs.forEach(l => l.style.backgroundColor = window.CONFIG.colors.cat || "#333");
};
