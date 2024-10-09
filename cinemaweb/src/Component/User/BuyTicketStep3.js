import React, { useEffect, useLayoutEffect, useState } from "react";
import './Style.css';
import { Box, Typography, Grid, Button, IconButton, Stack } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useBuyTicketContext } from "../../Context/BuyTicketContext";
import { useMovieContext } from "../../Context/MovieContext";
import Api, { endpoints } from "../../Api";
import { useLayoutContext } from "../../Context/LayoutContext";


function BuyTicketStep3() {
    const { steps, activeStep, nextStep, backStep, minutes, seconds, formatTime, selectedSeats, totalPriceSeats, ticketInfo, setTicketInfo,
        foodItems, handleIncrementFood, handleDecrementFood, selectedFoods, quantityFoods, totalPriceFoods, totalPrice }
            = useBuyTicketContext();
    const { selectedMovie } = useMovieContext();
    const { setIsLoading } = useLayoutContext();

    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        setIsLoading(true);

        try {
            const res = await Api.get(endpoints.items);
            const data = res.data.result;
            
            if (Array.isArray(data)) {
                setItems(data);
                localStorage.setItem("items", JSON.stringify(data));
            } else {
                console.error("Không có danh sách nào tồn tại!");
            };
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    const sortSeats = (a, b) => {
        const numA = parseInt(a.seatName.replace(/\D/g, ''));
        const numB = parseInt(b.seatName.replace(/\D/g, ''));
        return numA - numB;
    };

    useEffect(() => {
        fetchItems();
    }, [setIsLoading])

    useEffect(() => {
        const foods = selectedFoods.map((item) => ({
            ...item,
            quantity: quantityFoods[item.itemName] || 0,
        }));

        console.log("SAAAAAA: ", selectedFoods)
    
        setTicketInfo((prev) => ({
            ...prev,
            foods,
        }));
    }, [selectedFoods, quantityFoods]);

    return(
        <>
        <Box component="main">
            <Grid container sx={{ mt: 3 }} spacing={5}>
                <Grid item xs={8} component="addon">
                    <Box className="radius ticket-border-box">
                        <Box component="title" className="flex-center title-box">
                            <Typography variant="h6" className="title-m">
                                Chọn đồ ăn
                            </Typography>
                        </Box>

                        {items.map((item) => (
                            <Grid container className="order-p" component="food" key={item.id}>
                                <Grid item xs={3} md={2}>
                                    <img src="https://img.pikbest.com/png-images/20190803/popcorn-cartoon-drawing-cute_2729868.png!f305cw" alt={item.itemName} className="food-img"></img>
                                </Grid>

                                <Grid item xs={6} md={10}>
                                    <Typography variant="body1" className="text-normal"> 
                                        {item.itemName}
                                    </Typography>

                                    <Stack direction="row" spacing={4} alignItems="center" className="select-food">
                                        <IconButton aria-label="decrement button" color="primary" onClick={() => handleDecrementFood(item)} disabled={quantityFoods[item.itemName] <= 0}
                                            className="text-white btn-decrement btn-transition" size="small">
                                            <RemoveIcon />
                                        </IconButton>

                                        <Typography variant="body1" className="text-normal quantity-step3">
                                            {quantityFoods[item.itemName] || 0}
                                        </Typography>

                                        <IconButton aria-label="increment button" color="primary" onClick={() => handleIncrementFood(item)}
                                            className="text-white btn-increment btn-transition" size="small">
                                            <AddIcon />
                                        </IconButton>
                                        
                                        <Typography variant="body1" className="text-normal start-end">
                                            {item.itemPrice.toLocaleString()} VND
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={4} component="info">
                    <Box className="radius ticket-border-box">
                        <Box className="step2-box-p bb">
                            <Typography gutterBottom variant="h6" component="div">
                                KLH Cinema Nhà Bè
                            </Typography>

                            <Typography variant="body2" component="div" className="text-des text-normal">
                                Khu dân cư Nhơn Đức, Nhà Bè, Thành phố Hồ Chí Minh
                            </Typography>
                        </Box>

                        <Box className="step2-box-p bb">
                            <Typography gutterBottom variant="h6" component="div" className="text-uppercase text-main">
                                {selectedMovie ? selectedMovie.movieName : ''}
                            </Typography>

                            <Typography variant="body2" component="div" className="text-des text-normal">
                                Thời lượng: {selectedMovie ? selectedMovie.duration + " phút" : ''}
                            </Typography>

                            {selectedSeats.length > 0 &&
                                <Box className="mt-15">
                                    <Grid container spacing={1} className="item-detail title-box align-center">
                                        <Grid item xs={7}>
                                            <Typography variant="body2" component="div" className="text-normal">
                                                {selectedSeats.length} x
                                            </Typography>

                                            <Typography variant="body2" component="div" className="text-normal mt-2">
                                                Ghế {selectedSeats.sort(sortSeats).map((seat) => seat.seatName.replace('Phòng ', '')).join(', ')}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={5} className="text-end">
                                            <Typography variant="body2" component="div" className="text-normal start-end">
                                                {totalPriceSeats.toLocaleString()} VND
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            }

                            {selectedFoods.map((item, index) => {
                                const quantity = quantityFoods[item.itemName] || 0;
                                if (quantity > 0) {
                                    const totalPriceFoodName = totalPriceFoods[item.itemName] || 0;
                                    
                                    return (
                                        <Grid container spacing={1} key={`${item.id}-${index}`} className="item-detail title-box" alignItems="center">
                                            <Grid item xs={7}>
                                                <Typography variant="body2" component="div" className="text-normal">
                                                    {quantity} x
                                                </Typography>

                                                <Typography variant="body2" component="div" className="text-normal mt-2">
                                                    {item.itemName}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={5} className="text-end">
                                                <Typography variant="body2" component="div" className="text-normal">
                                                    {totalPriceFoodName.toLocaleString()} VND
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </Box>

                        <Box className="step2-box-p">
                            <Stack direction="row" alignItems="center">
                                <Typography variant="h6" component="div" className="text-normal">
                                    Tổng tiền:
                                </Typography>

                                <Typography variant="h5" component="div" className="text-normal start-end">
                                    {totalPrice.toLocaleString()} VND
                                </Typography>
                            </Stack>

                            <Button variant="contained" size="small" className="p-10 btn-bg btn-transition btn-total-money text-title" onClick={() => nextStep(selectedMovie)}>
                                THANH TOÁN ({activeStep + 1}/{steps.length})
                            </Button>

                            <Box component="return" className="text-white flex-center mt-15 return pointer" onClick={backStep}>
                                <KeyboardBackspaceIcon className="mr-5" />
                                <Typography variant="body2" component="div" className="text-normal">
                                    Trở lại
                                </Typography>
                            </Box>

                            <Box component="countdown" className="flex-center mt-15">
                                <Typography variant="body2" component="div" className="text-normal mr-5">
                                    Còn lại
                                </Typography>

                                <Typography variant="body2" component="div" className="text-danger">
                                    {formatTime({ minutes, seconds })}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        </>
    );
};

export default BuyTicketStep3;