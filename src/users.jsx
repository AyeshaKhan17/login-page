import React from 'react';
import { useLocation } from 'react-router-dom';

const Users = () => {
    const location = useLocation();
    const user = location.state?.user;

    return (
        <div className="user-details text-center mt-20">
            {user ? (
                <div>
                    <h1 className='text-lg font-sans font-medium'>User Details</h1>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default Users;
