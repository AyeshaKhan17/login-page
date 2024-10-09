import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Pagination, PaginationItem } from './components/ui/pagination';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const usersPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`https://dummyjson.com/users?limit=100`);
                const data = await response.json();
                setUsers(data.users);
                setFilteredUsers(data.users);
                setTotalUsers(data.total);
            } catch (error) {
                console.error('Cannot fetch:', error);
            }
        };

        fetchUsers();
    }, []);




    const handleSearch = () => {
        const searchResults = users.filter((user) =>
            (`${user.firstName} ${user.maidenName} ${user.lastName}`).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(searchResults);
        setCurrentPage(1);
    };

    const handleUserClick = (id) => {
        navigate(`/users/${id}`);
    };

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const getVisiblePageNumbers = () => {
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };


    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    return (
        <div className="container mx-auto p-10 bg-slate-100">
            <h1 className="text-4xl font-bold text-center mb-6 mt-6 font-mono tracking-wide text-gray-700">Users</h1>


            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search users by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-80"
                />
                <Button
                    onClick={handleSearch}
                    className="ml-7"
                >
                    Search
                </Button>
            </div>



            {currentUsers.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {currentUsers.map((user) => (
                        <Card key={user.id} className="shadow-md hover:bg-slate-300 transition">
                            <CardHeader>
                                <CardTitle className='font-mono tracking-wide text-gray-700 text-xl mb-0 pl-8'>
                                    {user.firstName} {user.maidenName} {user.lastName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-20 pl-10">
                                <img src={user.image} alt="user image" className='mt-0 mb-3 h-24 w-24' />
                                <div>
                                    <p>ID: {user.id}</p>
                                    <p>Email: {user.email}</p>
                                    <p>Age: {user.age}</p>
                                    <p>Phone: {user.phone}</p>
                                    <p>Gender: {user.gender}</p>
                                    <p>Date of Birth: {user.birthDate}</p>

                                    <Button variant="outline" className="mt-2 ml" onClick={() => handleUserClick(user.id)}>
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}



                    <div className="flex justify-center mt-4">
                        <Pagination className="flex items-center space-x-2">
                            <PaginationItem
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                                <FaAngleLeft />
                            </PaginationItem>

                            {getVisiblePageNumbers().map((pageNumber) => (
                                <PaginationItem
                                    key={pageNumber}
                                    active={currentPage === pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`flex cursor-pointer items-center px-3 py-2 ${currentPage === pageNumber ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                                >
                                    {pageNumber}
                                </PaginationItem>
                            ))}

                            <PaginationItem
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="flex cursor-pointer items-center px-3 py-2"
                            >
                                <FaAngleRight />
                            </PaginationItem>
                        </Pagination>
                    </div>
                </div>
            ) : (
                <p>Testing your patience...</p>
            )}
        </div>
    );
};

export default Users;
