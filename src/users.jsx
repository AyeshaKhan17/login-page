
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Pagination, PaginationItem } from './components/ui/pagination';
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { TbSortAscending } from "react-icons/tb";
import { TbSortDescending } from "react-icons/tb";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select";
import { AiFillFilter } from "react-icons/ai";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "./components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";



const Users = () => {
    const [viewType, setViewType] = useState('grid');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
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
        }, 1000);
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
        setIsSheetOpen(false);
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





    const getVisiblePageNumbers = () => {

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







    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorFn: (row) => `${row.firstName} ${row.maidenName} ${row.lastName}`,
                header: 'Name',
                enableSorting: true,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                enableSorting: true,
            },
            {
                accessorKey: 'age',
                header: 'Age',
                enableSorting: true,
            },
            {
                accessorKey: 'gender',
                header: 'Gender',
            },
            {
                accessorKey: 'address.state',
                header: 'State',
            },
            {
                header: 'Actions',
                cell: ({ row }) => (
                    <Button variant="outline" onClick={() => handleUserClick(row.original.id)}>
                        View Details
                    </Button>
                ),
            },
        ],
        []
    );





    const table = useReactTable({
        data: currentUsers,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });





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






                <div className="flex gap-5">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button onClick={() => setIsSheetOpen(true)} className="bg-slate-900 text-white">
                                <div className='flex justify-center gap-2'>
                                    <AiFillFilter className='h-5 w-5 pt-1' />
                                    {filterCount > 0 && (
                                        <span className=" text-white">
                                            ({(filterCount)})
                                        </span>
                                    )}

                                </div>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Add Filters</SheetTitle>
                                <hr />
                                <SheetDescription>
                                    <Select onValueChange={setSelectedState} value={selectedState}>
                                        <SelectTrigger className="w-[335px] mt-5">
                                            <SelectValue placeholder="Filter by State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uniqueStates.map(state => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button onClick={applyStateFilter} className=" mt-5">
                                        Apply Filter
                                    </Button>


                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>


                    <Button variant="outline" onClick={removeFilter}>
                        Reset
                    </Button>

                </div>


                <div className=" flex justify-end  sm:flex-row ">

                    <Select onValueChange={handleViewChange} value={viewType}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="grid">Grid View</SelectItem>
                            <SelectItem value="table">Table View</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


            </div>








            {isLoading ? (
                <p>Loading users...</p>
            ) : currentUsers.length > 0 ? (
                <>
                    {viewType === 'grid' ? (
                        <div className='grid grid-cols-3 gap-6  '>
                            {currentUsers.map(users => (
                                <div key={users.id} className='p-4 bg-white shaddow rounded-lg hover:shadow-lg transition'>






                                    <HoverCard>
                                        <HoverCardTrigger>

                                            <h3 className="text-lg font-semibold mb-1 cursor-pointer">
                                                {`${users.firstName} ${users.maidenName} 
                                    ${users.lastName}`}
                                            </h3>

                                        </HoverCardTrigger>
                                        <HoverCardContent>

                                            <div className='flex gap-2'>
                                                <Avatar>
                                                    <AvatarImage src={users.image} />
                                                    <AvatarFallback>image</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className='text-sm text-gray-600 '><span className='text-gray-800'>Age: </span>{users.age}</p>
                                                    <p className='text-sm text-gray-600 '><span className='text-gray-800'>Gender: </span>{users.gender}</p>
                                                    <p className='text-sm text-gray-600 '><span className='text-gray-800'>Phone: </span>{users.phone}</p>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>



                                    <p className='text-sm text-gray-600'>{users.email}</p>

                                    <p className="text-sm text-gray-600"><span className='text-gray-700'>State: </span>{users.address.state}</p>
                                    <Button variant="outline" onClick={() =>
                                        handleUserClick(users.id)}
                                        className="mt-3"
                                    > View Details</Button>


                                </div>

                            ))}

                        </div >) : (

                        <div className="table-responsive">
                            <Table className="table-auto w-full">
                                <TableHeader>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: <TbSortAscending />,
                                                        desc: <TbSortDescending />,
                                                    }[header.column.getIsSorted()] ?? null}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                    )}












                    < div className="flex justify-center mt-4">
                        <Pagination className="flex items-center space-x-2">
                            <PaginationItem
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="flex cursor-pointer items-center px-3 py-2"
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
                </>
            ) : (
                <p>No users found.</p>
            )
            }
        </div >
    );
};

export default Users;