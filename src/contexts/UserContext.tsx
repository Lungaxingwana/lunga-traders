'use client'
import { User } from '@/data-types/user';
import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the shape of the context
interface UserContextProps {
    user: User;
    setUser: (user : User) => void;

    allUsers: User[];
    setAllUsers: (allUsers : User[]) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextProps | undefined>({
    user: {
        _id: '',
        username: '',
        email: '',
        password: '',
        role: '',
        person: {
            first_name: '',
            last_name: '',
            gender: '',
            address: '',
            cell_number: '',
            profile_picture: '',
        },
    },
    setUser: () => {},
    allUsers: [],
    setAllUsers: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({
        _id: '',
        username: '',
        email: '',
        password: '',
        role: '',
        person: {
            first_name: '',
            last_name: '',
            gender: '',
            address: '',
            cell_number: '',
            profile_picture: '',
        },
    });

    const [allUsers, setAllUsers] = useState<User[]>([{
        _id: '',
        username: '',
        email: '',
        password: '',
        role: '',
        person: {
            first_name: '',
            last_name: '',
            gender: '',
            address: '',
            cell_number: '',
            profile_picture: '',
        },
    }]);

    return (
        <UserContext.Provider value={{ user, setUser, allUsers, setAllUsers}}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the CartContext
export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
