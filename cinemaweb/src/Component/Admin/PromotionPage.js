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

const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const promotionsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing promotion
    const [editPromotion, setEditPromotion] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchPromotions = async () => {
            setLoading(true);
            try {
                const resPromotions = await Api.get(endpoints['promotions'], {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPromotions(resPromotions.data?.result || []);
            } catch (error) {
                console.error("Error fetching promotions: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, [token]);

    // Pagination
    const indexOfLastPromotion = currentPage * promotionsPerPage;
    const indexOfFirstPromotion = indexOfLastPromotion - promotionsPerPage;
    const currentPromotions = promotions.slice(indexOfFirstPromotion, indexOfLastPromotion);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Promotion
    const handleDelete = async (promotionId) => {
        try {
            await Api.delete(`${endpoints['promotions']}/${promotionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPromotions(promotions.filter(promotion => promotion.id !== promotionId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting promotion: ", error);
        }
    };

    // Edit Promotion
    const handleEdit = (promotion) => {
        setEditPromotion(promotion); // Set the promotion to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            const updatedPromotion = {
                ...editPromotion,
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['promotions']}/${editPromotion.id}`, updatedPromotion, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the state after saving
            setPromotions(promotions.map(promotion => (promotion.id === editPromotion.id ? updatedPromotion : promotion)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating promotion: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditPromotion((prevPromotion) => ({ ...prevPromotion, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Khuyến Mãi
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
                                    <TableCell>Tên Khuyến Mãi</TableCell>
                                    <TableCell>Giá Trị Giảm Giá</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentPromotions.map((promotion) => (
                                    <TableRow key={promotion.id}>
                                        <TableCell>{promotion.id}</TableCell>
                                        <TableCell>{promotion.promotionName}</TableCell>
                                        <TableCell>{(promotion.discountValue * 100).toFixed(0)}%</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(promotion)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(promotion.id)}>Xóa</Button>
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
                            count={Math.ceil(promotions.length / promotionsPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editPromotion && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Khuyến Mãi</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của khuyến mãi.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên Khuyến Mãi"
                                    type="text"
                                    name="promotionName"
                                    value={editPromotion.promotionName}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Giá Trị Giảm Giá (0-1)"
                                    type="number"
                                    name="discountValue"
                                    value={editPromotion.discountValue}
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

export default PromotionPage;
