import React, { useState, useEffect } from "react";
import '../../index';
import { Modal, Button, Typography, Box, Card, CardMedia, CardActions, Stack, TextField, Avatar, IconButton } from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import { useMovieContext } from "../../Context/MovieContext";
import Api, { endpoints } from "../../Api";
import { useAuthContext } from '../../Context/AuthContext';

function MovieDetail() {
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1020,
        borderRadius: '20px',
        background: '#191b21',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        p: 4,
        overflowY: 'auto', // Cho phép cuộn dọc
        maxHeight: '90vh', // Giới hạn chiều cao tối đa của modal
    };

    const { open, closeModal, selectedMovie, type, goBuyTicket } = useMovieContext();
    const { currentUserInfo } = useAuthContext();
    const token = localStorage.getItem("token");
    const showTrailerButton = type === 'Showing';

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Lấy comment từ API cho phim đang chọn
    useEffect(() => {
        if (selectedMovie) {
            Api.get(endpoints['comments'])
                .then(res => {
                    const movieComments = res.data.result.filter(comment => comment.movie.id === selectedMovie.id);
                    setComments(movieComments);
                })
                .catch(err => console.error(err));
        }
    }, [selectedMovie]);

    // Thêm comment mới
    const handleAddComment = async () => {
        const commentData = {
            content: newComment,
            movie: selectedMovie.id,
            user: currentUserInfo.userId
        };

        console.log("thêm comment: ", commentData)

        await Api.post(endpoints['comments'], commentData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setComments([...comments, res.data.result]);
                setNewComment('');
            })
            .catch(err => console.error(err));
    };

    const translateStatus = [
        { eng: "NOW_SHOWING", vi: "Đang chiếu" },
        { eng: "UPCOMING", vi: "Sắp chiếu" },
    ];

    const getStatusTranslation = (status) => {
        const translation = translateStatus.find((item) => item.eng === status);
        return translation ? translation.vi : status;
    };

    return (
        <>
            <Modal open={open} onClose={closeModal}>
                <Box sx={modalStyle} component="modal">
                    <IconButton aria-label="close" onClick={closeModal} sx={{ position: 'absolute', right: 10, top: 10, color: 'gray' }} className="btn">
                        <CloseIcon />
                    </IconButton>

                    <Stack direction="row" spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <Box sx={{ width: "40%" }} component="poster">
                            <Card className="radius movie-card-width card-none-border card-bg">
                                <CardMedia component="img" alt="movie" className="movie-card-img"
                                    image={selectedMovie ? selectedMovie.movieImage : ''} />

                                <CardActions className="movie-card-btn">
                                    {selectedMovie && selectedMovie.status === "NOW_SHOWING"
                                        ?
                                        <Link to={`/buy-ticket/step1?movieId=${selectedMovie?.id}`}>
                                            <Button variant="contained" size="small" startIcon={<ConfirmationNumberIcon />} className="p-10 btn-bg mr-10 btn-transition" onClick={() => goBuyTicket(selectedMovie)}>
                                                MUA VÉ NGAY
                                            </Button>
                                        </Link>
                                        :
                                        <Button variant="contained" size="small" startIcon={<ConfirmationNumberIcon />} className="p-10 btn-bg mr-10 btn-transition" onClick={() => goBuyTicket(selectedMovie)}>
                                            COMMING SOON
                                        </Button>}
                                </CardActions>
                            </Card>
                        </Box>

                        <Box component="info" sx={{ width: "60%" }}>
                            <Typography className="text-main movie-title-detail" variant="h5" gutterBottom>
                                {selectedMovie ? selectedMovie.movieName : ''}
                            </Typography>

                            {/* Hiển thị thông tin phim */}
                            <Typography variant="body1" className="text-normal" gutterBottom>
                                Thể loại phim: <a href="#" className="link-text">{selectedMovie ? selectedMovie.genres.map((genre) => genre.genreName).join(', ') : ''}</a>
                            </Typography>

                            <Typography variant="body1" className="text-normal" gutterBottom>
                                Trạng thái: <a href="#" className="link-text">{selectedMovie ? getStatusTranslation(selectedMovie.status) : ''}</a>
                            </Typography>

                            <Typography variant="body1" className="text-normal" gutterBottom>
                                Thẻ: <a href="#" className="link-text">{selectedMovie ? selectedMovie.tags.map((tag) => tag.tagName).join(', ') : ''}</a>
                            </Typography>

                            <Typography className="text-normal" variant="body1" gutterBottom>
                                Giá phim: {selectedMovie ? selectedMovie.moviePrice.toLocaleString('vi-VN') + ' VND' : ''}
                            </Typography>

                            <Typography className="text-normal" variant="body1" gutterBottom>
                                Thời lượng: {selectedMovie ? selectedMovie.duration + " phút" : ''}
                            </Typography>

                            {/* Hiển thị comment */}
                            <Typography variant="h6" className="text-main" gutterBottom>Bình luận</Typography>

                            {/* Khung bình luận cuộn */}
                            <Box
                                sx={{
                                    maxHeight: 300, // Chiều cao tối đa
                                    overflowY: 'auto', // Cuộn dọc
                                    marginBottom: 2,
                                    padding: 1,
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '10px',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {comments.length > 0 ? (
                                    comments.map(comment => (
                                        <Box
                                            key={comment.id}
                                            sx={{
                                                padding: 2,
                                                backgroundColor: '#f9f9f9',
                                                borderRadius: '10px',
                                                marginBottom: 2,
                                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            {/* Thông tin người dùng */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: 1,
                                                    padding: 1,
                                                    backgroundColor: '#e0e0e0', // Khung nhẹ nhàng cho thông tin người dùng
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                {/* Avatar người dùng */}
                                                <Avatar
                                                    src={comment?.user?.avatar} // Hình đại diện của người dùng (URL từ comment.user.avatar)
                                                    alt={comment?.user?.fullName}
                                                    sx={{ width: 40, height: 40, marginRight: 2 }}
                                                />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                    {comment?.user?.fullName} ({comment?.user?.email})
                                                </Typography>
                                            </Box>

                                            {/* Nội dung bình luận */}
                                            <Typography variant="body1" sx={{ marginTop: 1, color: '#555' }}>
                                                {comment.content}
                                            </Typography>

                                            {/* Khung đánh giá spam và phản hồi từ model */}
                                            <Box
                                                sx={{
                                                    marginTop: 2,
                                                    padding: 1,
                                                    backgroundColor: '#f0f0f0', // Khung mờ cho đánh giá spam
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc', // Đường viền nhẹ
                                                }}
                                            >
                                                {/* Đánh giá spam */}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontStyle: 'italic',
                                                        color: comment.sentiment === "1" ? 'red' : 'green',
                                                    }}
                                                >
                                                    {comment.sentiment === "1" ? "Nghi ngờ spam" : "Bình thường"}
                                                </Typography>

                                                {/* Phản hồi từ model Logistic Regression */}
                                                <Typography variant="body2" sx={{ marginTop: 1, color: '#777' }}>
                                                    Reviewed by Logistic Regression model: {comment.modelResponse}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">Không có bình luận nào.</Typography>
                                )}
                            </Box>

                            {/* Thêm comment */}
                            {currentUserInfo && (
                                <Box
                                    sx={{
                                        marginTop: 2,
                                        padding: 2, // Thêm padding để tạo khoảng cách giữa các phần tử
                                        backgroundColor: '#e3f2fd', // Màu nền sáng hơn để nổi bật
                                        borderRadius: '10px', // Bo góc
                                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Bóng đổ nhẹ để tạo chiều sâu
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label="Nhập bình luận"
                                        variant="outlined"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <Button variant="contained" onClick={handleAddComment}>Gửi bình luận</Button>
                                </Box>
                            )}

                        </Box>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}

export default MovieDetail;
