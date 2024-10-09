import { Box, Typography } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Slidebar from "./Slidebar";
import BillPage from "./BillPage";
import TicketPage from "./TicketPage";
import GenrePage from "./GenrePage";
import ItemPage from "./ItemPage";
import MoviePage from "./MoviePage";
import PromotionPage from "./PromotionPage";
import RolePage from "./RolePage";
import SeatPage from "./SeatPage";
import ShowEventPage from "./ShowEventPage";
import ShowRoomPage from "./ShowRoomPage";
import ShowSchedulePage from "./ShowSchedulePage";
import ShowtimePage from "./ShowtimePage";
import TagPage from "./TagPage";
import UserPage from "./UserPage";

const AdminPage = () => {
    return (
        <Box display="flex">
            {/* Thanh bên */}
            <Box sx={{ width: '20%', bgcolor: '#f5f5f5' }}>
                <Slidebar />
            </Box>

            {/* Nội dung chính */}
            <Box sx={{ width: '80%', p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Quản Trị Hệ Thống
                </Typography>

                {/* Các trang con */}
                <Routes>
                    <Route path="/admin/bills" element={<BillPage />} />
                    <Route path="/admin/tickets" element={<TicketPage />} />
                    <Route path="/admin/genres" element={<GenrePage />} />
                    <Route path="/admin/items" element={<ItemPage />} />
                    <Route path="/admin/movies" element={<MoviePage />} />
                    <Route path="/admin/promotions" element={<PromotionPage />} />
                    <Route path="/admin/roles" element={<RolePage />} />
                    <Route path="/admin/seats" element={<SeatPage />} />
                    <Route path="/admin/show-events" element={<ShowEventPage />} />
                    <Route path="/admin/show-rooms" element={<ShowRoomPage />} />
                    <Route path="/admin/show-schedules" element={<ShowSchedulePage />} />
                    <Route path="/admin/showtimes" element={<ShowtimePage />} />
                    <Route path="/admin/tags" element={<TagPage />} />
                    <Route path="/admin/users" element={<UserPage />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default AdminPage;
