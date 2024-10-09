import React from "react";
import '../../index'
import { Modal, Button, Typography, Box, Card, CardMedia, CardActions, Grid, IconButton, Stack } from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import { useMovieContext } from "../../Context/MovieContext";

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
    };

    const { open, closeModal, selectedMovie, type, goBuyTicket } = useMovieContext();
    const showTrailerButton = type === 'Showing';

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
                                    {/* {showTrailerButton && ( */}
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

                                    {/* )} */}
                                    {/* <Button variant="outlined" className="p-10 movie-card-btn-info text-white">XEM TRAILER</Button> */}
                                </CardActions>
                            </Card>
                        </Box>

                        <Box component="info" sx={{ width: "60%" }}>
                            <Typography className="text-main movie-title-detail" variant="h5" gutterBottom>
                                {selectedMovie ? selectedMovie.movieName : ''}
                            </Typography>

                            <Typography variant="body1" className="text-normal" gutterBottom>
                                Thể loại phim:

                                <a href="#" className="link-text">
                                    {selectedMovie ? selectedMovie.genres.map((genre) => genre.genreName).join(', ') : ''}
                                </a>
                            </Typography>

                            <Typography variant="body1" className="text-normal" gutterBottom>
                                Trạng thái:

                                <a href="#" className="link-text">
                                    {selectedMovie ? getStatusTranslation(selectedMovie.status) : ''}
                                </a>
                            </Typography>

                            <Typography variant="body1" className="text-normal" gutterBottom>
                                Thẻ:

                                <a href="#" className="link-text">
                                    {selectedMovie ? selectedMovie.tags.map((tag) => tag.tagName).join(', ') : ''}
                                </a>
                            </Typography>

                            <Typography className="text-normal" variant="body1" gutterBottom>
                                Giá phim: {selectedMovie ? selectedMovie.moviePrice.toLocaleString('vi-VN') + ' VND' : ''}
                            </Typography>

                            <Typography className="text-normal" variant="body1" gutterBottom>
                                Thời lượng: {selectedMovie ? selectedMovie.duration + " phút" : ''}
                            </Typography>
                        </Box>
                    </Stack>

                </Box>
            </Modal>
        </>
    )
};

export default MovieDetail;