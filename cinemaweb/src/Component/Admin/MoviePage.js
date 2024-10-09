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

const MoviePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10;
    const token = localStorage.getItem("token");

    // State for editing movie
    const [editMovie, setEditMovie] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const resMovies = await Api.get(endpoints['movies'], { headers: { Authorization: `Bearer ${token}` } });
                setMovies(resMovies.data?.result || []);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [token]);

    // Pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Delete Movie
    const handleDelete = async (movieId) => {
        try {
            await Api.delete(`${endpoints['movies']}/${movieId}`, { headers: { Authorization: `Bearer ${token}` } });
            setMovies(movies.filter(movie => movie.id !== movieId)); // Update the state after deleting
        } catch (error) {
            console.error("Error deleting movie: ", error);
        }
    };

    // Edit Movie
    const handleEdit = (movie) => {
        setEditMovie(movie); // Set the movie to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleSaveEdit = async () => {
        try {
            const updatedMovie = {
                ...editMovie,
                movieName: editMovie.movieName,
                movieImage: editMovie.movieImage,
                moviePrice: editMovie.moviePrice,
                duration: editMovie.duration,
                status: editMovie.status
            };

            await Api.put(`${endpoints['movies']}/${editMovie.id}`, updatedMovie, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMovies(movies.map(movie => (movie.id === editMovie.id ? updatedMovie : movie)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating movie: ", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
    };

    return (
        <Container style={{ width: '90%' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Phim
            </Typography>
            {loading ? (
                <Typography variant="body1">Đang tải dữ liệu...</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã phim</TableCell>
                                    <TableCell>Ảnh phim</TableCell>
                                    <TableCell>Tên phim</TableCell>
                                    <TableCell>Giá phim</TableCell>
                                    <TableCell>Thời lượng</TableCell>
                                    <TableCell>Thể loại</TableCell>
                                    <TableCell>Tag</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentMovies.map((movie) => (
                                    <TableRow key={movie.id}>
                                        <TableCell>{movie.id}</TableCell>
                                        <TableCell>
                                            <img src={movie.movieImage} alt={movie.movieName} style={{ width: "100px" }} />
                                        </TableCell>
                                        <TableCell>{movie.movieName}</TableCell>
                                        <TableCell>{movie.moviePrice.toLocaleString()} VND</TableCell>
                                        <TableCell>{movie.duration} phút</TableCell>
                                        <TableCell>
                                            <ul>
                                                {movie.genres.map((genre) => (
                                                    <li key={genre.id}>
                                                        {genre.genreName}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>
                                            <ul>
                                                {movie.tags.map((tag) => (
                                                    <li key={tag.id}>
                                                        {tag.tagName}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{movie.status}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button variant="outlined" color="secondary" onClick={() => handleEdit(movie)}>Sửa</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(movie.id)}>Xóa</Button>
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
                            count={Math.ceil(movies.length / moviesPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>

                    {/* Edit Dialog */}
                    {editMovie && (
                        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                            <DialogTitle>Sửa Phim</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin của phim.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tên phim"
                                    type="text"
                                    name="movieName"
                                    value={editMovie.movieName}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Ảnh phim"
                                    type="text"
                                    name="movieImage"
                                    value={editMovie.movieImage}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Giá phim"
                                    type="number"
                                    name="moviePrice"
                                    value={editMovie.moviePrice}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Thời gian (phút)"
                                    type="number"
                                    name="duration"
                                    value={editMovie.duration}
                                    onChange={handleEditChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    label="Trạng thái"
                                    type="text"
                                    name="status"
                                    value={editMovie.status}
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

export default MoviePage;
