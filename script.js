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
// 🐱 ระบบแมวเฝ้าหัวใจ (Naughty Cat AI)
// ==========================================

let catInterval;

function initNaughtyCat() {
    const catContainer = document.getElementById('cat-container');
    const catImg = document.getElementById('naughty-cat');
    const speech = document.getElementById('cat-speech');
    
    // เริ่มต้นแมวอยู่ตรงกลาง
    catContainer.style.top = '50%';
    catContainer.style.left = '50%';

    // สั่งให้แมวเริ่มเดิน
    startCatWalking();

    // เมื่อคลิกที่แมว (ไล่แมว)
    catImg.addEventListener('click', function() {
        // แมวร้อง (ใส่เสียงได้ถ้าต้องการ)
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
    // ให้แมวขยับทุกๆ 3 วินาที
    catInterval = setInterval(() => {
        const hearts = document.querySelectorAll('.hidden-heart'); // หาหัวใจทั้งหมดในจอ
        
        // 50% ให้เดินไปหาหัวใจ, 50% เดินมั่ว
        if (hearts.length > 0 && Math.random() > 0.5) {
            // เลือกหัวใจมา 1 ดวงเพื่อไปนั่งทับ
            const targetHeart = hearts[Math.floor(Math.random() * hearts.length)];
            moveCatToElement(targetHeart);
        } else {
            // เดินเล่นไปเรื่อย
            moveCatRandomly();
        }
    }, 3000);
}

function moveCatRandomly() {
    const x = Math.random() * 80 + 10; // สุ่มตำแหน่ง 10-90%
    const y = Math.random() * 80 + 10;
    moveCat(x, y);
}

function moveCatToElement(element) {
    // คำนวณตำแหน่งของหัวใจเป้าหมาย
    const rect = element.getBoundingClientRect();
    
    // แปลงเป็น % เพื่อให้เข้ากับ position fixed
    const x = (rect.left / window.innerWidth) * 100;
    const y = (rect.top / window.innerHeight) * 100;
    
    // สั่งเดินไปทับ (ปรับลบเล็กน้อยเพื่อให้ตัวแมวอยู่ตรงกลางหัวใจ)
    moveCat(x - 2, y - 5);
}

function moveCat(x, y) {
    const catContainer = document.getElementById('cat-container');
    const catImg = document.getElementById('naughty-cat');
    
    // เช็คว่าเดินไปซ้ายหรือขวา เพื่อหันหน้าแมว
    const currentLeft = parseFloat(catContainer.style.left || 50);
    
    if (x < currentLeft) {
        catImg.classList.add('flip-cat'); // หันซ้าย
    } else {
        catImg.classList.remove('flip-cat'); // หันขวา
    }

    catContainer.style.left = x + '%';
    catContainer.style.top = y + '%';
}

// เรียกใช้งานแมวตอนโหลดหน้าเว็บ
// (เพิ่มบรรทัดนี้ต่อท้าย window.onload เดิม หรือเรียกตรงนี้เลยก็ได้)
setTimeout(initNaughtyCat, 1000); // รอ 1 วิให้เว็บโหลดเสร็จค่อยปล่อยแมว
