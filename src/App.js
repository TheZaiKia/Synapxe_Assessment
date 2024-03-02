import React, { useRef, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logout');
      if (response.status === 200) {
        setIsLoggedIn(false);
      } else {
        console.error("Logout failed:", response.data.error);
      }
    } catch (error) {
      console.error("Logout error:", error.response ? error.response.data.error : error.message);
    }
  };

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
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate replace to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate replace to="/" /> : <Register />} />
          <Route path="/" element={
            !isLoggedIn ? <Navigate replace to="/login" /> : (
              <div className="ContentContainer">
                <h2>Medical Report Summarizer</h2>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="FileInput" hidden />
                {isLoading ? <div className="Loader"></div> : <div className="ButtonContainer">
                  <button onClick={handleButtonClick} className="ChooseFileButton">Choose File</button>
                  <button onClick={handleSubmit} className="SubmitButton">Summarize</button>
                </div>}
                {fileName && <div className="FileName">Selected file: {fileName}</div>}
                {summary && (
                  <div className="Summary">
                    <h3>Summary</h3>
                    <p>{summary}</p>
                  </div>
                )}
              </div>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;