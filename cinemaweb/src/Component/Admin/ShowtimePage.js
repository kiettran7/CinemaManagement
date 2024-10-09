import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Api, { endpoints } from "../../Api";

const ShowtimePage = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const showtimesPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing showtime
    const [editShowtime, setEditShowtime] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchShowtimes = async () => {
            setLoading(true);
            try {
                const resShowtimes = await Api.get(endpoints['showtimes'], { headers: { Authorization: `Bearer ${token}` } });
                setShowtimes(resShowtimes.data?.result || []);
            } catch (error) {
                console.error("Error fetching showtimes: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, [token]);

    // Pagination
    const indexOfLastShowtime = currentPage * showtimesPerPage;
    const indexOfFirstShowtime = indexOfLastShowtime - showtimesPerPage;
    const currentShowtimes = showtimes.slice(indexOfFirstShowtime, indexOfLastShowtime);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Showtime
    const handleDelete = async (showtimeId) => {
        try {
            await Api.delete(`${endpoints['showtimes']}/${showtimeId}`, { headers: { Authorization: `Bearer ${token}` } });
            setShowtimes(showtimes.filter(showtime => showtime.id !== showtimeId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting showtime: ", error);
        }
    };

    // Edit Showtime
    const handleEdit = (showtime) => {
        setEditShowtime(showtime); // Set the showtime to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated showtime data
            const updatedShowtime = {
                ...editShowtime,
                startTime: editShowtime.startTime,
                endTime: editShowtime.endTime
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['showtimes']}/${editShowtime.id}`, updatedShowtime, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the state after saving
            setShowtimes(showtimes.map(showtime => (showtime.id === editShowtime.id ? updatedShowtime : showtime)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating showtime: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditShowtime((prevShowtime) => ({ ...prevShowtime, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Giờ Chiếu
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Thời gian Bắt đầu</TableCell>
                                    <TableCell>Thời gian Kết thúc</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentShowtimes.map((showtime) => (
                                    <TableRow key={showtime.id}>
                                        <TableCell>{showtime.id}</TableCell>
                                        <TableCell>{showtime.startTime}</TableCell>
                                        <TableCell>{showtime.endTime}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(showtime)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(showtime.id)}>Xóa</Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Pagination 
                            count={Math.ceil(showtimes.length / showtimesPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editShowtime && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Giờ Chiếu</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của giờ chiếu.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Thời gian Bắt đầu"
                                    type="time"
                                    name="startTime"
                                    value={editShowtime.startTime}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Thời gian Kết thúc"
                                    type="time"
                                    name="endTime"
                                    value={editShowtime.endTime}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenEditDialog(false)} color="primary">
                                    Hủy
                                </Button>
                                <Button onClick={handleSaveEdit} color="primary">
                                    Lưu
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </>
            )}
        </Container>
    );
};

export default ShowtimePage;
