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
    TextField
} from "@mui/material";
import Api, { endpoints } from "../../Api";

const ItemPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing item
    const [editItem, setEditItem] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const resItems = await Api.get(endpoints['items'], { headers: { Authorization: `Bearer ${token}` } });
                setItems(resItems.data?.result || []);
            } catch (error) {
                console.error("Error fetching items: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [token]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Item
    const handleDelete = async (itemId) => {
        try {
            await Api.delete(`${endpoints['items']}/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
            setItems(items.filter(item => item.id !== itemId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    };

    // Edit Item
    const handleEdit = (item) => {
        setEditItem(item); // Set the item to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            const updatedItem = {
                ...editItem,
                itemName: editItem.itemName,
                itemType: editItem.itemType,
                itemPrice: editItem.itemPrice
            };

            await Api.put(`${endpoints['items']}/${editItem.id}`, updatedItem, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setItems(items.map(item => (item.id === editItem.id ? updatedItem : item)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditItem((prevItem) => ({ ...prevItem, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Mặt Hàng
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã mặt hàng</TableCell>
                                    <TableCell>Tên mặt hàng</TableCell>
                                    <TableCell>Loại mặt hàng</TableCell>
                                    <TableCell>Giá mặt hàng</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.itemType}</TableCell>
                                        <TableCell>{item.itemPrice.toLocaleString()} VND</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(item)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(item.id)}>Xóa</Button>
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
                            count={Math.ceil(items.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editItem && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Mặt Hàng</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của mặt hàng.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên mặt hàng"
                                    type="text"
                                    name="itemName"
                                    value={editItem.itemName}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Loại mặt hàng"
                                    type="text"
                                    name="itemType"
                                    value={editItem.itemType}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Giá mặt hàng"
                                    type="number"
                                    name="itemPrice"
                                    value={editItem.itemPrice}
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

export default ItemPage;
