import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Api, { endpoints } from "../../Api";

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rolesPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing role
    const [editRole, setEditRole] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newRole, setNewRole] = useState("");

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const resRoles = await Api.get(endpoints['roles'], { headers: { Authorization: `Bearer ${token}` } });
                setRoles(resRoles.data?.result || []);
            } catch (error) {
                console.error("Error fetching roles: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [token]);

    // Pagination
    const indexOfLastRole = currentPage * rolesPerPage;
    const indexOfFirstRole = indexOfLastRole - rolesPerPage;
    const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Role
    const handleDelete = async (roleId) => {
        try {
            await Api.delete(`${endpoints['roles']}/${roleId}`, { headers: { Authorization: `Bearer ${token}` } });
            setRoles(roles.filter(role => role.id !== roleId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting role: ", error);
        }
    };

    // Edit Role
    const handleEdit = (role) => {
        setEditRole(role); // Set the role to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated role data
            const updatedRole = { ...editRole };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['roles']}/${editRole.id}`, updatedRole, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            // Update the state after saving
            setRoles(roles.map(role => (role.id === editRole.id ? updatedRole : role)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating role: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditRole((prevRole) => ({ ...prevRole, [name]: value }));
    };

    // Add Role
    const handleAddRole = async () => {
        try {
            const newRoleData = { name: newRole }; // Prepare new role data
            const res = await Api.post(endpoints['roles'], newRoleData, { headers: { Authorization: `Bearer ${token}` } });
            setRoles([...roles, res.data]); // Add new role to the state
            setNewRole(""); // Reset new role input
            setOpenAddDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error adding role: ", error);
        }
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Vai Trò
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
                        Thêm Vai Trò
                    </Button>
                    <TableContainer component={Paper} style={{ marginTop: 16 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên vai trò</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentRoles.map((role) => (
                                    <TableRow key={role.name}>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>{role.description}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(role)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(role.id)}>Xóa</Button>
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
                            count={Math.ceil(roles.length / rolesPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editRole && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa vai trò</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của vai trò.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên vai trò"
                                    type="text"
                                    name="name"
                                    value={editRole.name}
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

                    {/* Add Dialog */}
                    <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                        <DialogTitle>Thêm vai trò</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Nhập tên vai trò mới.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Tên vai trò"
                                type="text"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenAddDialog(false)} color="primary">
                                Hủy
                            </Button>
                            <Button onClick={handleAddRole} color="primary">
                                Thêm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default RolePage;
