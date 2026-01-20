// chat-core.js (Version: Memory Enhanced + Milk Persona 🧠💖)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, limitToLast, get } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// --- Config Firebase ---
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
let GEMINI_API_KEY = ""; 

// --- ดึงกุญแจจาก Firebase ---
const keyRef = ref(db, 'gemini_api_key'); 
onValue(keyRef, (snapshot) => {
    const key = snapshot.val();
    if (key) GEMINI_API_KEY = key;
});

// ==========================================
// 1. ส่วน UI (หน้าจอมือถือ) - เหมือนเดิม
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
// 2. ฟังก์ชันแชท (Logic)
// ==========================================

function listenForMessages() {
    const chatRef = query(ref(db, 'chat_logs'), limitToLast(50));
    onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        const chatArea = document.getElementById('chat-area');
        chatArea.innerHTML = '<div class="date-divider">วันนี้</div>'; 
        if (data) {
            Object.values(data).forEach(msg => {
                if (msg.sender === 'admin_error') return; // ซ่อน Error

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
        isBotActive = snapshot.val(); 
        const nameDisplay = document.getElementById('chat-header-name');
        const statusDisplay = document.getElementById('chat-bot-status');
        
        if (isBotActive) {
            nameDisplay.innerText = "พี่หมี (AI)"; 
            statusDisplay.innerText = 'ตอบกลับอัตโนมัติ';
        } else {
            nameDisplay.innerText = "เค้าเอง (Admin)"; 
            statusDisplay.innerText = 'Online';
        }
    });
}

// 🔥 ฟังก์ชันส่งข้อความ (อัปเกรดระบบความจำ)
window.sendUserMessage = async function() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (text === "") return;

    // 1. ส่งข้อความ User
    push(ref(db, 'chat_logs'), { text: text, sender: 'user', timestamp: Date.now() });
    input.value = '';

    if (isBotActive) {
        document.getElementById('chat-bot-status').innerText = 'กำลังพิมพ์...';
        
        // A. เช็ค Brain ก่อน (ถ้ามีก็ตอบเลย ไม่ต้องถาม AI)
        const localReply = getLocalSmartReply(text);
        if (localReply) {
            setTimeout(() => sendBotReply(localReply), 1000); 
            return;
        }

        if (!GEMINI_API_KEY) {
            console.error("❌ Key not loaded");
            return;
        }

        // 🧠 B. ระบบความจำ (ดึง 10 ข้อความล่าสุดมาประกอบร่าง)
        try {
            // ดึงแชทเก่าจาก Firebase
            const historySnapshot = await get(query(ref(db, 'chat_logs'), limitToLast(10)));
            let historyContext = "";
            
            historySnapshot.forEach((child) => {
                const msg = child.val();
                if (msg.sender !== 'admin_error') {
                    const role = msg.sender === 'user' ? 'มิ้ว(แฟน)' : 'พี่หมี(คุณ)';
                    historyContext += `${role}: ${msg.text}\n`;
                }
            });

            // ส่งให้ AI ประมวลผล
            const aiReply = await askGeminiAI(text, historyContext);
            sendBotReply(aiReply);

        } catch (error) {
            push(ref(db, 'chat_logs'), { 
                text: `🚫 AI Error: ${error.message}`, 
                sender: 'admin_error', 
                timestamp: Date.now() 
            });
            // Fallback
            sendBotReply("รักนะครับ (เน็ตพี่หมีกระตุกนิดนึง)"); 
        }
    }
};

function sendBotReply(text) {
    push(ref(db, 'chat_logs'), { text: text, sender: 'bot', timestamp: Date.now() });
}

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
    return null; 
}

// 🤖 ฟังก์ชันคุยกับ AI (รับ History มาด้วย)
async function askGeminiAI(userText, historyContext) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // Prompt ที่ปรับแต่งให้รู้จักมิ้ว
    const prompt = `
    Roleplay: คุณคือแฟนหนุ่มชื่อ "พี่หมี" กำลังคุยกับแฟนชื่อ "มิ้ว"
    Character: อบอุ่น, กวนตีนนิดๆ, ขี้เล่น, คลั่งรัก, ขี้หึงหน่อยๆ
    Objective: ตอบกลับสั้นๆ เหมือนแชทกันจริงๆ และ "ชวนคุยต่อ" เสมอ

    ข้อมูลแฟน (มิ้ว):
    - นิสัย: น่ารักตลอดเวลา
    - สิ่งที่เกลียด: ผัก (ห้ามชวนกินผัก)
    - วันเกิด: 27 สิงหาคม 2006
    - สรรพนามที่คุณเรียกแฟน: "อ้วน" (ปกติ), "เธอ", "มิ้ว", "หนู" (ใช้นานๆทีตอนอ้อน)

    Chat History (บทสนทนาก่อนหน้า):
    ${historyContext}

    มิ้วพิมพ์มาว่า: "${userText}"
    พี่หมีตอบกลับ (ไม่ต้องใส่ชื่อนำหน้า):
    `;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("No response from AI candidates");
    }
}

// Utility
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

