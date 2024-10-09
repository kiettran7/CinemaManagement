// import { useEffect, useState } from "react";
// import Api, { endpoints } from "../../Api";
// import * as React from 'react';
// import { useAuthContext } from "../../Context/AuthContext";
// import { useLayoutContext } from "../../Context/LayoutContext";
// import {
//     Box,
//     CssBaseline,
//     AppBar,
//     Toolbar,
//     Typography,
//     Drawer,
//     List,
//     ListItem,
//     ListItemText,
//     Container,
//     Button,
// } from "@mui/material";

// const Slidebar = () => {
//     const [bills, setBills] = useState([]);
//     const [genres, setGenres] = useState([]);
//     const [items, setItems] = useState([]);
//     const [movies, setMovies] = useState([]);
//     const [promotions, setPromotions] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [seats, setSeats] = useState([]);
//     const [showEvents, setShowEvents] = useState([]);
//     const [showRooms, setShowRooms] = useState([]);
//     const [showSchedules, setShowSchedules] = useState([]);
//     const [showtimes, setShowtimes] = useState([]);
//     const [tags, setTags] = useState([]);
//     const [tickets, setTickets] = useState([]);
//     const [users, setUsers] = useState([]);

//     const token = localStorage.getItem("token");
//     const { currentUserInfo } = useAuthContext();
//     const { setIsLoading } = useLayoutContext(); // Giả sử bạn chỉ cần setIsLoading
//     const options = ["Users", "Movies", "Tickets", "Genres", "Items", "Bills", "Promotions", "Roles", "Seats", "Show Events", "Show Rooms", "Show Schedules", "Showtimes", "Tags"]; // Danh sách đối tượng quản lý

//     useEffect(() => {
//         const fetchAllInformation = async () => {
//             setIsLoading(true);
//             try {
//                 const responses = await Promise.all([
//                     Api.get(endpoints['bills'], { headers: { Authorization: `Bearer ${token}` } }),
//                     Api.get(endpoints['genres']),
//                     Api.get(endpoints['items']),
//                     Api.get(endpoints['movies']),
//                     Api.get(endpoints['promotions']),
//                     Api.get(endpoints['roles'], { headers: { Authorization: `Bearer ${token}` } }),
//                     Api.get(endpoints['seats']),
//                     Api.get(endpoints['show-events']),
//                     Api.get(endpoints['show-rooms']),
//                     Api.get(endpoints['show-schedules']),
//                     Api.get(endpoints['showtimes']),
//                     Api.get(endpoints['tags']),
//                     Api.get(endpoints['tickets'], { headers: { Authorization: `Bearer ${token}` } }),
//                     Api.get(endpoints['users'], { headers: { Authorization: `Bearer ${token}` } }),
//                 ]);

//                 const [
//                     resBills,
//                     resGenres,
//                     resItems,
//                     resMovies,
//                     resPromotions,
//                     resRoles,
//                     resSeats,
//                     resShowEvents,
//                     resShowRooms,
//                     resShowSchedules,
//                     resShowtimes,
//                     resTags,
//                     resTickets,
//                     resUsers,
//                 ] = responses;

//                 setBills(resBills.data?.result);
//                 setGenres(resGenres.data?.result);
//                 setItems(resItems.data?.result);
//                 setMovies(resMovies.data?.result);
//                 setPromotions(resPromotions.data?.result);
//                 setRoles(resRoles.data?.result);
//                 setSeats(resSeats.data?.result);
//                 setShowEvents(resShowEvents.data?.result);
//                 setShowRooms(resShowRooms.data?.result);
//                 setShowSchedules(resShowSchedules.data?.result);
//                 setShowtimes(resShowtimes.data?.result);
//                 setTags(resTags.data?.result);
//                 setTickets(resTickets.data?.result);
//                 setUsers(resUsers.data?.result);

//             } catch (error) {
//                 console.error("Lỗi lấy thông tin toàn bộ: ", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchAllInformation();
//     }, [setIsLoading]);

//     return (<>
//         <>
            
//         </>
//     </>);
// }

// export default Slidebar;

import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";

const Slidebar = () => {
    return (
        <List>
            <ListItem button component={Link} to="/admin/users">
                <ListItemText primary="Người dùng" />
            </ListItem>
            <ListItem button component={Link} to="/admin/movies">
                <ListItemText primary="Phim" />
            </ListItem>
            <ListItem button component={Link} to="/admin/tickets">
                <ListItemText primary="Vé" />
            </ListItem>
            <ListItem button component={Link} to="/admin/genres">
                <ListItemText primary="Thể loại" />
            </ListItem>
            <ListItem button component={Link} to="/admin/items">
                <ListItemText primary="Mặt hàng" />
            </ListItem>
            <ListItem button component={Link} to="/admin/bills">
                <ListItemText primary="Hóa đơn" />
            </ListItem>
            <ListItem button component={Link} to="/admin/promotions">
                <ListItemText primary="Khuyến mãi" />
            </ListItem>
            <ListItem button component={Link} to="/admin/roles">
                <ListItemText primary="Vai trò" />
            </ListItem>
            <ListItem button component={Link} to="/admin/seats">
                <ListItemText primary="Ghế" />
            </ListItem>
            <ListItem button component={Link} to="/admin/show-events">
                <ListItemText primary="Sự kiện" />
            </ListItem>
            <ListItem button component={Link} to="/admin/show-rooms">
                <ListItemText primary="Phòng chiếu" />
            </ListItem>
            <ListItem button component={Link} to="/admin/show-schedules">
                <ListItemText primary="Lịch chiếu" />
            </ListItem>
            <ListItem button component={Link} to="/admin/showtimes">
                <ListItemText primary="Giờ chiếu" />
            </ListItem>
            <ListItem button component={Link} to="/admin/tags">
                <ListItemText primary="Thẻ" />
            </ListItem>
        </List>
    );
};

export default Slidebar;
