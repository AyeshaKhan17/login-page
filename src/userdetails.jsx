import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Avatar, Dropdown, Menu, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import MenuItem from 'antd/es/menu/MenuItem';
import { LogoutOutlined } from '@ant-design/icons';
import { MenuOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;


const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://dummyjson.com/users/${id}`);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [id]);




    const items = [
        {
            key: '1',
            label: (
                <Link to="/users">
                    Users List
                </Link>
            ),
            icon: <UserOutlined />
        },
        {
            key: '2',
            label: (
                <Link to="/login">
                    Log Out
                </Link>
            ),
            icon: <LogoutOutlined />
        }
    ]


    return (
        <div className="container p-4">


            <div className='m-0 p-7 pt-7 bg-slate-200 flex justify-end pr-20 rounded-md h-20'>


                <Dropdown
                    menu={{
                        items,
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <MenuOutlined className='mr-2' />
                        Menu


                    </a>
                </Dropdown>

            </div>

            <Tabs defaultActiveKey="details" className="w-full mt-1" centered>

                <TabPane tab="General Details" key="details">


                    {
                        user ? (
                            <Card className="shadow-md w-auto">
                                <Card.Meta
                                    avatar={
                                        <Avatar
                                            src={user.image}
                                            icon={<UserOutlined />}
                                            size="large"
                                        />
                                    }
                                    title={`${user.firstName} ${user.maidenName} ${user.lastName}`}



                                    description={
                                        <div className="leading-loose">
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Age:</strong> {user.age}</p>
                                            <p><strong>Phone:</strong> {user.phone}</p>
                                            <p><strong>Gender:</strong> {user.gender}</p>
                                            <p><strong>Address:</strong> {`${user.address.address}, ${user.address.city}, ${user.address.state}, ${user.address.country}`}</p>
                                            <p><strong>State:</strong> {`${user.address.state}, ${user.address.stateCode}`}</p>
                                            <p><strong>Postal Code:</strong> {user.address.postalCode}</p>
                                            <p><strong>University:</strong> {user.university}</p>
                                        </div>
                                    }
                                />

                            </Card>
                        ) : (
                            <p className="text-center font-sans mt-60 text-xl">Testing your patience....</p>
                        )
                    }
                </TabPane>



                <TabPane tab="Bank Details" key="bank">
                    {
                        user ? (
                            <Card className="shadow-md w-auto">
                                <Card.Meta
                                    avatar={
                                        <Avatar
                                            src={user.image}
                                            icon={<UserOutlined />}
                                            size="large"
                                        />
                                    }
                                    title={`${user.firstName} ${user.maidenName} ${user.lastName}`}
                                    description={
                                        <div className="leading-loose">
                                            <p><strong>Card Expire:</strong> {user.bank.cardExpire}</p>
                                            <p><strong>Card Number:</strong> {user.bank.cardNumber}</p>
                                            <p><strong>Card Type:</strong> {user.bank.cardType}</p>
                                            <p><strong>Currency:</strong> {user.bank.currency}</p>
                                            <p><strong>IBAN:</strong> {user.bank.iban}</p>
                                        </div>
                                    }
                                />
                            </Card>
                        ) : (
                            <p className="text-center font-sans mt-60 text-xl">Testing your patience....</p>
                        )
                    }
                </TabPane>



                <TabPane tab="Company Details" key="company">
                    {
                        user ? (
                            <Card className="shadow-md w-auto">
                                <Card.Meta
                                    avatar={
                                        <Avatar
                                            src={user.image}
                                            icon={<UserOutlined />}
                                            size="large"
                                        />
                                    }
                                    title={`${user.firstName} ${user.maidenName} ${user.lastName}`}
                                    description={
                                        <div className="leading-loose">
                                            <p><strong>Company:</strong> {user.company.name}</p>
                                            <p><strong>Department:</strong> {user.company.department}</p>
                                            <p><strong>Title:</strong> {user.company.title}</p>
                                            <p><strong>Company Address:</strong> {`${user.company.address.address}, ${user.company.address.city}, ${user.company.address.state}, ${user.company.address.country}`}</p>
                                        </div>
                                    }
                                />
                            </Card>
                        ) : (
                            <p className="text-center font-sans mt-60 text-xl">Testing your patience....</p>
                        )
                    }
                </TabPane>
            </Tabs>


        </div >
    );
};

export default UserDetail;
