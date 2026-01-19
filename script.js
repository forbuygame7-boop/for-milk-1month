// script.js (Clean Version)

// ตัวแปร global
let heartsCollected = 0;
const totalHeartsToFind = 9; // จำนวนหัวใจที่จะให้หา

window.onload = function() {
    setupContent();      // ตั้งค่าข้อความ
    startTimer();        // เริ่มนับเวลา
    setupInteraction();  // ปุ่มกดหัวใจกลางจอ
    setupHeartHunt();    // เริ่มเกมตามล่าหัวใจเล็กๆ
};

function setupContent() {
    document.body.style.backgroundColor = CONFIG.colors.background;
    document.getElementById('headline').innerText = CONFIG.headline;
    document.getElementById('footerText').innerText = CONFIG.coupleNames;
}

function startTimer() {
    const startDate = new Date(CONFIG.anniversaryDate).getTime();
    setInterval(function() {
        const now = new Date().getTime();
        const distance = now - startDate;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('timer').innerText = 
            `${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วิ`;
    }, 1000);
}

function setupInteraction() {
    const button = document.getElementById('heartButton');
    const display = document.getElementById('messageDisplay');
    button.addEventListener('click', function() {
        const messages = CONFIG.loveMessages;
        const randomIndex = Math.floor(Math.random() * messages.length);
        display.innerText = messages[randomIndex];
        display.style.color = CONFIG.colors.text;
    });
}

// ฟังก์ชันสร้างหัวใจเล็กๆ
function setupHeartHunt() {
    const container = document.getElementById('heart-hunt-container');
    for (let i = 0; i < totalHeartsToFind; i++) {
        const heart = document.createElement('span');
        heart.classList.add('hidden-heart');
        heart.innerText = '💖';
        
        // สุ่มตำแหน่ง
        const randomTop = Math.random() * 85 + 5; 
        const randomLeft = Math.random() * 85 + 5;
        heart.style.top = randomTop + '%';
        heart.style.left = randomLeft + '%';

        heart.addEventListener('click', function() {
            collectHeart(this);
        });
        container.appendChild(heart);
    }
}

function collectHeart(heartElement) {
    heartElement.remove();
    heartsCollected++;
    // console.log(`เก็บได้ ${heartsCollected} / ${totalHeartsToFind}`); // เช็คใน console ได้
    
    if (heartsCollected === totalHeartsToFind) {
        startFlashMessagesSequence();
    }
}

async function startFlashMessagesSequence() {
    const container = document.getElementById('flash-message-container');
    const messages = CONFIG.flashMessages;

    for (const msgText of messages) {
        const box = document.createElement('div');
        box.classList.add('flash-message-box', 'pop-in');
        box.innerText = msgText;
        
        box.style.top = Math.random() * 60 + 20 + '%';
        box.style.left = Math.random() * 60 + 20 + '%';
        
        container.appendChild(box);

        await new Promise(resolve => setTimeout(resolve, 3000)); // รอ 3 วิให้อ่านทัน
        
        box.classList.remove('pop-in');
        box.classList.add('pop-out');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        box.remove();
    }

}

// ==========================================
// 🐱 ระบบแมวเฝ้าหัวใจ (Updated for CSS Sprite)
// ==========================================

function initNaughtyCat() {
    const catContainer = document.getElementById('cat-container');
    // เปลี่ยน id เป็นตัวใหม่
    const catSprite = document.getElementById('naughty-cat-sprite');
    const speech = document.getElementById('cat-speech');

    if (!catContainer || !catSprite) return; // ป้องกัน Error ถ้าหาไม่เจอ

    // เริ่มต้นให้เดินเข้ามาจากนอกจอ
    setTimeout(() => {
        moveCatRandomly();
    }, 500);

    // สั่งให้แมวเริ่มเดินอัตโนมัติ
    startCatWalking();

    // เมื่อคลิกที่แมว (ไล่แมว)
    catSprite.addEventListener('click', function() {
        speech.innerText = "เมี๊ยว! อย่าจับเค้า 😾";
        speech.classList.remove('hidden');
        
        // แมวตกใจหนีไปที่อื่นทันที
        moveCatRandomly();
        
        setTimeout(() => {
            speech.classList.add('hidden');
        }, 1500);
    });
}

function startCatWalking() {
    // ให้แมวขยับทุกๆ 3.5 วินาที (ปรับเวลาให้สัมพันธ์กับความเร็วเดินใน CSS)
    setInterval(() => {
        const hearts = document.querySelectorAll('.hidden-heart');
        
        // 60% เดินไปหาหัวใจ, 40% เดินเล่น
        if (hearts.length > 0 && Math.random() > 0.4) {
            const targetHeart = hearts[Math.floor(Math.random() * hearts.length)];
            moveCatToElement(targetHeart);
        } else {
            moveCatRandomly();
        }
    }, 3500);
}

function moveCatRandomly() {
    // สุ่มตำแหน่งที่ปลอดภัย (ไม่ชิดขอบเกินไป)
    const x = Math.random() * 70 + 15; 
    const y = Math.random() * 70 + 15;
    moveCat(x, y);
}

function moveCatToElement(element) {
    if(!element) return;
    const rect = element.getBoundingClientRect();
    // แปลงตำแหน่งหัวใจเป็น %
    const x = (rect.left / window.innerWidth) * 100;
    const y = (rect.top / window.innerHeight) * 100;
    // เดินไปทับ (ปรับตำแหน่งให้แมวอยู่กึ่งกลางหัวใจพอดี)
    moveCat(x - 2.5, y - 3);
}

function moveCat(x, y) {
    const catContainer = document.getElementById('cat-container');
    const catSprite = document.getElementById('naughty-cat-sprite');
    
    // เช็คทิศทางเพื่อหันหน้าแมว
    const currentLeft = parseFloat(catContainer.style.left || 50);
    if (x < currentLeft) {
        catSprite.classList.add('flip-cat'); // หันซ้าย
    } else {
        catSprite.classList.remove('flip-cat'); // หันขวา
    }

    catContainer.style.left = x + '%';
    catContainer.style.top = y + '%';
}

// เรียกใช้งาน
setTimeout(initNaughtyCat, 1000);
