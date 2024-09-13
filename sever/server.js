const express = require('express');
const multer = require('multer');  // สำหรับจัดการการอัปโหลดไฟล์
const { exec } = require('child_process');  // ใช้เพื่อเรียกคำสั่ง JMeter
const app = express();

// ตั้งค่าการอัปโหลดไฟล์โดยใช้ Multer
const upload = multer({ dest: 'uploads/' });

// กำหนด endpoint สำหรับรับข้อมูลจาก React
app.post('/api/test', upload.single('file'), (req, res) => {
  const { choice, url } = req.body;  // รับค่าจากฟอร์ม URL หรือ file
  let jmeterCommand = '';

  // กรณีเลือกส่ง URL
  if (choice === 'url') {
    jmeterCommand = `jmeter -n -t test.jmx -Jurl=${url}`;
  } 
  // กรณีเลือกอัปโหลดไฟล์
  else if (choice === 'file' && req.file) {
    jmeterCommand = `jmeter -n -t test.jmx -JfilePath=${req.file.path}`;
  }

  // เรียกคำสั่ง JMeter ผ่าน exec
  exec(jmeterCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing JMeter: ${error}`);
      return res.status(500).send('Error executing JMeter');
    }
    res.send(`JMeter Output: ${stdout}`);
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
