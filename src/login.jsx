import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = 'https://dummyjson.com/auth/login';

        const requestBody = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Invalid username or password');
            }

            const result = await response.json();
            setMessage(`Login successful. User: ${result.username}`);

            localStorage.setItem('token', result.token);
            navigate('/users', { state: { user: result } });
        } catch (error) {
            setMessage('Login failed. Error: ' + error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <Card className="w-full max-w-md shadow-lg rounded-lg bg-blue-50">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <Input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="mt-1 block w-full"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="mt-1 block w-full"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-sky-900 text-white">
                            Login
                        </Button>
                    </form>

                    {message && (
                        <p className="text-center text-sm text-green-600 mt-4">
                            {message}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
