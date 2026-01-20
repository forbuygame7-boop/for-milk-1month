import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ประกาศตัวแปร Global ไว้รอรับค่า
window.CONFIG = {
    // ค่าเริ่มต้นกันเหนียว (เผื่อเน็ตช้า)
    headline: "Loading...",
    colors: { background: "#ffe6e6", cat: "#fff" },
    game: { maxHearts: 100 },
    chatSystem: {
        botName: "พี่หมี (AI)",
        adminName: "เค้าเอง (ตัวจริง)",
        profileImage: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        // ฟังก์ชันคำนวณแบตเตอรี่หัวใจ (ใช้วันที่จาก Firebase)
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

// 🔥 เกาะติดสถานการณ์! (Listener)
// เมื่อค่าใน Firebase เปลี่ยน -> โค้ดนี้จะทำงานทันที
onValue(ref(db, 'site_config'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // อัปเดตข้อมูลใหม่ลงใน window.CONFIG
        Object.assign(window.CONFIG, data);
        
        console.log("🔄 อัปเดต Config ใหม่แล้ว:", data);

        // ถ้ามีฟังก์ชันเปลี่ยนธีม ให้เรียกใช้เลย (Real-time update)
        if (typeof applyTheme === 'function') {
            applyTheme(); 
        }
    }
});

// ฟังก์ชันเปลี่ยนสีหน้าเว็บ (เรียกใช้ได้ทันที)
window.applyTheme = function() {
    if (!window.CONFIG.colors) return;
    
    // เปลี่ยนสีพื้นหลัง
    document.body.style.backgroundColor = window.CONFIG.colors.background;
    document.body.style.color = window.CONFIG.colors.text;
    
    // เปลี่ยนสีปุ่ม (ถ้ามี class .btn)
    const btns = document.querySelectorAll('.btn, button');
    btns.forEach(b => b.style.backgroundColor = window.CONFIG.colors.button);

    // 🐱 เปลี่ยนสีแมว (ถ้ามี element id="cat")
    const cat = document.getElementById('cat');
    if(cat) {
        cat.style.fill = window.CONFIG.colors.cat; // กรณีเป็น SVG
        cat.style.color = window.CONFIG.colors.cat; // กรณีเป็น Font Icon
    }
};
