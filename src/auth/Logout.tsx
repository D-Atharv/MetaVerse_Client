import React from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../../services/authService';
import { useAuth } from '../../@hooks/useAuth';

const Logout: React.FC = () => {
  const { setIsAuthenticated, setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout(); // Clear JWT cookie
    setIsAuthenticated(false); // Set auth state to false
    setToken(null); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2">
      Logout
    </button>
  );
};

export default Logout;
