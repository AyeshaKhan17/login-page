
import React, { useEffect, useState, useMemo } from 'react';
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


const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState(''); // State filter
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [filterCount, setFilterCount] = useState(0);
    const usersPerPage = 10;
    const navigate = useNavigate();


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





    const uniqueStates = useMemo(() => {
        const states = users.map(user => user.address.state);
        return [...new Set(states)];
    }, [users]);


    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredUsers(users);
            return;
        }
        const searchResults = users.filter((user) =>
            (`${user.firstName} ${user.maidenName} ${user.lastName}`).toLowerCase().includes(searchTerm.toLowerCase())
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full sm:w-80"
                />
                <Button onClick={handleSearch} className="mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto">
                    Search
                </Button>






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
            </div>








            {isLoading ? (
                <p>Loading users...</p>
            ) : currentUsers.length > 0 ? (
                <>
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

                    <div className="flex justify-center mt-4">
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
            )}
        </div>
    );
};

export default Users;