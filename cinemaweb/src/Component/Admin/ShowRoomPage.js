import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Api, { endpoints } from "../../Api";

const ShowRoomPage = () => {
    const [showRooms, setShowRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const showRoomsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing show room
    const [editShowRoom, setEditShowRoom] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchShowRooms = async () => {
            setLoading(true);
            try {
                const resShowRooms = await Api.get(endpoints['show-rooms'], { headers: { Authorization: `Bearer ${token}` } });
                setShowRooms(resShowRooms.data?.result || []);
            } catch (error) {
                console.error("Error fetching show rooms: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShowRooms();
    }, [token]);

    // Pagination
    const indexOfLastShowRoom = currentPage * showRoomsPerPage;
    const indexOfFirstShowRoom = indexOfLastShowRoom - showRoomsPerPage;
    const currentShowRooms = showRooms.slice(indexOfFirstShowRoom, indexOfLastShowRoom);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Show Room
    const handleDelete = async (showRoomId) => {
        try {
            await Api.delete(`${endpoints['show-rooms']}/${showRoomId}`, { headers: { Authorization: `Bearer ${token}` } });
            setShowRooms(showRooms.filter(showRoom => showRoom.id !== showRoomId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting show room: ", error);
        }
    };

    // Edit Show Room
    const handleEdit = (showRoom) => {
        setEditShowRoom(showRoom); // Set the show room to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated show room data
            const updatedShowRoom = {
                ...editShowRoom,
                showRoomName: editShowRoom.showRoomName
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['show-rooms']}/${editShowRoom.id}`, updatedShowRoom, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the state after saving
            setShowRooms(showRooms.map(showRoom => (showRoom.id === editShowRoom.id ? updatedShowRoom : showRoom)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating show room: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditShowRoom((prevShowRoom) => ({ ...prevShowRoom, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Phòng Chiếu
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
                                    <TableCell>Tên Phòng</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentShowRooms.map((showRoom) => (
                                    <TableRow key={showRoom.id}>
                                        <TableCell>{showRoom.id}</TableCell>
                                        <TableCell>{showRoom.showRoomName}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(showRoom)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(showRoom.id)}>Xóa</Button>
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
                            count={Math.ceil(showRooms.length / showRoomsPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editShowRoom && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Phòng Chiếu</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của phòng chiếu.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên Phòng"
                                    type="text"
                                    name="showRoomName"
                                    value={editShowRoom.showRoomName}
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

export default ShowRoomPage;
