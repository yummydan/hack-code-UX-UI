import React, { useState } from 'react';
import './App.css';

function App() {
  const [choice, setChoice] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);

  const handleChoiceChange = (event) => {
    setChoice(event.target.value);
    setUrl('');
    setFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('choice', choice);  // ส่งข้อมูลการเลือก (URL หรือไฟล์)
    
    if (choice === 'url' && url) {
      formData.append('url', url);      // กรณีเป็น URL
    } else if (choice === 'file' && file) {
      formData.append('file', file);    // กรณีเป็นไฟล์
    } else {
      alert('Please select an option and provide the required information.');
      return;
    }
  
    try {
      const response = await fetch('/api/test', {  // ส่งข้อมูลไปยัง API ปลายทาง
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.text();  // รับผลลัพธ์จากเซิร์ฟเวอร์
        alert(result);
      } else {
        alert('Error: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit form.');
    }
  };

  return (
    <div>
      <h2>Choose to Submit URL or Upload a File</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="choice">Choose an option:</label>
        <select id="choice" value={choice} onChange={handleChoiceChange} required>
          <option value="">--Select--</option>
          <option value="url">Submit URL</option>
          <option value="file">Upload File</option>
        </select>

        {/* Input for URL */}
        {choice === 'url' && (
          <div>
            <label htmlFor="url">Enter URL:</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        )}

        {/* Input for File Upload */}
        {choice === 'file' && (
          <div>
            <label htmlFor="file">Upload Document:</label>
            <input
              type="file"
              id="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
