import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,

    DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { HiMenu } from "react-icons/hi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";




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

    return (

        <div className="container  p-4">


            <div className='m-0 p-7 pt-3 bg-slate-200 flex justify-end pr-20 rounded-md h-20'>



                <DropdownMenu >
                    <DropdownMenuTrigger className='flex p-5 gap-2 text-xl'><HiMenu className='h-7 w-7' />  Menu</DropdownMenuTrigger>
                    <DropdownMenuContent>


                        <DropdownMenuItem asChild>
                            <Link to="/users">User List</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link to="/login">Logout</Link>
                        </DropdownMenuItem>


                    </DropdownMenuContent>
                </DropdownMenu>
            </div>



            <Tabs defaultValue="details" className="w-full mt-1">
                <TabsList>
                    <TabsTrigger value="details">General Details</TabsTrigger>
                    <TabsTrigger value="bank">Bank Details</TabsTrigger>
                    <TabsTrigger value="company">Company Details</TabsTrigger>
                </TabsList>
                <TabsContent value="details">


                    {
                        user ? (
                            <Card className="shadow-md w-auto">
                                <CardHeader>
                                    <div className='flex gap-6 justify-center'>
                                        <Avatar>
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="font-mono tracking-wide text-gray-700 text-2xl text-center ">{user.firstName} {user.maidenName} {user.lastName}</CardTitle>
                                    </div>

                                </CardHeader>
                                <CardContent className="leading-loose ">
                                    <p><strong>Email: </strong> {user.email}</p>
                                    <p><strong>Age:  </strong>{user.age}</p>
                                    <p><strong>Phone:  </strong>{user.phone}</p>
                                    <p><strong>Gender:  </strong>{user.gender}</p>
                                    <p><strong>Address:  </strong>{user.address.address}, {user.address.city}, {user.address.state}, {user.address.country}</p>
                                    <p><strong>State: </strong>{user.address.state}, {user.address.stateCode}</p>
                                    <p><strong>Postal Code : </strong>{user.address.postalCode} </p>
                                    <p><strong>University:  </strong>{user.university}</p>

                                </CardContent >
                            </Card >
                        ) : (
                            <p className=" text-center font-sans mt-60 text-xl">Testing your patience....</p>
                        )
                    }



                </TabsContent>
                <TabsContent value="bank">

                    {
                        user ? (
                            <Card className="shadow-md w-auto">
                                <CardHeader>
                                    <div className='flex gap-6 justify-center'>
                                        <Avatar>
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="font-mono tracking-wide text-gray-700 text-2xl text-center ">{user.firstName} {user.maidenName} {user.lastName}</CardTitle>
                                    </div>

                                </CardHeader>
                                <CardContent className="leading-loose ">
                                    <p><strong>Card Expire: </strong> {user.bank.cardExpire}</p>
                                    <p><strong>Card Number:  </strong>{user.bank.cardNumber}</p>
                                    <p><strong>Card Type:  </strong>{user.bank.cardType}</p>
                                    <p><strong>Currency:  </strong>{user.bank.currency}</p>
                                    <p><strong>iban:  </strong>{user.bank.iban}</p>

                                </CardContent >
                            </Card >
                        ) : (
                            <p className=" text-center font-sans mt-60 text-xl">Testing your patience....</p>
                        )
                    }
                </TabsContent>

                <TabsContent value="company">
                    {
                        user ? (
                            <Card className="shadow-md w-auto">
                                <CardHeader>
                                    <div className='flex gap-6 justify-center'>
                                        <Avatar>
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="font-mono tracking-wide text-gray-700 text-2xl text-center ">{user.firstName} {user.maidenName} {user.lastName}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="leading-loose ">
                                    <p><strong>Company:  </strong>{user.company.name}</p>
                                    <p><strong>Department:  </strong>{user.company.department}</p>
                                    <p><strong>Title:  </strong>{user.company.title}</p>
                                    <p><strong>Company Address:  </strong>{user.company.address.address}, {user.company.address.city}, {user.company.address.state}, {user.company.address.country}</p>
                                </CardContent >
                            </Card >
                        ) : (
                            <p className=" text-center font-sans mt-60 text-xl">Testing your patience....</p>
                        )
                    }

                </TabsContent>
            </Tabs>






        </div >
    );
};

export default UserDetail;




/* "id": 1,
            "firstName": "Emily",
            "lastName": "Johnson",
            "maidenName": "Smith",
            "age": 28,
            "gender": "female",
            "email": "emily.johnson@x.dummyjson.com",
            "phone": "+81 965-431-3024",
            "username": "emilys",
            "password": "emilyspass",
            "birthDate": "1996-5-30",
            "image": "https://dummyjson.com/icon/emilys/128",
            "bloodGroup": "O-",
            "height": 193.24,
            "weight": 63.16,
            "eyeColor": "Green",
            "hair": {
                "color": "Brown",
                "type": "Curly"
            },
            "ip": "42.48.100.32",
            "address": {
                "address": "626 Main Street",
                "city": "Phoenix",
                "state": "Mississippi",
                "stateCode": "MS",
                "postalCode": "29112",
                "coordinates": {
                    "lat": -77.16213,
                    "lng": -92.084824
                },
                "country": "United States"
            },
            "macAddress": "47:fa:41:18:ec:eb",
            "university": "University of Wisconsin--Madison",
            "bank": {
                "cardExpire": "03/26",
                "cardNumber": "9289760655481815",
                "cardType": "Elo",
                "currency": "CNY",
                "iban": "YPUXISOBI7TTHPK2BR3HAIXL"
            },
            "company": {
                "department": "Engineering",
                "name": "Dooley, Kozey and Cronin",
                "title": "Sales Manager",
                "address": {
                    "address": "263 Tenth Street",
                    "city": "San Francisco",
                    "state": "Wisconsin",
                    "stateCode": "WI",
                    "postalCode": "37657",
                    "coordinates": {
                        "lat": 71.814525,
                        "lng": -161.150263
                    },
                    "country": "United States"
                }
            },
            "ein": "977-175",
            "ssn": "900-590-289",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
            "crypto": {
                "coin": "Bitcoin",
                "wallet": "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
                "network": "Ethereum (ERC20)"
            },
            "role": "admin"*/