// script.js (Dynamic Heart Game ❤️)

let heartsCollected = 0;
// ลบค่าคงที่ทิ้ง แล้วไปดึงจาก CONFIG แทนในฟังก์ชัน setupHeartHunt

window.onload = function() {
    // รอแป๊บนึงให้ Config โหลดเสร็จก่อนเริ่มเกม
    setTimeout(() => {
        setupContent();      
        startTimer();        
        setupInteraction();  
        setupHeartHunt(); // เริ่มเกมล่าหัวใจ
    }, 1000); // รอ 1 วินาที (เพื่อให้ Firebase ส่งค่ามาทัน)
};

function setupContent() {
    if(window.applyTheme) window.applyTheme(); // เรียกใช้ฟังก์ชันเปลี่ยนสีจาก config.js
    
    if(document.getElementById('headline')) 
        document.getElementById('headline').innerText = window.CONFIG.headline || "Happy Anniversary";
    
    if(document.getElementById('footerText'))
        document.getElementById('footerText').innerText = window.CONFIG.coupleNames || "Pat & Milk";
}

function startTimer() {
    const startDate = new Date(window.CONFIG.anniversaryDate || "2025-12-21").getTime();
    setInterval(function() {
        const now = new Date().getTime();
        const distance = now - startDate;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const timerEl = document.getElementById('timer');
        if(timerEl) timerEl.innerText = `${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วิ`;
    }, 1000);
}

function setupInteraction() {
    const button = document.getElementById('heartButton');
    const display = document.getElementById('messageDisplay');
    if(button) {
        button.addEventListener('click', function() {
            const messages = window.CONFIG.loveMessages || ["รักนะ"];
            const randomIndex = Math.floor(Math.random() * messages.length);
            display.innerText = messages[randomIndex];
        });
    }
}

// 🔥 ฟังก์ชันสร้างหัวใจ (แบบ Dynamic ตามค่า Admin)
function setupHeartHunt() {
    const container = document.getElementById('heart-hunt-container');
    if(!container) return;
    
    container.innerHTML = ''; // ล้างของเก่าก่อน
    heartsCollected = 0; // รีเซ็ตแต้ม

    // ดึงจำนวนหัวใจจาก Config (ถ้าไม่มีใช้ 9)
    const totalHearts = (window.CONFIG.game && window.CONFIG.game.maxHearts) ? window.CONFIG.game.maxHearts : 9;
    
    console.log("🎮 เริ่มเกมล่าหัวใจ: มีทั้งหมด " + totalHearts + " ดวง");

    for (let i = 0; i < totalHearts; i++) {
        const heart = document.createElement('span');
        heart.classList.add('hidden-heart');
        heart.innerText = '💖';
        
        const randomTop = Math.random() * 80 + 10; 
        const randomLeft = Math.random() * 90 + 5;
        heart.style.top = randomTop + '%';
        heart.style.left = randomLeft + '%';

        heart.addEventListener('click', function() {
            collectHeart(this, totalHearts); // ส่งจำนวนเต็มไปด้วย
        });
        container.appendChild(heart);
    }
}

function collectHeart(heartElement, totalNeeded) {
    heartElement.remove();
    heartsCollected++;
    
    if (heartsCollected >= totalNeeded) {
        startFlashMessagesSequence();
    }
}

async function startFlashMessagesSequence() {
    const container = document.getElementById('flash-message-container');
    const messages = window.CONFIG.flashMessages || ["ยินดีด้วย!"];

    for (const msgText of messages) {
        const box = document.createElement('div');
        box.classList.add('flash-message-box', 'pop-in');
        box.innerText = msgText;
        
        box.style.top = Math.random() * 60 + 20 + '%';
        box.style.left = Math.random() * 60 + 20 + '%';
        
        container.appendChild(box);

        await new Promise(resolve => setTimeout(resolve, 3000));
        
        box.classList.remove('pop-in');
        box.classList.add('pop-out');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        box.remove();
    }
}
// ==========================================
// 🐱 ระบบแมวเฝ้าหัวใจ (เวอร์ชั่นแมวโค้ด CSS)
// ==========================================

function initNaughtyCat() {
    const catContainer = document.getElementById('cat-container');
    // เปลี่ยนจาก cat-sprite เป็น cat-body
    const catBody = document.getElementById('naughty-cat-body'); 
    const speech = document.getElementById('cat-speech');

    if (!catContainer || !catBody) return; 

    // เริ่มต้นให้เดินเข้ามา
    setTimeout(() => {
        moveCatRandomly();
    }, 1000);

    // สั่งให้แมวเดินทุกๆ 3.5 วิ
    setInterval(() => {
        const hearts = document.querySelectorAll('.hidden-heart');
        
        // 60% เดินไปกวนหัวใจ, 40% เดินเล่น
        if (hearts.length > 0 && Math.random() > 0.4) {
            const targetHeart = hearts[Math.floor(Math.random() * hearts.length)];
            moveCatToElement(targetHeart);
        } else {
            moveCatRandomly();
        }
    }, 3500);

    // เมื่อคลิกที่แมว (ไล่แมว)
    catBody.addEventListener('click', function() {
        speech.innerText = "เมี๊ยว! อย่าจับเค้า 😾";
        speech.classList.remove('hidden');
        
        // แมวตกใจหนีไปที่อื่น
        moveCatRandomly();
        
        setTimeout(() => {
            speech.classList.add('hidden');
        }, 1500);
    });
}

function moveCatRandomly() {
    const x = Math.random() * 70 + 15; 
    const y = Math.random() * 70 + 15;
    moveCat(x, y);
}

function moveCatToElement(element) {
    if(!element) return;
    const rect = element.getBoundingClientRect();
    const x = (rect.left / window.innerWidth) * 100;
    const y = (rect.top / window.innerHeight) * 100;
    // ปรับตำแหน่งให้ทับพอดี
    moveCat(x - 2, y - 2);
}

function moveCat(x, y) {
    const catContainer = document.getElementById('cat-container');
    const catBody = document.getElementById('naughty-cat-body');
    
    // หันหน้าแมว
    const currentLeft = parseFloat(catContainer.style.left || 50);
    if (x < currentLeft) {
        catBody.classList.add('flip-cat'); // หันซ้าย
    } else {
        catBody.classList.remove('flip-cat'); // หันขวา
    }

    catContainer.style.left = x + '%';
    catContainer.style.top = y + '%';
}

// เรียกใช้งาน
setTimeout(initNaughtyCat, 1000);

// ==========================================
// 🌸 ระบบสร้างหัวใจร่วง (Background Effect)
// ==========================================

function createFallingHearts() {
    const heartCount = 30; // จำนวนหัวใจ (ยิ่งเยอะยิ่งฟุ้ง แตระวังเครื่องค้าง)
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.innerHTML = '❤'; // หรือจะเปลี่ยนเป็น 🌸 ก็ได้นะ
        
        // สุ่มตำแหน่งเริ่มต้น (แนวนอน)
        heart.style.left = Math.random() * 100 + 'vw';
        
        // สุ่มความเร็ว (3 ถึง 8 วินาที)
        const duration = Math.random() * 5 + 3;
        heart.style.animationDuration = duration + 's';
        
        // สุ่มขนาด (10px ถึง 25px)
        const size = Math.random() * 15 + 10;
        heart.style.fontSize = size + 'px';
        
        // สุ่มความจาง (0.3 ถึง 0.7)
        heart.style.opacity = Math.random() * 0.4 + 0.3;
        
        // สำคัญ! สุ่มเวลาเริ่ม (จะได้ไม่ตกลงมาพร้อมกันเป็นก้อน)
        // ใช้ค่าติดลบเพื่อให้มันเหมือนตกลงมาอยู่แล้วตั้งแต่เปิดเว็บ
        heart.style.animationDelay = (Math.random() * -20) + 's';
        
        document.body.appendChild(heart);
    }
}

// สั่งรันทันที
createFallingHearts();

// ==========================================
// 📸 ระบบแกลเลอรี่ (Dynamic Gallery)
// ==========================================

// ฟังก์ชันวาดรูป (เรียกใช้โดย config.js)
window.renderGallery = function() {
    const grid = document.querySelector('.polaroid-grid');
    if (!grid) return;

    // 1. เคลียร์ของเก่าทิ้งให้หมด
    grid.innerHTML = '';

    // 2. ดึงข้อมูลรูปจาก Config (ถ้าไม่มี ให้ใช้ array ว่าง)
    const photos = window.CONFIG.gallery || [];

    if (photos.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">ยังไม่มีรูป... ไปเพิ่มใน Admin นะครับ</p>';
        return;
    }

    // 3. วนลูปสร้างรูปทีละใบ
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        // สุ่มเอียงซ้ายขวาให้ดูเก๋ๆ
        const rotateClass = index % 2 === 0 ? 'rotate-left' : 'rotate-right';
        
        item.className = `polaroid-item ${rotateClass}`;
        item.innerHTML = `
            <img src="${photo.url}" alt="Photo">
            <p>${photo.caption}</p>
        `;
        
        grid.appendChild(item);
    });
};

function setupGallery() {
    const modal = document.getElementById('gallery-modal');
    const btn = document.getElementById('galleryBtn');
    const span = document.getElementById('closeGallery');

    // เปิด
    if(btn) btn.onclick = function() {
        modal.classList.add('show');
        renderGallery(); // วาดรูปใหม่ทุกครั้งที่เปิด เพื่อความชัวร์
    }

    // ปิด
    if(span) span.onclick = function() { modal.classList.remove('show'); }
    window.onclick = function(event) {
        if (event.target == modal) modal.classList.remove('show');
    }
}

// เรียกใช้งานครั้งแรก
setupGallery();
