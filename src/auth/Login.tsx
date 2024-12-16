import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../../services/authService';
import { useAuth } from '../../@hooks/useAuth';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setIsAuthenticated, setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            const data = await login(username, password);
            setToken(data.token); // Store the token
            document.cookie = `token=${data.token}; path=/`; // Set cookie
            setIsAuthenticated(true); // Update authentication state
            navigate('/game'); // Redirect to protected page
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message || 'Login failed');
            } else {
                alert('An unknown error occurred');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#1E1E2F] text-gray-200">
            <form
                onSubmit={handleLogin}
                className="bg-[#2C2C3E] p-8 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-3xl font-semibold text-center mb-6 text-white">
                    Welcome Back
                </h2>
                <input
                    type="text"
                    className="w-full p-3 rounded-md bg-[#3B3B50] border border-[#52527E] placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6161F5] mb-4"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full p-3 rounded-md bg-[#3B3B50] border border-[#52527E] placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6161F5] mb-6"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full p-3 rounded-md bg-[#6161F5] hover:bg-[#4F4FD9] text-white font-medium transition duration-300"
                >
                    Login
                </button>
                <p className="text-center text-gray-400 mt-4 text-sm">
                    Don't have an account?{' '}
                    <a
                        href="/signin"
                        className="text-[#61DAFB] hover:underline transition duration-300"
                    >
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
