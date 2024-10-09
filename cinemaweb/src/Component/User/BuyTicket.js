import React, { useEffect } from "react";
import './Style.css';
import { Box, Grid, Typography, Stepper, StepLabel, Step, Container } from "@mui/material";
import BuyTicketStep1Page from "./BuyTicketStep1";
import BuyTicketStep2Page from "./BuyTicketStep2";
import BuyTicketStep3Page from "./BuyTicketStep3";
import BuyTicketStep4Page from "./BuyTicketStep4";
import { useBuyTicketContext } from "../../Context/BuyTicketContext";
import { useMovieContext } from "../../Context/MovieContext";
import { useLayoutContext } from "../../Context/LayoutContext";


function BuyTicket() {
    const { steps, activeStep, resetContext } = useBuyTicketContext();
    const { selectedMovie, setSelectedMovie } = useMovieContext();
    const { Loading } = useLayoutContext();

    const translateStatus = [
        { eng: "NOW_SHOWING", vi: "Đang chiếu"},
        { eng: "UPCOMING", vi: "Sắp chiếu"},
    ];

    const getStatusTranslation = (status) => {
        const translation = translateStatus.find((item) => item.eng === status);
        return translation ? translation.vi : status;
    };

    const getStepContent = (step) => {
        switch(step) {
            case 0:
                return <BuyTicketStep1Page />
            case 1:
                return <BuyTicketStep2Page />
            case 2:
                return <BuyTicketStep3Page />
            case 3:
                return <BuyTicketStep4Page />
            default:
                return <BuyTicketStep3Page />
        }
    }

    useEffect(() => {
        // Kiểm tra localStorage để khôi phục selectedMovie
        const movieFromLocalStorage = localStorage.getItem('selectedMovie');
        if (movieFromLocalStorage) {
            setSelectedMovie(JSON.parse(movieFromLocalStorage));
        }
    }, []);
    
    useEffect(() => {
        resetContext();
    }, [selectedMovie]);

    return (
        <>
        <Container maxWidth="lg" className="mt-30 mb-60">
            <Box component="stepper">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </Box>

            <Box component="card">
                <Box sx={{ mt: 5 }} className="radius ticket-info-p ticket-border-box">
                    <Grid container>
                        <Grid item xs={3} md={3}>
                            <img src={selectedMovie ? selectedMovie.movieImage : ''}
                                alt="movie" className="ticket-img">
                            </img>
                        </Grid>

                        <Grid item xs={6} md={9}>
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
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {getStepContent(activeStep)}

        </Container>
        <Loading />
        </>
    );
};

export default BuyTicket;