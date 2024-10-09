import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Api, { endpoints } from "../../Api";

const ShowSchedulePage = () => {
    const [showSchedules, setShowSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const showSchedulesPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing show schedule
    const [editShowSchedule, setEditShowSchedule] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchShowSchedules = async () => {
            setLoading(true);
            try {
                const resShowSchedules = await Api.get(endpoints['show-schedules'], { headers: { Authorization: `Bearer ${token}` } });
                setShowSchedules(resShowSchedules.data?.result || []);
            } catch (error) {
                console.error("Error fetching show schedules: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShowSchedules();
    }, [token]);

    // Pagination
    const indexOfLastShowSchedule = currentPage * showSchedulesPerPage;
    const indexOfFirstShowSchedule = indexOfLastShowSchedule - showSchedulesPerPage;
    const currentShowSchedules = showSchedules.slice(indexOfFirstShowSchedule, indexOfLastShowSchedule);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Show Schedule
    const handleDelete = async (showScheduleId) => {
        try {
            await Api.delete(`${endpoints['show-schedules']}/${showScheduleId}`, { headers: { Authorization: `Bearer ${token}` } });
            setShowSchedules(showSchedules.filter(showSchedule => showSchedule.id !== showScheduleId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting show schedule: ", error);
        }
    };

    // Edit Show Schedule
    const handleEdit = (showSchedule) => {
        setEditShowSchedule(showSchedule); // Set the show schedule to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated show schedule data
            const updatedShowSchedule = {
                ...editShowSchedule,
                showDate: editShowSchedule.showDate
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['show-schedules']}/${editShowSchedule.id}`, updatedShowSchedule, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the state after saving
            setShowSchedules(showSchedules.map(showSchedule => (showSchedule.id === editShowSchedule.id ? updatedShowSchedule : showSchedule)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating show schedule: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditShowSchedule((prevShowSchedule) => ({ ...prevShowSchedule, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Lịch Chiếu
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
                                    <TableCell>Ngày Chiếu</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentShowSchedules.map((showSchedule) => (
                                    <TableRow key={showSchedule.id}>
                                        <TableCell>{showSchedule.id}</TableCell>
                                        <TableCell>{showSchedule.showDate}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(showSchedule)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(showSchedule.id)}>Xóa</Button>
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
                            count={Math.ceil(showSchedules.length / showSchedulesPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editShowSchedule && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Lịch Chiếu</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của lịch chiếu.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Ngày Chiếu"
                                    type="date"
                                    name="showDate"
                                    value={editShowSchedule.showDate}
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

export default ShowSchedulePage;
