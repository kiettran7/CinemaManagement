import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from "@mui/material";
import Api, { endpoints } from "../../Api";

const BillPage = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing bill
    const [editBill, setEditBill] = useState(null); 
    const [openEditDialog, setOpenEditDialog] = useState(false); 

    useEffect(() => {
        const fetchBills = async () => {
            setLoading(true);
            try {
                const resBills = await Api.get(endpoints['bills'], { headers: { Authorization: `Bearer ${token}` } });
                setBills(resBills.data?.result || []);
            } catch (error) {
                console.error("Error fetching bills: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, [token]);

    // Pagination
    const indexOfLastBill = currentPage * billsPerPage;
    const indexOfFirstBill = indexOfLastBill - billsPerPage;
    const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Bill
    const handleDelete = async (billId) => {
        try {
            await Api.delete(`${endpoints['bills']}/${billId}`, { headers: { Authorization: `Bearer ${token}` } });
            setBills(bills.filter(bill => bill.id !== billId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting bill: ", error);
        }
    };

    // Edit Bill
    const handleEdit = (bill) => {
        setEditBill(bill); // Set the bill to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated bill data with all fields (including nested ones)
            const updatedBill = {
                ...editBill,
                promotion: editBill.promotion ? editBill.promotion : null,  // Promotion info
                items: editBill.items,  // List of items
                tickets: editBill.tickets  // List of tickets
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['bills']}/${editBill.id}`, updatedBill, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            // Update the state after saving
            setBills(bills.map(bill => (bill.id === editBill.id ? updatedBill : bill)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating bill: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditBill((prevBill) => ({ ...prevBill, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Hóa đơn
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã hóa đơn</TableCell>
                                    <TableCell>Tổng tiền</TableCell>
                                    <TableCell>Khuyến mãi áp dụng</TableCell>
                                    <TableCell>Khách hàng thanh toán</TableCell>
                                    <TableCell>Danh sách mặt hàng</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentBills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>{bill.id}</TableCell>
                                        <TableCell>{bill.totalAmount.toLocaleString()} VND</TableCell>
                                        <TableCell>{bill.customerPaid.toLocaleString()} VND</TableCell>
                                        <TableCell>{bill.promotion ? bill.promotion.promotionName : "Không có"}</TableCell>
                                        <TableCell>
                                            <ul>
                                                {bill.items.map((item) => (
                                                    <li key={item.id}>
                                                        {item.itemName} - {item.itemPrice.toLocaleString()} VND
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(bill)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(bill.id)}>Xóa</Button>
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
                            count={Math.ceil(bills.length / billsPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editBill && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa hóa đơn</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của hóa đơn.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tổng tiền"
                                    type="number"
                                    name="totalAmount"
                                    value={editBill.totalAmount}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Khách hàng thanh toán"
                                    type="number"
                                    name="customerPaid"
                                    value={editBill.customerPaid}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Khuyến mãi áp dụng"
                                    type="text"
                                    name="promotion"
                                    value={editBill.promotion?.promotionName || ""}
                                    onChange={(e) => setEditBill({ ...editBill, promotion: { ...editBill.promotion, promotionName: e.target.value } })}
                                    fullWidth
                                />
                                {/* Thêm các trường khác cho items, tickets nếu cần */}
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

export default BillPage;
