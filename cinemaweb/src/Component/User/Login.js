import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Style.css';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { Avatar, Box, Container, IconButton, InputAdornment, TextField, Typography, Button, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useLayoutContext } from '../../Context/LayoutContext';
import { useAuthContext } from '../../Context/AuthContext';


function Login() {
    const { setIsLoading, Loading } = useLayoutContext();
    const { fetchAccessToken, fetchCurrentUserInfo } = useAuthContext();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const navigate = useNavigate();

    const handleClickShowPassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const login = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const { username, password } = e.target; 
    
        try {
            const resToken = await fetchAccessToken(username.value, password.value);
            const token = resToken;
            console.log(token);
            
            localStorage.setItem("token", token);
            navigate('/dashboard');
        } catch (error) {
            setOpenSnackbar(true);
            setMessage("Đăng nhập thất bại. Vui lòng thử lại!");
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <>
        <Box className="l-wrapper">
            <Typography variant="h2" component="div" className="text-center p-30">
                ĐẶT VÉ NGAY HÔM NAY
            </Typography>

            <Container maxWidth="sm" className="l-center p-30">
                <Box className="l-box">
                    <Avatar className="l-icon" sx={{ width: 50, height: 50 }}>
                        <LocalMoviesIcon />
                    </Avatar>

                    <Typography variant="h6" component="div" gutterBottom color="black">
                        ĐĂNG NHẬP
                    </Typography>

                    <Box component="form" className="l-form" noValidate sx={{ '& .MuiTextField-root': { mt:4, width: '40ch' } }} onSubmit={login}>
                        <div>
                            <TextField required label="Tên đăng nhập" id="username" name="username" placeholder="Tên đăng nhập"
                                autoFocus InputProps={{ startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                )}} />
                        </div>

                        <div>
                            <TextField required label="Mật khẩu" id="password" name="password"  placeholder="Mật khẩu"
                                type={showPassword['password'] ? 'text' : 'password'} InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end" onClick={() => handleClickShowPassword('password')} onMouseDown={handleMouseDownPassword} className="btn-scale" >
                                            {showPassword['password'] ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }} />
                        </div>

                        <Button type="submit" fullWidth variant="contained" className="l-btn">
                            Đăng nhập
                        </Button>

                        <Link to="/sign-up">
                            <Button fullWidth variant="contained" className="l-btn btn-sign-up btn-mt">
                                Đăng ký
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Container>

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}
                message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />

            <Loading />
        </Box>
        </>
    );
};

export default Login;