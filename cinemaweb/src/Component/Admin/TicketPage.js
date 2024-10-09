import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from "@mui/material";
import Api, { endpoints } from "../../Api";

const TicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing ticket
    const [editTicket, setEditTicket] = useState(null); 
    const [openEditDialog, setOpenEditDialog] = useState(false); 

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const resTickets = await Api.get(endpoints['tickets'], { headers: { Authorization: `Bearer ${token}` } });
                setTickets(resTickets.data?.result || []);
            } catch (error) {
                console.error("Error fetching tickets: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [token]);

    // Pagination
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Ticket
    const handleDelete = async (ticketId) => {
        try {
            await Api.delete(`${endpoints['tickets']}/${ticketId}`, { headers: { Authorization: `Bearer ${token}` } });
            setTickets(tickets.filter(ticket => ticket.id !== ticketId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting ticket: ", error);
        }
    };

    // Edit Ticket
    const handleEdit = (ticket) => {
        setEditTicket(ticket); // Set the ticket to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated ticket data with all fields (including nested ones)
            const updatedTicket = {
                ...editTicket,
                showEvent: editTicket.showEvent,  
                seat: editTicket.seat,  
                customer: editTicket.customer,  
                staff: editTicket.staff,  
                movie: editTicket.movie,  
                bill: editTicket.bill  
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['tickets']}/${editTicket.id}`, updatedTicket, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            // Update the state after saving
            setTickets(tickets.map(ticket => (ticket.id === editTicket.id ? updatedTicket : ticket)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating ticket: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditTicket((prevTicket) => ({ ...prevTicket, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Vé
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã vé</TableCell>
                                    <TableCell>Phim đã đặt</TableCell>
                                    <TableCell>Giá vé</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Loại đặt vé</TableCell>
                                    <TableCell>Khách hàng</TableCell>
                                    <TableCell>Nhân viên bán</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentTickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell>{ticket.id}</TableCell>
                                        <TableCell>{ticket.movie.movieName}</TableCell>
                                        <TableCell>{ticket.ticketPrice.toLocaleString()} VND</TableCell>
                                        <TableCell>{ticket.status}</TableCell>
                                        <TableCell>{ticket.bookingType}</TableCell>
                                        <TableCell>{ticket.customer?.fullName || "Không có"}</TableCell>
                                        <TableCell>{ticket.staff?.fullName || "Không có"}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(ticket)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(ticket.id)}>Xóa</Button>
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
                            count={Math.ceil(tickets.length / ticketsPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editTicket && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa vé</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của vé.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Giá vé"
                                    type="number"
                                    name="ticketPrice"
                                    value={editTicket.ticketPrice}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Trạng thái"
                                    type="text"
                                    name="status"
                                    value={editTicket.status}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Loại đặt vé"
                                    type="text"
                                    name="bookingType"
                                    value={editTicket.bookingType}
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

export default TicketPage;
