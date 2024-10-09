import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import Api, { endpoints } from "../../Api";

const SeatPage = () => {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const seatsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing seat
    const [editSeat, setEditSeat] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchSeats = async () => {
            setLoading(true);
            try {
                const resSeats = await Api.get(endpoints['seats'], {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSeats(resSeats.data?.result || []);
            } catch (error) {
                console.error("Error fetching seats: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();
    }, [token]);

    // Pagination
    const indexOfLastSeat = currentPage * seatsPerPage;
    const indexOfFirstSeat = indexOfLastSeat - seatsPerPage;
    const currentSeats = seats.slice(indexOfFirstSeat, indexOfLastSeat);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Seat
    const handleDelete = async (seatId) => {
        try {
            await Api.delete(`${endpoints['seats']}/${seatId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSeats(seats.filter(seat => seat.id !== seatId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting seat: ", error);
        }
    };

    // Edit Seat
    const handleEdit = (seat) => {
        setEditSeat(seat); // Set the seat to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            const updatedSeat = {
                ...editSeat,
                showRoom: editSeat.showRoom, // Ensure showRoom is included
            };

            await Api.put(`${endpoints['seats']}/${editSeat.id}`, updatedSeat, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSeats(seats.map(seat => (seat.id === editSeat.id ? updatedSeat : seat)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating seat: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditSeat((prevSeat) => ({ ...prevSeat, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Ghế
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã ghế</TableCell>
                                    <TableCell>Tên ghế</TableCell>
                                    <TableCell>Phòng chiếu</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentSeats.map((seat) => (
                                    <TableRow key={seat.id}>
                                        <TableCell>{seat.id}</TableCell>
                                        <TableCell>{seat.seatName}</TableCell>
                                        <TableCell>{seat.showRoom?.showRoomName || "Không có"}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(seat)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(seat.id)}>Xóa</Button>
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
                            count={Math.ceil(seats.length / seatsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editSeat && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa ghế</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của ghế.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên ghế"
                                    type="text"
                                    name="seatName"
                                    value={editSeat.seatName}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Phòng chiếu"
                                    type="text"
                                    name="showRoom"
                                    value={editSeat.showRoom?.showRoomName}
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

export default SeatPage;
