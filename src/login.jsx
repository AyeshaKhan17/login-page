import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const demoApiUrl = 'https://run.mocky.io/v3/d43061f8-5c67-48e1-8ab2-68c6683bd243';

        const requestBody = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch(demoApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Hey! Something went wrong');
            }



            const result = await response.json();
            setMessage(`Login successful. User: ${result.data.name}, Email: ${result.data.email}`);

            navigate('/users', { state: { user: result.data } });
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
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
