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

const GenrePage = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const genresPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing genre
    const [editGenre, setEditGenre] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            try {
                const resGenres = await Api.get(endpoints['genres'], { headers: { Authorization: `Bearer ${token}` } });
                setGenres(resGenres.data?.result || []);
            } catch (error) {
                console.error("Error fetching genres: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, [token]);

    // Pagination
    const indexOfLastGenre = currentPage * genresPerPage;
    const indexOfFirstGenre = indexOfLastGenre - genresPerPage;
    const currentGenres = genres.slice(indexOfFirstGenre, indexOfLastGenre);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Genre
    const handleDelete = async (genreId) => {
        try {
            await Api.delete(`${endpoints['genres']}/${genreId}`, { headers: { Authorization: `Bearer ${token}` } });
            setGenres(genres.filter(genre => genre.id !== genreId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting genre: ", error);
        }
    };

    // Edit Genre
    const handleEdit = (genre) => {
        setEditGenre(genre); // Set the genre to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            const updatedGenre = {
                ...editGenre,
                genreName: editGenre.genreName
            };

            await Api.put(`${endpoints['genres']}/${editGenre.id}`, updatedGenre, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setGenres(genres.map(genre => (genre.id === editGenre.id ? updatedGenre : genre)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating genre: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditGenre((prevGenre) => ({ ...prevGenre, [name]: value }));
    };

    return (
        <Container style={{ width: '80%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Thể Loại
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã thể loại</TableCell>
                                    <TableCell>Tên thể loại</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentGenres.map((genre) => (
                                    <TableRow key={genre.id}>
                                        <TableCell>{genre.id}</TableCell>
                                        <TableCell>{genre.genreName}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(genre)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(genre.id)}>Xóa</Button>
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
                            count={Math.ceil(genres.length / genresPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editGenre && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Thể Loại</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của thể loại.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên thể loại"
                                    type="text"
                                    name="genreName"
                                    value={editGenre.genreName}
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

export default GenrePage;
