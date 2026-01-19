// letter-script.js

window.onload = function() {
    // 1. ดึงข้อความ deepMessage จาก config มาใส่ในจดหมาย
    const letterBody = document.getElementById('letterBody');
    // ใช้ innerHTML เพราะในข้อความเรามี <br> (HTML tag)
    letterBody.innerHTML = CONFIG.deepMessage;

    // 2. ตั้งค่าการกดปุ่มเปิดซอง
    setupEnvelopeOpening();
};

function setupEnvelopeOpening() {
    const envelope = document.getElementById('envelope');
    const openBtn = document.getElementById('openBtn');
    const backBtn = document.getElementById('backBtn');

    // เมื่อกดที่หัวใจ
    openBtn.addEventListener('click', function() {
        // เติม class ชื่อ 'open' เข้าไปที่ตัวซอง
        // CSS จะเห็น class นี้แล้วเริ่มทำการย้ายของต่างๆ
        envelope.classList.add('open');

        // แสดงปุ่มกลับหน้าหลัก (ลบ class hidden ออก)
        backBtn.classList.remove('hidden');
    });
}