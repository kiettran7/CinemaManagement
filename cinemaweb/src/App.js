import './App.css';
import Api, { endpoints } from "./Api";
import React, { useState } from 'react';
import { AppBar, Button, Container, Toolbar, useScrollTrigger, CssBaseline, styled, alpha, InputBase, Box, Typography, Stack, Menu, MenuItem, Fade, Avatar, IconButton } from "@mui/material";
import { Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import HomePage from './Component/User/Home';
import LoginPage from './Component/User/Login';
import SignupPage from './Component/User/Signup';
import AccountPage from './Component/User/Account';
import SearchIcon from '@mui/icons-material/Search';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import BuyTicketPage from './Component/User/BuyTicket';
import { useAuthContext } from './Context/AuthContext';
import Slidebar from './Component/Admin/Sidebar';
import AdminPage from './Component/Admin/Sidebar';
import BillPage from './Component/Admin/BillPage';
import TicketPage from './Component/Admin/TicketPage';
import GenrePage from './Component/Admin/GenrePage';
import ItemPage from './Component/Admin/ItemPage';
import MoviePage from './Component/Admin/MoviePage';
import PromotionPage from './Component/Admin/PromotionPage';
import RolePage from './Component/Admin/RolePage';
import SeatPage from './Component/Admin/SeatPage';
import ShowEventPage from './Component/Admin/ShowEventPage';
import ShowRoomPage from './Component/Admin/ShowRoomPage';
import ShowSchedulePage from './Component/Admin/ShowSchedulePage';
import ShowtimePage from './Component/Admin/ShowtimePage';
import TagPage from './Component/Admin/TagPage';
import UserPage from './Component/Admin/UserPage';
import BillDetails from './Component/User/BillDetails';
import ChatComponent from './ChatRealTime';

function ElevationScroll(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
        style: {
            backgroundColor: trigger ? '#191b21' : 'rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s',
        },
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

function App(props) {
    const { currentUserInfo, setCurrentUserInfo, handleLogOut } = useAuthContext();

    const navigate = useNavigate();

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        document.body.classList.add('menu-open');
    };

    const handleClose = () => {
        setAnchorEl(null);
        document.body.classList.remove('menu-open');
    };

    const logout = async () => {
        setCurrentUserInfo(null);
        const infoResponse = await Api.post(endpoints['log-out'], {
            "token": localStorage.getItem("token")
        });

        localStorage.removeItem("token");
        localStorage.removeItem("currentUserInfo");
        navigate("/dashboard");
    }

    return (
        <>
            <CssBaseline />
            <ElevationScroll {...props}>
                <AppBar position='fixed' className="header">
                    <Container maxWidth="lg">
                        <Toolbar style={{ padding: 0 }} className='text-center'>
                            <Box component="logo" sx={{ p: 1, width: '150px' }}>
                                <Link to="/dashboard" underline="none">
                                    <img className='header-height' alt="Logo"
                                        src="https://i.pinimg.com/originals/f1/30/f9/f130f9773716f8c688005c24dd41404d.png" />
                                </Link>
                            </Box>

                            <Box component="navbar" sx={{ p: 1, flexGrow: 1 }}>
                                <Button color="inherit" className='header-height btn-header-width'>
                                    LỊCH CHIẾU
                                </Button>

                                <Button color="inherit" className='header-height btn-header-width'>
                                    ƯU ĐÃI
                                </Button>

                                {currentUserInfo &&
                                    currentUserInfo.roles &&
                                    currentUserInfo.roles.length > 0 &&
                                    currentUserInfo.roles[0].name === "ADMIN" &&
                                    <Link to={"/admin"}>
                                        <Button color="inherit" className='header-height btn-header-width'>
                                            QUẢN TRỊ
                                        </Button>
                                    </Link>
                                }

                                {currentUserInfo &&
                                    currentUserInfo.roles &&
                                    currentUserInfo.roles.length > 0 &&
                                    currentUserInfo.roles[0].name === "STAFF" &&
                                    <Link to={"/staff"}>
                                        <Button color="inherit" className='header-height btn-header-width'>
                                            XEM XÉT VÉ
                                        </Button>
                                    </Link>
                                }

                                <Button color="inherit" className='header-height btn-header-width'>
                                    <DropdownButton id="dropdown-button" title="THỂ LOẠI">
                                        {(() => {
                                            const genreData = localStorage.getItem("genreList");
                                            let genreList = [];
                                            if (genreData) {
                                                try {
                                                    genreList = JSON.parse(genreData);
                                                    console.log(genreList)
                                                } catch (error) {
                                                    console.error("Error parsing genre list:", error);
                                                }
                                            }
                                            return genreList.map((genre) => (
                                                <Dropdown.Item key={genre.id} href="#" className='dropdown-item'>
                                                    {genre.genreName}
                                                </Dropdown.Item>
                                            ));
                                        })()}
                                    </DropdownButton>
                                </Button>


                            </Box>

                            <Box component="search" sx={{ mr: 3 }}>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                                </Search>
                            </Box>

                            {currentUserInfo ? (
                                <>
                                    <IconButton onClick={handleClick} sx={{ p: 0 }}>
                                        <Avatar alt="My Avatar" src={currentUserInfo.avatar} />
                                    </IconButton>

                                    <Menu id="fade-menu" MenuListProps={{ 'aria-labelledby': 'fade-button', }} anchorEl={anchorEl}
                                        open={open} onClose={handleClose} TransitionComponent={Fade} >
                                        <MenuItem component={Link} to="/account" onClick={handleClose}>Thông tin tài khoản</MenuItem>
                                        <MenuItem component={Link} to="/bill" onClick={handleClose}>Hoá đơn đã đặt</MenuItem>
                                        <MenuItem onClick={logout}>Đăng xuất</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Link to="/login">
                                    <Button color="inherit" variant="outlined" className='btn-member header-height'>
                                        THÀNH VIÊN
                                    </Button>
                                </Link>
                            )}
                        </Toolbar>

                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                                borderColor: 'lightblue',
                                color: 'white',
                                position: 'fixed',
                                bottom: 16,
                                right: 16,
                                zIndex: 1000,
                                padding: '12px 24px',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease-in-out',
                                boxShadow: '0px 4px 20px rgba(173, 216, 230, 0.5)',
                                animation: 'backgroundChange 4s infinite alternate, colorChange 1s infinite alternate, scaleChange 1.5s infinite alternate',
                                '&:hover': {
                                    borderColor: 'deepskyblue',
                                    color: 'deepskyblue',
                                    backgroundColor: 'rgba(173, 216, 230, 0.3)',
                                    boxShadow: '0px 8px 30px rgba(173, 216, 230, 0.7)',
                                },
                            }}
                            component={Link}
                            to="/chat"
                        >
                            Chat Realtime
                        </Button>
                    </Container>
                </AppBar>
            </ElevationScroll>

            <Toolbar />

            <Routes>
                <Route exact path="/dashboard" Component={HomePage} />
                <Route path="/login" Component={LoginPage} />
                <Route path="/sign-up" Component={SignupPage} />
                <Route path="/admin" Component={AdminPage} />
                <Route path="/admin/bills" Component={BillPage} />
                <Route path="/admin/tickets" Component={TicketPage} />
                <Route path="/admin/genres" Component={GenrePage} />
                <Route path="/admin/items" Component={ItemPage} />
                <Route path="/admin/movies" Component={MoviePage} />
                <Route path="/admin/promotions" Component={PromotionPage} />
                <Route path="/admin/roles" Component={RolePage} />
                <Route path="/admin/seats" Component={SeatPage} />
                <Route path="/admin/show-events" Component={ShowEventPage} />
                <Route path="/admin/show-rooms" Component={ShowRoomPage} />
                <Route path="/admin/show-schedules" Component={ShowSchedulePage} />
                <Route path="/admin/showtimes" Component={ShowtimePage} />
                <Route path="/admin/tags" Component={TagPage} />
                <Route path="/admin/users" Component={UserPage} />

                {currentUserInfo ? (
                    <>
                        <Route path="/account" Component={AccountPage} />
                        <Route path="/buy-ticket/*" Component={BuyTicketPage} />
                        <Route path="/bill" Component={BillDetails} />
                        <Route path="/chat" Component={ChatComponent} />
                    </>

                ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                )}

                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>

            <footer className="footer">
                <Container maxWidth="lg">
                    <Box component="copyright">
                        <Typography variant="body1" color="textSecondary" align="center" className="text-white mb-20">
                            Copyright ©2024, KLH Cinema
                        </Typography>
                    </Box>

                    <Box component="social">
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <img width="48" height="48" src="https://img.icons8.com/color/48/facebook-new.png" alt="facebook-new" />
                            <img width="48" height="48" src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="instagram-new--v1" />
                            <img width="48" height="48" src="https://img.icons8.com/color/48/tiktok--v1.png" alt="tiktok--v1" />
                            <img width="48" height="48" src="https://img.icons8.com/color/48/youtube-play.png" alt="youtube-play" />
                        </Stack>
                    </Box>
                </Container>
            </footer>
        </>
    );
};

export default App;