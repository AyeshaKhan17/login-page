import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Input } from 'antd';
import { Button } from 'antd';
import { Card } from 'antd';
import { Form } from 'antd';
import { Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginPage = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const { username, password } = values;
        const url = 'https://dummyjson.com/auth/login';

        const requestBody = {
            username: username,
            password: password,
        };


        setLoading(true);
        setTimeout(() => setLoading(false), 1000);


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
            navigate('/users', { state: { user: result } }); //use navigate after login 
        } catch (error) {
            setMessage('Login failed. Error: ' + error.message);
        }
    };

    //to submit the form successfully use onFinish instead of onSubmit when using antd

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">

            <Card className="w-full max-w-md shadow-lg rounded-lg bg-blue-50">
                <div className='text-center'>
                    <Title level={2}>Login</Title>
                </div>


                <Form onFinish={handleSubmit} layout="vertical">

                    <Form.Item label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}>

                        <Input placeholder="Enter your username"
                            prefix=<UserOutlined /> />
                    </Form.Item>


                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}>

                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>



                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Login
                    </Button>
                </Form>




                {message && (
                    <p className="text-center text-sm text-green-600 mt-4">
                        {message}
                    </p>
                )}
            </Card>
        </div>
    );
};

export default LoginPage;
