import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            if (response.status === 200) {
                console.log("Login successful:", response.data.message);
                onLoginSuccess();
                navigate('/');
            }
        } catch (error) {
            const message = error.response ? error.response.data.error : error.message;
            console.error("Registration error:", message);
            setErrorMessage(message);
        }
    };

    return (
        <div className="ContentContainer">
            <form onSubmit={handleSubmit} className="LoginForm">
                <h2>Login</h2>
                <div>
                    <label>Username: </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {errorMessage && <div className="ErrorMessage">*{errorMessage}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;