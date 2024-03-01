import React, { useRef, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h2>Medical Report Summarizer</h2>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="FileInput" hidden />
      <button onClick={handleButtonClick} className="ChooseFileButton">Choose File</button>
      {fileName && <div className="FileName">Selected file: {fileName}</div>}
      {isLoading ? <div className="Loader"></div> : <button onClick={handleSubmit} className="SubmitButton">Summarize</button>}
      {summary && (
        <div className="Summary">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
