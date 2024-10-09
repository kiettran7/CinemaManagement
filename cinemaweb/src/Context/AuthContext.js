import React, { createContext, useContext, useEffect, useState } from 'react';
import Api, { endpoints } from '../Api';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLayoutContext } from './LayoutContext';
import { Nav } from 'react-bootstrap';


const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const { isLoading, setIsLoading } = useLayoutContext();

    const [currentUserInfo, setCurrentUserInfo] = useState({});
    const [token, setToken] = useState('');
    const nav = useNavigate();

    // Lấy access token từ api
    const fetchAccessToken = async (username, password) => {
        try {
            const apiResponse = await Api.post(endpoints['log-in'], {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const token = apiResponse.data.result.token;
            localStorage.setItem('token', token);
            setToken(token);
            
            return token;
        } catch (error) {
            console.error("Lỗi lấy token: ", error);
            throw error;
        };
    };

    // Gọi api current-user để lấy thông tin người dùng từ database
    const fetchCurrentUserInfo = async (token) => {
        try {
            const infoResponse = await Api.get(endpoints['current-user'], {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return infoResponse.data.result;
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng: ", error);
            throw error;
        };
    };

    // Logout
    const handleLogOut = async () => {
        try {
            const infoResponse = await Api.post(endpoints['log-out'], {
                "token": localStorage.getItem("token")
            });

            localStorage.removeItem("token");
            localStorage.removeItem("currentUserInfo");

            return <Navigate to="/dashboard" />

            return infoResponse.data.result;
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng: ", error);
            throw error;
        };
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;

            setIsLoading(true);

            try {
                const info = await fetchCurrentUserInfo(token);

                setCurrentUserInfo(info);
                localStorage.setItem('currentUserInfo', JSON.stringify(info));

                //
                
                //

            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng: ", error);
            } finally {
                setIsLoading(false);
            };
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        const savedUserInfo = localStorage.getItem('currentUserInfo');
    
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        }
    
        if (savedUserInfo) {
            setCurrentUserInfo(JSON.parse(savedUserInfo));
        }
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            const resGenres = await Api.get(endpoints['genres']);
            localStorage.setItem("genreList", JSON.stringify(resGenres.data.result) || [])
        }
        fetchGenres()
    }, []);
    
    return (
        <AuthContext.Provider value={{ currentUserInfo, setCurrentUserInfo, fetchAccessToken, fetchCurrentUserInfo, handleLogOut,  }} >
            { children }
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);