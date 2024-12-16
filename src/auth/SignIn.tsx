import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../../services/authService';

const SignIn: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            const data = await signIn(username, password);
            document.cookie = `token=${data.token}; path=/`; // Set cookie
            navigate('/login'); // Redirect to login after successful sign-in
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message || 'Sign-in failed');
            } else {
                alert('An unknown error occurred');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#1E1E2F] text-gray-200">
            <form
                onSubmit={handleSignIn}
                className="bg-[#2C2C3E] p-8 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-3xl font-semibold text-center mb-6 text-white">
                    Create an Account
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
                    Sign In
                </button>
                <p className="text-center text-gray-400 mt-4 text-sm">
                    Already have an account?{' '}
                    <a
                        href="/login"
                        className="text-[#61DAFB] hover:underline transition duration-300"
                    >
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default SignIn;
