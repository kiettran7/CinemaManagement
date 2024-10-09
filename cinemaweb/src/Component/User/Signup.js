import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Style.css';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { Avatar, Box, Container, IconButton, InputAdornment, TextField, Typography, Button, Grid, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLayoutContext } from '../../Context/LayoutContext';
import Api, { endpoints } from '../../Api';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function Signup() {
    const { setIsLoading, Loading, VisuallyHiddenInput } = useLayoutContext();
    
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [email, setEmail] = useState(''); 
    const [fileName, setFileName] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const formattedBirthDate = birthday ? birthday.format('YYYY-MM-DD') : null;


    const handleClickShowPassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const checkFormNull = () => {
        const fields = [fullName, username, phone, password, rePassword, email, birthday, avatar];
        return fields.every((field) => field !== '' && field !== null);
    };

    const handleChangePassword = () => {
        if (password === '' && rePassword === '') return true;
        if (password !== rePassword) {
            setMessage('Mật khẩu không khớp. Vui lòng nhập lại!');
            setOpenSnackbar(true);
            return false;
        };
        return true;
    };

    const signUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        const isFormValid = checkFormNull();
        if (!isFormValid) {
            setMessage("Thông tin không được rỗng!");   
            setIsLoading(false);
            setOpenSnackbar(true);
            return;
        };

        const isPasswordChanged = handleChangePassword();
        if (!isPasswordChanged) {
            setIsLoading(false);
            return;
        };

        if (password !== '' && password === rePassword) {
            formData.append('password', password);
        }

        formData.append('fullName', fullName);
        formData.append('username', username);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('birthday', formattedBirthDate);
        formData.append('file', avatar);
    
        try {
            const res = await Api.post(endpoints['sign-up'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setOpenSnackbar(true);
            setMessage("Đăng ký thành công. Vui lòng chuyển sang trang đăng nhập!");
            console.log("Thành công: ", res.data);
        } catch (error) {
            setOpenSnackbar(true);
            setMessage("Đăng ký thất bại. Vui lòng thử lại!");
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    const handleAvatar = async (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (file) {
            if (validImageTypes.includes(file.type)) {
                setFileName(file.name);
                setAvatar(file);
            } else {
                setMessage('Vui lòng chọn file hình ảnh hợp lệ!');
                setOpenSnackbar(true);
                setFileName('');
            }
        }
    };

    return (
        <>
        <Box className="l-wrapper l-height">
            <Typography variant="h2" component="div" className="text-center" sx={{ pt: 5, pb: 5 }}>
                    ĐẶT VÉ NGAY HÔM NAY
            </Typography>

            <Container maxWidth="md" className="l-container l-center">
                <Box className="l-box">
                    <Avatar className="l-icon" sx={{ width: 50, height: 50 }}>
                        <LocalMoviesIcon />
                    </Avatar>

                    <Typography variant="h6" component="div" gutterBottom color="black">
                        ĐĂNG KÝ THÀNH VIÊN
                    </Typography>

                    <Box component="form" className="l-form" noValidate sx={{ '& .MuiTextField-root': { mt:4, width: '100%' } }} onSubmit={signUp}>
                        <Grid container spacing={10}>
                            <Grid item xs={6}>
                                <div>
                                    <TextField required label="Họ và tên" id="full-name" name="fullName" placeholder="Họ và tên" autoFocus
                                        onChange={(e) => setFullName(e.target.value)} />
                            
                                    <TextField required label="Tên đăng nhập" id="username" name="username" placeholder="Tên đăng nhập"
                                        onChange={(e) => setUsername(e.target.value)} />

                                    <TextField required label="Mật khẩu" id="password" name="password"  placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)}
                                        type={showPassword['password'] ? 'text' : 'password'} InputProps={{   
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton edge="end" onClick={() => handleClickShowPassword('password')} onMouseDown={handleMouseDownPassword} className="btn-scale" >
                                                    {showPassword['password'] ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            ),
                                        }} />

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="Ngày tháng năm sinh" views={['year', 'month', 'day']} name="birthday"
                                            onChange={(newDate) => setBirthday(newDate)} renderInput={(params) => <TextField {...params} />} />
                                    </LocalizationProvider> 
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div>
                                    <TextField required label="Số điện thoại" id="phone" name="phone" placeholder="Số điện thoại"
                                        onChange={(e) => setPhone(e.target.value)} />
                                    
                                    <TextField required label="Email" id="email" name="email" placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)} />
                                    
                                    <TextField required label="Xác nhận lại mật khẩu" id="re-password" name="rePassword" onChange={(e) => setRePassword(e.target.value)}
                                        placeholder="Xác nhận lại mật khẩu" type={showPassword['re-password'] ? 'text' : 'password'} InputProps={{   
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton edge="end" onClick={() => handleClickShowPassword('re-password')} onMouseDown={handleMouseDownPassword} className="btn-scale" >
                                                    {showPassword['password'] ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            ),
                                        }} />

                                    <TextField required label="Ảnh đại diện" id="avatar" name="avatar" placeholder="Ảnh đại diện" value={fileName}
                                       InputProps={{ endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton edge="end" component="label" role={undefined} tabIndex={-1} >
                                                <CloudUploadIcon />
                                                <VisuallyHiddenInput type="file" onChange={handleAvatar} />
                                            </IconButton>
                                        </InputAdornment>
                                       ) }} />
                                </div>
                            </Grid>
                        </Grid>

                        <Button type="submit" fullWidth variant="contained" className="l-btn btn-sign-up">
                            Đăng ký
                        </Button>

                        <Link to="/login">
                            <Button fullWidth variant="contained" className="l-btn btn-mt">
                                Đăng nhập
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

export default Signup;