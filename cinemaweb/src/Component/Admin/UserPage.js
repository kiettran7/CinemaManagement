import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Api, { endpoints } from "../../Api";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing user
    const [editUser, setEditUser] = useState(null); 
    const [openEditDialog, setOpenEditDialog] = useState(false); 

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const resUsers = await Api.get(endpoints['users'], { headers: { Authorization: `Bearer ${token}` } });
                setUsers(resUsers.data?.result || []);
            } catch (error) {
                console.error("Error fetching users: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete User
    const handleDelete = async (userId) => {
        try {
            await Api.delete(`${endpoints['users']}/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(users.filter(user => user.userId !== userId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    };

    // Edit User
    const handleEdit = (user) => {
        setEditUser(user); // Set the user to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated user data
            const updatedUser = {
                ...editUser,
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['users']}/${editUser.userId}`, updatedUser, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            // Update the state after saving
            setUsers(users.map(user => (user.userId === editUser.userId ? updatedUser : user)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating user: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Người Dùng
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã Người Dùng</TableCell>
                                    <TableCell>Tên Người Dùng</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Số Điện Thoại</TableCell>
                                    <TableCell>Tên Đầy Đủ</TableCell>
                                    <TableCell>Ngày Sinh</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentUsers.map((user) => (
                                    <TableRow key={user.userId}>
                                        <TableCell>{user.userId}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.birthday}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(user)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(user.userId)}>Xóa</Button>
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
                            count={Math.ceil(users.length / usersPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editUser && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Người Dùng</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của người dùng.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên Người Dùng"
                                    type="text"
                                    name="username"
                                    value={editUser.username}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={editUser.email}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Số Điện Thoại"
                                    type="text"
                                    name="phone"
                                    value={editUser.phone}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Tên Đầy Đủ"
                                    type="text"
                                    name="fullName"
                                    value={editUser.fullName}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Ngày Sinh"
                                    type="date"
                                    name="birthday"
                                    value={editUser.birthday}
                                    onChange={handleEditChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
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

export default UserPage;
