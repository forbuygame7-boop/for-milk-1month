import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Config Firebase ของลูกพี่
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

// 🔥 ข้อมูลเริ่มต้นทั้งหมด (รวมเรื่องเกมและสีแมวที่ขอมาด้วย)
const setupData = {
    // 1. ข้อความทั่วไป
    headline: "Happy 1 Month Anniversary!",
    coupleNames: "Pat & Milk",
    anniversaryDate: "2025-12-21",
    passcode: "21122025",

    // 2. ตั้งค่าสี (รวมสีแมว)
    colors: {
        background: "#cc6ffac5", // สีพื้นหลัง
        text: "#ff4d4d",         // สีตัวหนังสือ
        button: "#ff0000",       // สีปุ่ม
        cat: "#FFFFFF"           // 🐱 สีแมว (เพิ่มให้แล้ว!)
    },

    // 3. ตั้งค่าเกมหัวใจ
    game: {
        maxHearts: 100,      // จำนวนหัวใจเต็ม
        clickPower: 1,       // กดทีนึงได้กี่แต้ม
        regenRate: 5         // เด้งคืนวินาทีละกี่แต้ม
    },

    // 4. ข้อความ Flash (ข้อความวิ่งๆ)
    flashMessages: [
        "เห้ย ว้าว! ครบแล้ว! เก่งจังอะ",
        "รางวัลคือ... รักนะคะอ้วน",
        "อยู่กับเค้าไปนานๆ นะ",
        "จุ๊บๆ"
    ],

    // 5. จดหมายลับ
    deepMessage: "ถึง มิ้ว...<br>รักนะเด็กโง่..."
};

// สั่งยิงขึ้น Firebase
function runSetup() {
    set(ref(db, 'site_config'), setupData)
        .then(() => {
            alert("✅ สร้างฐานข้อมูลสำเร็จ! พร้อมเชื่อมต่อแล้วครับลูกพี่");
        })
        .catch((error) => {
            alert("❌ เกิดข้อผิดพลาด: " + error.message);
        });
}

// เรียกใช้งาน (ถ้าแปะใน Console ให้พิมพ์ runSetup() แล้ว Enter)
runSetup();
