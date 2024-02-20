import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import mongoose from 'mongoose';

export const INITIAL_USER = {
    id: "",
    username: "",
    name: "",
    email: "",
    profilePicture: "",
    bio: "",
    followers: []
};

export const INITIAL_STATE = {
    user: INITIAL_USER,
    token: '',
};

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify({
                user: action.payload.user,
                token: action.payload.token,
            }));
            return {
                user: action.payload.user,
                token: action.payload.token,
            };
        case 'LOGOUT':
            localStorage.clear();
            return { INITIAL_STATE };
        case 'UPDATE USER':
            const existingUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = action.payload;
            const updatedUserInfo = {
                ...existingUser,
                user: {
                    ...existingUser.user,
                    ...updatedUser,
                },
            };
            localStorage.setItem('user', JSON.stringify(updatedUserInfo));
            return updatedUserInfo;
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            try {
                const decodedToken = jwtDecode(user.token);
                if (!mongoose.Types.ObjectId.isValid(decodedToken?._id)) {
                    dispatch({ type: 'LOGOUT' });
                    navigate("/sign-in");
                } else {
                    dispatch({ type: 'LOGIN', payload: user });
                }
            } catch (error) {
                dispatch({ type: 'LOGOUT' });
                navigate("/sign-in");
            }
        } else {
            navigate("/sign-in");
        }
    }, []);

    console.log('AuthContext state:', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider');
    }

    return context;
};