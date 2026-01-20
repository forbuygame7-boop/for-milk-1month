// chat-core.js (AI Powered Edition 🧠)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, limitToLast } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// --- Config Firebase ของคุณ ---
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
let isBotActive = true; 

// 🔥 ใส่ API Key ของ Gemini ตรงนี้! (เอาที่ก๊อปมาใส่แทน AIzaSy...)
const GEMINI_API_KEY = "AIzaSyClpZdoIRh4bBDJVUTEpMRtsKBzuDCMuxs"; 

// ==========================================
// 1. ส่วน UI (หน้าจอมือถือ) - เหมือนเดิมเป๊ะ
// ==========================================
const phoneCSS = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap');
    .phone-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Sarabun', sans-serif; }
    .chat-toggle { width: 60px; height: 60px; background: #00c300; border-radius: 50%; color: white; font-size: 30px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: transform 0.3s; position: relative; }
    .chat-toggle:hover { transform: scale(1.1); }
    .notify-badge { position: absolute; top: 0; right: 0; background: red; color: white; font-size: 12px; width: 20px; height: 20px; border-radius: 50%; display: none; justify-content: center; align-items: center; }
    .phone-screen { position: absolute; bottom: 80px; right: 0; width: 350px; height: 600px; background: #8cabd9; border-radius: 30px; border: 8px solid #333; box-shadow: 0 10px 40px rgba(0,0,0,0.4); overflow: hidden; display: flex; flex-direction: column; transform-origin: bottom right; transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
    .phone-widget.closed .phone-screen { transform: scale(0); opacity: 0; pointer-events: none; }
    .status-bar { background: rgba(255,255,255,0.9); padding: 5px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: bold; color: #333; height: 25px; }
    .battery-icon { width: 20px; height: 10px; border: 1px solid #333; padding: 1px; position: relative; }
    .battery-level { height: 100%; background: #00c300; width: 100%; }
    .app-header { background: rgba(255,255,255,0.95); padding: 10px 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #ddd; }
    .name { font-weight: bold; font-size: 16px; }
    .status { font-size: 12px; color: #666; }
    .call-icons { letter-spacing: 10px; opacity: 0.6; cursor: pointer; margin-left: auto; }
    .chat-area { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .date-divider { align-self: center; background: rgba(0,0,0,0.1); color: white; font-size: 10px; padding: 3px 10px; border-radius: 10px; margin-bottom: 10px; }
    .msg { max-width: 80%; padding: 10px 15px; border-radius: 20px; font-size: 14px; line-height: 1.4; position: relative; animation: popUp 0.3s ease; word-wrap: break-word;}
    @keyframes popUp { from{transform: scale(0.8); opacity:0;} to{transform: scale(1); opacity:1;} }
    .msg.bot { background: white; align-self: flex-start; border-top-left-radius: 5px; color: #333; }
    .msg.user { background: #00c300; color: white; align-self: flex-end; border-top-right-radius: 5px; }
    .read-label { font-size: 9px; color: rgba(255,255,255,0.8); position: absolute; bottom: 2px; left: -30px; }
    .input-area { background: white; padding: 10px; display: flex; align-items: center; gap: 10px; border-top: 1px solid #eee; }
    .input-area input { flex: 1; padding: 8px 15px; border-radius: 20px; border: 1px solid #ddd; outline: none; background: #f5f5f5; }
    .send-btn { color: #00c300; font-size: 20px; cursor: pointer; }
</style>
`;

const phoneHTML = `
<div id="phone-widget" class="phone-widget closed">
    <div class="chat-toggle" onclick="togglePhone()">
        <span class="notify-badge" id="notify-badge">!</span>
        💬
    </div>
    <div class="phone-screen">
        <div class="status-bar">
            <div id="status-time">12:00</div>
            <div style="display:flex; gap:5px; align-items:center;">
                <span>❤️ 5G</span>
                <span id="battery-text">100%</span>
                <div class="battery-icon"><div class="battery-level" id="battery-level"></div></div>
            </div>
        </div>
        <div class="app-header">
            <div style="font-size:20px; cursor:pointer;" onclick="togglePhone()">‹</div>
            <div>
                <div class="name" id="chat-header-name">Loading...</div>
                <div class="status" id="chat-bot-status">Offline</div>
            </div>
            <div class="call-icons">📞 📹 ☰</div>
        </div>
        <div class="chat-area" id="chat-area">
            <div class="date-divider">วันนี้</div>
        </div>
        <div class="input-area">
            <span style="font-size:24px; color:#999;">+</span>
            <input type="text" id="msg-input" placeholder="พิมพ์ข้อความ..." onkeypress="handleChatEnter(event)">
            <div class="send-btn" onclick="sendUserMessage()">➤</div>
        </div>
    </div>
</div>
`;

(function initChatWidget() {
    if (!document.getElementById('phone-widget')) {
        document.body.insertAdjacentHTML('beforeend', phoneCSS + phoneHTML);
    }
    updateStatusBar();
    setInterval(updateStatusBar, 60000);
    listenForMessages(); 
    listenForBotStatus();
})();

// ==========================================
// 2. ฟังก์ชันแชท (อัปเกรดเป็น AI)
// ==========================================

function listenForMessages() {
    const chatRef = query(ref(db, 'chat_logs'), limitToLast(50));
    onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        const chatArea = document.getElementById('chat-area');
        chatArea.innerHTML = '<div class="date-divider">วันนี้</div>'; 
        if (data) {
            Object.values(data).forEach(msg => {
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('msg', msg.sender === 'user' ? 'user' : 'bot');
                if (msg.sender === 'user') {
                    msgDiv.innerHTML = `${msg.text} <span class="read-label">Read</span>`;
                } else {
                    msgDiv.innerText = msg.text;
                }
                chatArea.appendChild(msgDiv);
            });
            scrollToBottom();
            const widget = document.getElementById('phone-widget');
            if (widget.classList.contains('closed')) {
                document.getElementById('notify-badge').style.display = 'flex';
            }
        }
    });
}

function listenForBotStatus() {
    const statusRef = ref(db, 'bot_status');
    onValue(statusRef, (snapshot) => {
        isBotActive = snapshot.val(); // อัปเดตตัวแปรจริง
        
        // เปลี่ยนชื่อ Header ตามสถานะ
        const nameDisplay = document.getElementById('chat-header-name');
        const statusDisplay = document.getElementById('chat-bot-status');
        
        if (isBotActive) {
            // โหมดบอท
            nameDisplay.innerText = CONFIG.chatSystem.botName; 
            statusDisplay.innerText = 'ตอบกลับอัตโนมัติ';
        } else {
            // โหมดคุณตอบเอง (Admin)
            nameDisplay.innerText = CONFIG.chatSystem.adminName; 
            statusDisplay.innerText = 'Online';
        }
    });
}

// 🔥 ฟังก์ชันส่งข้อความ (แก้ใหม่ให้รองรับ AI)
window.sendUserMessage = async function() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (text === "") return;

    // 1. ส่งข้อความ User
    push(ref(db, 'chat_logs'), { text: text, sender: 'user', timestamp: Date.now() });
    input.value = '';

    if (isBotActive) {
        document.getElementById('chat-bot-status').innerText = 'กำลังพิมพ์...';
        
        // 2. ให้บอทคิด (AI Thinking...)
        let reply = "";
        
        // A. เช็คใน brain.js ก่อน (กฎเหล็กของเรา)
        const localReply = getLocalSmartReply(text);
        
        if (localReply) {
            reply = localReply; // ถ้าเจอใน brain ให้ตอบอันนี้เลย
            setTimeout(() => sendBotReply(reply), 1000); // หน่วงเวลานิดนึง
        } else {
            // B. ถ้าไม่เจอ -> ให้ AI (Gemini) คิดให้
            try {
                reply = await askGeminiAI(text);
            } catch (error) {
                console.error("AI Error:", error);
                reply = "ตอนนี้สมอง AI รวนนิดหน่อยครับ รักนะ ❤️"; // คำตอบกันตาย
            }
            sendBotReply(reply);
        }
    }
};

function sendBotReply(text) {
    push(ref(db, 'chat_logs'), { text: text, sender: 'bot', timestamp: Date.now() });
}

// 🧠 ฟังก์ชันเช็ค brain.js (ของเดิม)
function getLocalSmartReply(text) {
    const cleanText = text.toLowerCase().trim();
    if (typeof window.GENERAL_BRAIN !== 'undefined') {
        for (const set of window.GENERAL_BRAIN) {
            for (const keyword of set.keywords) {
                if (cleanText.includes(keyword.toLowerCase())) {
                    const answers = set.reply;
                    return answers[Math.floor(Math.random() * answers.length)];
                }
            }
        }
    }
    return null; // ไม่เจอ
}

// 🤖 ฟังก์ชันคุยกับ AI (ของใหม่!)
async function askGeminiAI(userText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // สั่งบทบาทให้ AI (Prompt Engineering)
    const prompt = `
    คุณคือแฟนหนุ่มชื่อ "พี่หมี" ที่รักแฟนชื่อ "มิ้ว" มากๆ
    - นิสัย: อบอุ่น, ขี้เล่น, กวนตีนนิดๆ, คลั่งรัก
    - สถานะ: แฟนกันมา 1 เดือนแล้ว (ครบรอบ 21 ธ.ค.)
    - หน้าที่: ตอบแชทแฟนให้ดูเป็นธรรมชาติ สั้นๆ เหมือนคุยแชทจริง (ไม่ต้องยาวเป็นเรียงความ)
    - ข้อห้าม: ห้ามบอกว่าเป็น AI หรือหุ่นยนต์
    
    แฟนพิมพ์มาว่า: "${userText}"
    ตอบกลับแฟนว่า:
    `;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// ฟังก์ชันเสริมอื่นๆ (Utility)
window.togglePhone = function() {
    const widget = document.getElementById('phone-widget');
    widget.classList.toggle('closed');
    if (!widget.classList.contains('closed')) {
        document.getElementById('notify-badge').style.display = 'none';
        scrollToBottom();
    }
};
window.handleChatEnter = function(e) { if (e.key === 'Enter') sendUserMessage(); };
function scrollToBottom() { const c = document.getElementById('chat-area'); c.scrollTop = c.scrollHeight; }
function updateStatusBar() {
    const now = new Date();
    document.getElementById('status-time').innerText = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}
