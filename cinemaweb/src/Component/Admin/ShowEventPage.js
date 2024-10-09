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

const ShowEventPage = () => {
    const [showEvents, setShowEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing show event
    const [editEvent, setEditEvent] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchShowEvents = async () => {
            setLoading(true);
            try {
                const resShowEvents = await Api.get(endpoints['show-events'], {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setShowEvents(resShowEvents.data?.result || []);
            } catch (error) {
                console.error("Error fetching show events: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShowEvents();
    }, [token]);

    // Pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentShowEvents = showEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Show Event
    const handleDelete = async (eventId) => {
        try {
            await Api.delete(`${endpoints['show-events']}/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEvents(showEvents.filter(event => event.id !== eventId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting show event: ", error);
        }
    };

    // Edit Show Event
    const handleEdit = (event) => {
        setEditEvent(event); // Set the event to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            const updatedEvent = {
                ...editEvent,
                // Include all necessary fields for updating
            };

            await Api.put(`${endpoints['show-events']}/${editEvent.id}`, updatedEvent, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowEvents(showEvents.map(event => (event.id === editEvent.id ? updatedEvent : event)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating show event: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Sự Kiện Chiếu
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã sự kiện</TableCell>
                                    <TableCell>Thời gian chiếu</TableCell>
                                    <TableCell>Phòng chiếu</TableCell>
                                    <TableCell>Ngày chiếu</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentShowEvents.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>{event.id}</TableCell>
                                        <TableCell>{`${event.showtime.startTime} - ${event.showtime.endTime}`}</TableCell>
                                        <TableCell>{event.showRoom.showRoomName}</TableCell>
                                        <TableCell>{event.showSchedule.showDate}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(event)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(event.id)}>Xóa</Button>
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
                            count={Math.ceil(showEvents.length / eventsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editEvent && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa sự kiện</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của sự kiện.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Thời gian bắt đầu"
                                    type="text"
                                    name="showtime.startTime"
                                    value={editEvent.showtime.startTime}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Thời gian kết thúc"
                                    type="text"
                                    name="showtime.endTime"
                                    value={editEvent.showtime.endTime}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Phòng chiếu"
                                    type="text"
                                    name="showRoom.showRoomName"
                                    value={editEvent.showRoom.showRoomName}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Ngày chiếu"
                                    type="text"
                                    name="showSchedule.showDate"
                                    value={editEvent.showSchedule.showDate}
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

export default ShowEventPage;
