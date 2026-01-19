// login.js

document.getElementById('loginBtn').addEventListener('click', checkPassword);

// เพิ่มฟังก์ชันให้กด Enter แล้วล็อกอินได้เลย (UX ที่ดี)
document.getElementById('passInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function checkPassword() {
    // 1. ดึงค่าที่มิ้วพิมพ์เข้ามา
    const input = document.getElementById('passInput').value;
    
    // 2. ดึงรหัสที่ถูกต้องจาก Config
    const correctPassword = CONFIG.passcode;
    
    // 3. ตรวจสอบความถูกต้อง
    if (input === correctPassword) {
        // ถ้ารหัสถูก -> ไปหน้าหลัก (index.html)
        // window.location.href คือคำสั่งเปลี่ยนหน้าเว็บด้วย JS
        window.location.href = "index.html"; 
    } else {
        // ถ้ารหัสผิด -> แจ้งเตือนน่ารักๆ
        const errorText = document.getElementById('errorText');
        errorText.innerText = "รหัสผิดง่ะ! ลองใหม่อีกทีนะคนเก่ง 😝";
        
        // สั่นกล่อง input นิดหน่อย (Optional: เพิ่มลูกเล่น)
        const inputField = document.getElementById('passInput');
        inputField.style.borderColor = "red";
        setTimeout(() => {
            inputField.style.borderColor = "#ffcccc";
        }, 500);
    }
}