
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { Pagination } from 'antd';
import { Table } from 'antd';
import { Select } from "antd";
import { AiFillFilter } from "react-icons/ai";
import { Avatar } from "antd";
import { Drawer } from "antd";
import { Popover } from "antd";



const Users = () => {
    const [viewType, setViewType] = useState('grid');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    //const [sorting, setSorting] = useState([]);        no use
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [filterCount, setFilterCount] = useState(0);
    const usersPerPage = 12;
    const navigate = useNavigate();
    const debounceTimeout = useRef(null);


    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://dummyjson.com/users?limit=100`);
                const data = await response.json();
                setUsers(data.users);
                setFilteredUsers(data.users);
                setTotalUsers(data.total);
            } catch (error) {
                console.error('Cannot fetch:', error);
            }
            setIsLoading(false);
        };

        fetchUsers();
    }, []);



    const handleViewChange = (view) => {
        setViewType(view);
    };




    const uniqueStates = useMemo(() => {
        const states = users.map(user => user.address.state);
        return [...new Set(states)];
    }, [users]);





    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            handleSearch(value);
        }, 600);
    };

    const handleSearch = (value) => {
        if (!value.trim()) {
            setFilteredUsers(users);
            return;
        }
        const searchResults = users.filter((user) =>
            (`${user.firstName} ${user.maidenName} ${user.lastName}`).toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(searchResults);
        setCurrentPage(1);
    };




    const applyStateFilter = () => {
        const filtered = selectedState ? users.filter(user => user.address.state === selectedState) : users;
        setFilteredUsers(filtered);
        setCurrentPage(1);
        setDrawerVisible(false);
        setFilterCount(selectedState ? 1 : 0);
    };

    const removeFilter = () => {
        setSelectedState('');
        setFilteredUsers(users);
        setCurrentPage(1);
        setFilterCount(0);
    };

    const handleUserClick = (id) => {
        navigate(`/users/${id}`);
    };

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);





    const getVisiblePageNumbers = () => {         //not included

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const currentUsers = useMemo(() =>
        filteredUsers.slice(
            (currentPage - 1) * usersPerPage,
            currentPage * usersPerPage
        ),
        [filteredUsers, currentPage, usersPerPage]
    );







    const columns = [

        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },

        {
            title: 'Name',
            key: 'name',
            sorter: true,
            render: (_, record) => `${record.firstName} ${record.maidenName} ${record.lastName}`
        },

        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true
        },

        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            sorter: true
        },

        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender'
        },

        {
            title: 'State',
            dataIndex: ['address', 'state'],
            key: 'state'
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => handleUserClick(record.id)}>View Details</Button>
            )
        }
    ];




    /* const table = useReactTable({
         data: currentUsers,
         columns,
         state: { sorting },
         onSortingChange: setSorting,
         getCoreRowModel: getCoreRowModel(),
         getSortedRowModel: getSortedRowModel(),
     });*/





    return (
        <div className="container mx-auto p-10 bg-slate-100">
            <h1 className="text-4xl font-bold text-center mb-6 mt-4 font-mono tracking-wide text-gray-700">Users</h1>

            <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-5">
                <input
                    type="text"
                    placeholder="Search users by name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="p-2 border border-gray-300 rounded-md w-full sm:w-80"
                />

                <Button onClick={() =>
                    setDrawerVisible(true)}
                    className="bg-slate-900 text-white">

                    <AiFillFilter className="mr-2" />
                    {filterCount > 0 && `(${filterCount})`}

                </Button>





                <Drawer
                    title="Filter by State"
                    placement="right"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                >
                    <Select
                        className="w-full"
                        placeholder="Select a state"
                        value={selectedState}
                        onChange={setSelectedState}
                        options={uniqueStates.map((state) => ({
                            label: state,
                            value: state,
                        }))}
                    />
                    <Button type="primary" onClick={applyStateFilter} className="mt-4">
                        Apply Filter
                    </Button>
                </Drawer>


                <Button onClick={removeFilter}>

                    Reset

                </Button>

            </div>


            <div className="flex justify-end mb-4">
                <Select
                    value={viewType}
                    defaultValue="grid"
                    className="w-60"
                    onChange={handleViewChange}
                    options={[
                        {
                            value: 'grid',
                            label: 'Grid View',
                        },
                        {
                            value: 'table',
                            label: 'Table View',
                        }
                    ]}
                />
            </div>





            {isLoading ? (
                <p>Loading users...</p>
            ) : viewType === 'grid' ? (
                <div className="grid grid-cols-3 gap-6">
                    {currentUsers.map((user) => (
                        <div key={user.id} className="p-4 bg-white shadow rounded-lg">

                            <Popover
                                content={

                                    <div className='flex gap-2'>
                                        <Avatar src={user.image} />
                                        <div>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4  '>Email: </span>{user.email}</p>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4'>Age: </span>{user.age}</p>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4'>Gender: </span>{user.gender}</p>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4'>Phone: </span>{user.phone}</p>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4'>Address: </span>{user.address.address}, {user.address.city}, {user.address.state}, {user.address.country}</p>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4'>State: </span>{user.address.state}, {user.address.stateCode}</p>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4'>Postal Code: </span>{user.address.postalCode}</p>
                                            <p className='text-sm text-gray-600 '><span className='text-gray-800 font-medium leading-4'>University: </span>{user.university}</p>

                                        </div>
                                    </div>

                                }
                                title="Details"
                                trigger="hover"
                            >
                                <h3>{`${user.firstName} ${user.maidenName} ${user.lastName}`}</h3>
                            </Popover>

                            <p>{user.email}</p>
                            <Button onClick={() => handleUserClick(user.id)}>View Details</Button>
                        </div>
                    ))}
                </div>
            ) : (
                <Table columns={columns} dataSource={currentUsers} pagination={true} />
            )}





            <div className="flex justify-center mt-4">
                <Pagination
                    current={currentPage}
                    total={filteredUsers.length}
                    pageSize={usersPerPage}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                />
            </div>


        </div >
    );
};

export default Users;