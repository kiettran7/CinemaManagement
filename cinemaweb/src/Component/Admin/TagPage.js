import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Api, { endpoints } from "../../Api";

const TagPage = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tagsPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing tag
    const [editTag, setEditTag] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                const resTags = await Api.get(endpoints['tags'], { headers: { Authorization: `Bearer ${token}` } });
                setTags(resTags.data?.result || []);
            } catch (error) {
                console.error("Error fetching tags: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, [token]);

    // Pagination
    const indexOfLastTag = currentPage * tagsPerPage;
    const indexOfFirstTag = indexOfLastTag - tagsPerPage;
    const currentTags = tags.slice(indexOfFirstTag, indexOfLastTag);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Tag
    const handleDelete = async (tagId) => {
        try {
            await Api.delete(`${endpoints['tags']}/${tagId}`, { headers: { Authorization: `Bearer ${token}` } });
            setTags(tags.filter(tag => tag.id !== tagId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting tag: ", error);
        }
    };

    // Edit Tag
    const handleEdit = (tag) => {
        setEditTag(tag); // Set the tag to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            // Prepare the updated tag data
            const updatedTag = {
                ...editTag,
                tagName: editTag.tagName
            };

            // Send the PUT request with the updated data
            await Api.put(`${endpoints['tags']}/${editTag.id}`, updatedTag, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the state after saving
            setTags(tags.map(tag => (tag.id === editTag.id ? updatedTag : tag)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating tag: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditTag((prevTag) => ({ ...prevTag, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Thẻ
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
                                    <TableCell>Tên Thẻ</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentTags.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell>{tag.id}</TableCell>
                                        <TableCell>{tag.tagName}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(tag)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(tag.id)}>Xóa</Button>
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
                            count={Math.ceil(tags.length / tagsPerPage)} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editTag && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Thẻ</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của thẻ.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên Thẻ"
                                    type="text"
                                    name="tagName"
                                    value={editTag.tagName}
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

export default TagPage;
