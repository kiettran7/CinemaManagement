import { Button, Container, Typography, Card, CardActions, CardContent, CardMedia, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import InfoIcon from '@mui/icons-material/Info';
import { Link, Route, Routes } from "react-router-dom";
import MovieDetailPage from "./MovieDetail";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carousel, CarouselItem } from "react-bootstrap";
import { useMovieContext } from "../../Context/MovieContext";
import { useLayoutContext } from "../../Context/LayoutContext";
import Api, { endpoints } from "../../Api";
import dayjs from "dayjs";

function Home() {
    const { setIsLoading, Loading } = useLayoutContext();
    
    const [comingMovies, setComingMovies] = useState([]);
    const [showingMovies, setShowingMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);

            try {
                const res = await Api.get(endpoints.movies);
                const movies = res.data?.result;

                if (Array.isArray(movies)) {
                    const coming = movies.filter((m) => m.status === "UPCOMING");
                    setComingMovies(coming);
                    localStorage.setItem("comingMovies", JSON.stringify(comingMovies));
                    
                    const showing = movies.filter((m) => m.status === "NOW_SHOWING");
                    setShowingMovies(showing);
                    localStorage.setItem("showingMovies", JSON.stringify(showingMovies));
                } else {
                    console.error("Không có danh sách nào tồn tại!");
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin phim: ", error);
            } finally {
                setIsLoading(false);
            };
        };

        fetchMovies();
    }, [setIsLoading]);

    const sliderStyle = {
        infinite: true,
        slidesToShow: 4,
        dots: true,
        autoplay: true,
        autoplaySpeed: 3000,
        swipeToSlide: true,
    }

    const { openModal, goBuyTicket, carouselData } = useMovieContext();
    
    return (
        <>
        <Box component="carousel">
            <Carousel controls indicators className="mb-60">
                {carouselData.map((carousel) => (
                    <CarouselItem key={carousel.id}>
                        <img className="d-block w-100" src={carousel.img}
                            alt={`slide ${carousel.id}`} />
                    </CarouselItem>
                ))}
            </Carousel>
        </Box>

        <Container maxWidth="lg">
            <Box component="showing">
                <Box component="topic">
                    <Typography component="div" variant="h6" className="showing-movie p-10 text-center mb-60">
                        PHIM ĐANG CHIẾU
                    </Typography>
                </Box>

                <Slider {...sliderStyle} className="slider">
                    {showingMovies.map((movie) => (
                        <Card key={movie.id} className="card-none-border card-bg card-width" >
                            <CardMedia component="img" alt="movie" className="card-img pointer" onClick={() => openModal(movie, 'Showing')}
                                image={movie.movieImage} />

                            <CardContent className="card-p"> 
                                <Typography className="pointer text-title card-title text-white" gutterBottom variant="h6" component="div" onClick={() => openModal(movie, 'Showing')}>
                                    {movie.movieName}
                                </Typography>

                                <Typography variant="body2" className="text-des text-normal">
                                    Thể loại phim: 

                                    <a href="#" className="link-text">
                                        {movie.genres.map((genre) => genre.genreName).join(', ')}
                                    </a>
                                </Typography>
                            </CardContent>

                            <CardActions className="card-p btn-detail">
                                <Link to={`/buy-ticket/step1?movieId=${movie.id}`}>
                                    <Button className="p-10 btn-bg btn-transition" variant="contained" size="small" startIcon={<ConfirmationNumberIcon />} onClick={() => goBuyTicket(movie)}>
                                        MUA VÉ NGAY
                                    </Button>
                                </Link>

                                <Button className="p-10 card-btn-info border-2 text-white" onClick={() => openModal(movie, 'Showing')} variant="outlined"
                                    startIcon={<InfoIcon className="ml-14" />} />
                            </CardActions>
                        </Card>
                    ))}
                </Slider>
            </Box>

            <Box component="coming">
                <Box component="topic">
                    <Typography component="div" variant="h6" className="coming-movie p-10 text-center mb-60">
                        PHIM SẮP CHIẾU
                    </Typography>
                </Box>

                <Slider {...sliderStyle} className="slider coming">
                    {comingMovies.map((movie) => (
                        <Card key={movie.id} className="raidus card-none-border card-bg card-width">
                            <CardMedia component="img" alt="movie" className="card-img pointer" onClick={() => openModal(movie, 'Showing')}
                                image={movie.movieImage} />

                            <CardContent className="card-p">
                                <Typography className="pointer text-title card-title text-white" gutterBottom variant="h6" component="div" onClick={() => openModal(movie, 'Showing')}>
                                    {movie.movieName}
                                </Typography>

                                <Typography variant="body2" className="text-des text-normal">
                                    Thể loại phim: 

                                    <a href="#" className="link-text">
                                        {movie.genres.map((genre) => genre.genreName).join(', ')}
                                    </a>
                                </Typography>
                            </CardContent>

                            <CardActions className="card-p btn-detail">
                                {/* <Link to={`/buy-ticket/step1?movieId=${movie.id}`}> */}
                                    <Button className="p-10 btn-bg btn-transition" variant="contained" size="small" startIcon={<ConfirmationNumberIcon />}>
                                        COMMING SOON
                                    </Button>
                                {/* </Link> */}

                                <Button className="p-10 card-btn-info border-2 text-white" onClick={() => openModal(movie, 'Showing')} variant="outlined"
                                    startIcon={<InfoIcon className="ml-14" />} />
                            </CardActions>
                        </Card>
                    ))}
                </Slider>
            </Box>
        </Container>

        <Loading />

        <Routes>
            <Route path="/" Component={MovieDetailPage} />
        </Routes>
        </>  
    )
}
export default Home;