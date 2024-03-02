import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const logoutAndNavigate = () => {
        handleLogout();
        navigate('/');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <nav>
            <ul className="nav-links">
                <li onClick={() => navigate('/')}>Home</li>
                {!isLoggedIn && (
                    <>
                        <li onClick={handleLoginClick}>Login</li>
                        <li onClick={handleRegisterClick}>Register</li>
                    </>
                )}
                {isLoggedIn && <li onClick={logoutAndNavigate}>Logout</li>}
            </ul>
        </nav>
    );
};

export default Navbar;