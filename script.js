// script.js

// ฟังก์ชันหลักที่จะทำงานเมื่อโหลดหน้าเว็บเสร็จ
window.onload = function() {
    setupContent(); // ตั้งค่าข้อความ
    startTimer();   // เริ่มนับเวลา
    setupInteraction(); // ตั้งค่าปุ่มกด
// --- เพิ่มใหม่: เริ่มต้นภารกิจตามล่าหัวใจ ---
    setupHeartHunt(); 
};

// ... (ฟังก์ชัน setupContent, startTimer, setupInteraction ของเดิม คงไว้เหมือนเดิม ไม่ต้องแก้) ...
// function setupContent() { ... }
// function startTimer() { ... }
// function setupInteraction() { ... }


// --- ฟังก์ชันใหม่ด้านล่างนี้ ---

// 1. สร้างหัวใจเล็กๆ 5 ดวงแล้วซ่อนตามที่ต่างๆ
function setupHeartHunt() {
    const container = document.getElementById('heart-hunt-container');
    
    for (let i = 0; i < totalHeartsToFind; i++) {
        // สร้าง element <span> รูปหัวใจ
        const heart = document.createElement('span');
        heart.classList.add('hidden-heart');
        heart.innerText = '💖'; // หรือใช้ emoji อื่นตามชอบ

        // สุ่มตำแหน่ง (Random Position)
        // ใช้ % เพื่อให้แสดงผลได้ดีทุกหน้าจอ
        // สุ่มระหว่าง 5% ถึง 90% เพื่อไม่ให้ชิดขอบเกินไป
        const randomTop = Math.random() * 85 + 5; 
        const randomLeft = Math.random() * 85 + 5;
        heart.style.top = randomTop + '%';
        heart.style.left = randomLeft + '%';

        // เพิ่ม Event เมื่อกดหัวใจ
        heart.addEventListener('click', function() {
            collectHeart(this); // ส่งตัวหัวใจที่ถูกกดเข้าไปในฟังก์ชัน
        });

        // เอาหัวใจไปใส่ในหน้าเว็บ
        container.appendChild(heart);
    }
}

// 2. เมื่อกดหัวใจดวงเล็กๆ
function collectHeart(heartElement) {
    // ลบหัวใจดวงนั้นทิ้ง
    heartElement.remove();
    // เพิ่มคะแนน
    heartsCollected++;

    console.log(`เก็บได้ ${heartsCollected} / ${totalHeartsToFind}`);

    // เช็คว่าครบหรือยัง
    if (heartsCollected === totalHeartsToFind) {
        // ถ้าครบแล้ว เริ่มแสดงข้อความเด้งๆ!
        startFlashMessagesSequence();
    }
}


// 3. แสดงข้อความเด้งๆ ทีละข้อความ (ใช้ async/await เพื่อหน่วงเวลา)
// async function คือฟังก์ชันที่ทำงานแบบไม่ประสานเวลา (รอได้)
async function startFlashMessagesSequence() {
    const container = document.getElementById('flash-message-container');
    const messages = CONFIG.flashMessages;

    // วนลูปทีละข้อความใน config
    for (const msgText of messages) {
        
        // 3.1 สร้างกล่องข้อความ
        const box = document.createElement('div');
        box.classList.add('flash-message-box', 'pop-in'); // ใส่ class กล่อง และ class อนิเมชั่นขาเข้า
        box.innerText = msgText;

        // 3.2 สุ่มตำแหน่งที่จะโผล่
        // สุ่มให้อยู่ในโซนกลางๆ หน้าจอ (20% - 80%) จะได้อ่านง่ายๆ
        box.style.top = Math.random() * 60 + 20 + '%';
        box.style.left = Math.random() * 60 + 20 + '%';
        
        // ใส่กล่องลงหน้าเว็บ
        container.appendChild(box);

        // 3.3 >>> รอ 4.5 วินาที <<< (ให้เวลาอ่าน)
        // new Promise(r => setTimeout(r, 4500)) คือคำสั่งให้โปรแกรมหยุดรอ
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 3.4 เปลี่ยน animation เป็นขาออก (Fade out)
        box.classList.remove('pop-in');
        box.classList.add('pop-out');

        // 3.5 >>> รออีก 0.5 วินาที <<< (รอให้ animation ขาออกเล่นจบ)
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3.6 ลบกล่องทิ้ง
        box.remove();
        
        // (จบลูป แล้ววนไปทำข้อความถัดไปทันที)
    }
}

let heartsCollected = 0;
const totalHeartsToFind = 9; // จำนวนหัวใจที่ซ่อนอยู่

// 1. ฟังก์ชันดึงค่าจาก Config มาแสดง (แยกส่วนแก้ไขออกจากโค้ด)
function setupContent() {
    // เปลี่ยนสีพื้นหลังตามที่ตั้งใน config
    document.body.style.backgroundColor = CONFIG.colors.background;
    
    // ใส่ข้อความลงใน HTML ตาม ID
    document.getElementById('headline').innerText = CONFIG.headline;
    document.getElementById('footerText').innerText = CONFIG.coupleNames;
}

// 2. ฟังก์ชันคำนวณเวลา (Time Together Counter)
function startTimer() {
    const startDate = new Date(CONFIG.anniversaryDate).getTime();

    // ใช้ setInterval เพื่ออัปเดตเวลาทุกๆ 1 วินาที (1000 ms)
    setInterval(function() {
        const now = new Date().getTime();
        const distance = now - startDate;

        // สูตรคำนวณ วัน ชม. นาที
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // แสดงผล
        document.getElementById('timer').innerText = 
            `${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วิ`;
    }, 1000);
}

// 3. ฟังก์ชันสุ่มข้อความ (Random Message Generator)
function setupInteraction() {
    const button = document.getElementById('heartButton');
    const display = document.getElementById('messageDisplay');

    button.addEventListener('click', function() {
        // ดึงรายการข้อความจาก config
        const messages = CONFIG.loveMessages;
        
        // สุ่มเลข index (0 ถึง จำนวนข้อความ - 1)
        const randomIndex = Math.floor(Math.random() * messages.length);
        
        // แสดงข้อความที่สุ่มได้
        display.innerText = messages[randomIndex];
        
        // เปลี่ยนสีข้อความเล็กน้อยให้ดูมีชีวิตชีวา
        display.style.color = CONFIG.colors.text;
    });
}