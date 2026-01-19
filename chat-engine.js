// chat-engine.js
// ใช้ Firebase เวอร์ชั่น Modular (v9) ที่เสถียรสำหรับ module
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp, query, limitToLast } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// --- Config ของคุณ (ผมใส่ให้แล้ว) ---
const firebaseConfig = {
  apiKey: "AIzaSyC9pqct58Qc61jRF-h0c2nt1ntctxF-CJc",
  authDomain: "love-chat-1month.firebaseapp.com",
  databaseURL: "https://love-chat-1month-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "love-chat-1month",
  storageBucket: "love-chat-1month.firebasestorage.app",
  messagingSenderId: "434980133810",
  appId: "1:434980133810:web:0ef884bb549fc2e3c162ab",
  measurementId: "G-QZMV1T3LQC"
};

// เริ่มต้นระบบ
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, 'messages');

// --- ฟังก์ชันส่งข้อความ (ทำให้เป็น Global เพื่อให้ไฟล์อื่นเรียกใช้ได้) ---
window.sendRealtimeMessage = function(text, sender) {
    if(!text) return;
    
    push(messagesRef, {
        text: text,
        sender: sender, 
        timestamp: serverTimestamp() 
    });
}

// --- ฟังก์ชันรับข้อความ ---
export function initRealtimeChat(callbackFunction) {
    // ดึง 50 ข้อความล่าสุด
    const recentMessagesQuery = query(messagesRef, limitToLast(50));
    
    onChildAdded(recentMessagesQuery, (snapshot) => {
        const data = snapshot.val();
        // ป้องกัน Error กรณีข้อมูลไม่ครบ
        if (data && data.text) {
            callbackFunction(data.text, data.sender, data.timestamp);
        }
    });
}