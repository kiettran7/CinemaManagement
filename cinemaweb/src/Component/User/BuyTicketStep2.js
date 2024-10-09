import React, { useEffect, useRef, useState } from "react";
import './Style.css';
import { Box, Typography, Grid, Button, Stack } from "@mui/material";
import WeekendIcon from '@mui/icons-material/Weekend';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useBuyTicketContext } from "../../Context/BuyTicketContext";
import { useMovieContext } from "../../Context/MovieContext";
import { useLayoutContext } from "../../Context/LayoutContext";
import Api, { endpoints } from "../../Api";

function BuyTicketStep2() {
    const { steps, activeStep, nextStep, backStep1, minutes, seconds, formatTime, handleSelectSeat, selectedSeats,
        totalPriceSeats, selectedFoods, quantityFoods, totalPriceFoods, totalPrice } = useBuyTicketContext();
    const { selectedMovie } = useMovieContext();
    const { ticketInfo, setTicketInfo } = useBuyTicketContext();
    const { setIsLoading } = useLayoutContext();

    const [tickets, setTickets] = useState([]);
    const [seats, setSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]); // Danh sách ghế đã đặt
    const token = localStorage.getItem("token");
    const firstClickSeat = useRef(true);

    const fetchSeats = async () => {
        setIsLoading(true);

        try {
            const res = await Api.get(endpoints.seats);
            const data = res.data.result;

            if (Array.isArray(data)) {
                const seatOfRoom = data.filter((s) => s.showRoom.showRoomName === ticketInfo.showEvent.showRoom.showRoomName);
                setSeats(seatOfRoom);
                localStorage.setItem('seatOfRoom', JSON.stringify(seatOfRoom));

                // Lấy ghế đã đặt từ ticket

                const resTickets = await Api.get(endpoints['tickets'], { headers: { Authorization: `Bearer ${token}` } });
                setTickets(resTickets.data?.result || []);

                if (tickets) {
                    const booked = tickets.map(ticket => ticket.seat.id);
                    setBookedSeats(booked);
                }
            } else {
                console.error("Không có danh sách nào tồn tại!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    useEffect(() => {
        fetchSeats();
    }, [ticketInfo]);

    const sortSeats = (a, b) => {
        const numA = parseInt(a.seatName.replace(/\D/g, ''));
        const numB = parseInt(b.seatName.replace(/\D/g, ''));
        return numA - numB;
    };

    useEffect(() => {
        const selectedSeatInfo = selectedSeats.map((seat) => ({
            id: seat.id,
            seatName: seat.seatName,
        }));

        setTicketInfo((prev) => ({
            ...prev,
            seats: selectedSeatInfo,
        }));
    }, [selectedSeats]);

    return (
        <>
            <Box component="main">
                <Grid container sx={{ mt: 3 }} spacing={5}>
                    <Grid item xs={8} component="seat">
                        <Box component="line">
                            <Box className="line-first mb-20">
                                <Box className="line-second">
                                    <Typography variant="h4" mt={2}>Màn hình</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Grid container spacing={10}>
                            <Grid item xs={6}>
                                <Grid container spacing={3} className="align-center" sx={{ placeContent: 'center' }}>
                                    <Grid item>
                                        <WeekendIcon className="seat" />
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="body1" className="text-normal">Ghế thường</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={6}>
                                <Grid container spacing={3} className="align-center seat-select" sx={{ placeContent: 'center' }}>
                                    <Grid item>
                                        <WeekendIcon className="seat seat-select" />
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="body1" className="text-normal">Ghế đã chọn</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Box component="list">
    <Box sx={{ mt: 5 }}>
        <Grid container spacing={4} className="seat-box">
            {seats.sort(sortSeats).map((s) => (
                <Grid item key={s.id}>
                    <div
                        onClick={() => {
                            if (!firstClickSeat.current && !bookedSeats.includes(s.id)) {
                                // Lần click đầu tiên: nếu ghế chưa đặt thì gọi handleSelectSeat
                                handleSelectSeat(s);
                            }
                            if (firstClickSeat.current) {
                                // Lần click thứ hai: xử lý logic đặc biệt
                                handleSelectSeat(s);
                                handleSelectSeat(s);
                                // if (!bookedSeats.includes(s.id)) {
                                //     handleSelectSeat(s); // Nếu ghế chưa đặt thì gọi thêm lần nữa
                                // }
                                firstClickSeat.current = false; // Reset trạng thái click
                            }
                        }}
                        style={{
                            cursor: bookedSeats.includes(s.id) ? 'not-allowed' : 'pointer',
                            opacity: bookedSeats.includes(s.id) ? 0.5 : 1 // Làm mờ ghế đã mua
                        }}
                    >
                        <WeekendIcon
                            className={`seat ${
                                selectedSeats.some((seat) => seat.id === s.id)
                                    ? 'seat-select' // Ghế đang được chọn
                                    : bookedSeats.includes(s.id)
                                    ? 'seat-booked seat-select seat-disabled' // Ghế đã mua
                                    : ''
                            }`}
                            style={{
                                color: bookedSeats.includes(s.id) ? 'gray' : 'inherit' // Màu xám cho ghế đã mua
                            }}
                        />
                        <Typography
                            variant="body2"
                            className={`seat-name ${bookedSeats.includes(s.id) ? 'seat-booked-name' : ''}`}
                            style={{
                                textDecoration: bookedSeats.includes(s.id) ? 'line-through' : 'none' // Gạch ngang tên ghế đã mua
                            }}
                        >
                            {s.seatName}
                        </Typography>
                    </div>
                </Grid>
            ))}
        </Grid>
    </Box>
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

                                {selectedFoods.map((item) => {
                                    const quantity = quantityFoods[item.itemName] || 0;
                                    if (quantity > 0) {
                                        const totalPriceFoodName = totalPriceFoods[item.itemName] || 0;

                                        return (
                                            <Grid container spacing={1} key={item.id} className="item-detail title-box" alignItems="center">
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
                                {selectedSeats.length > 0 ? (
                                    <>
                                        <Stack direction="row" alignItems="center">
                                            <Typography variant="h6" component="div" className="text-normal">
                                                Tổng tiền:
                                            </Typography>

                                            <Typography variant="h5" component="div" className="text-normal start-end">
                                                {totalPrice.toLocaleString()} VND
                                            </Typography>
                                        </Stack>

                                        <Button variant="contained" size="small" className="p-10 btn-bg btn-transition btn-total-money text-title" onClick={() => nextStep(selectedMovie)}>
                                            CHỌN ĐỒ ĂN ({activeStep + 1}/{steps.length})
                                        </Button>
                                    </>
                                ) : (
                                    <Typography variant="body2" component="div" className="text-normal none-seat p-1 text-center mt-2">
                                        Bạn chưa chọn ghế. Vui lòng chọn ghế!
                                    </Typography>
                                )}

                                <Box component="return" className="text-white flex-center mt-15 return pointer" onClick={backStep1}>
                                    <KeyboardBackspaceIcon className="mr-5" />
                                    <Typography variant="body2" component="div" className="text-normal">
                                        Trở lại
                                    </Typography>
                                </Box>

                                <Box component="countdown" className="flex-center mt-15">
                                    <Typography variant="body2" component="div" className="text-normal">
                                        Thời gian còn lại: {formatTime(minutes)}:{formatTime(seconds)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default BuyTicketStep2;
