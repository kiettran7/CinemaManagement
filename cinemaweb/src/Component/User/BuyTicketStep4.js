import React, { useEffect, useState } from "react";
import './Style.css';
import { Box, Grid, Typography, Stack, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Autocomplete, TextField, Snackbar } from "@mui/material";
import { useMovieContext } from "../../Context/MovieContext";
import { useBuyTicketContext } from "../../Context/BuyTicketContext";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useLayoutContext } from '../../Context/LayoutContext';
import Api, { endpoints } from "../../Api";
import { useAuthContext } from "../../Context/AuthContext";

function BuyTicketStep4() {
    const { steps, activeStep, backStep, minutes, seconds, formatTime, selectedSeats, totalPriceSeats, totalPaid, setTotalPaid,
        selectedFoods, quantityFoods, totalPriceFoods, totalPrice, ticketInfo, setTicketInfo } = useBuyTicketContext();
    const { selectedMovie } = useMovieContext();
    const { setIsLoading, Loading } = useLayoutContext();
    const { currentUserInfo } = useAuthContext();

    const [promotions, setPromotions] = useState([]);
    const [selectedPromo, setSelectedPromo] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [ticketIds, setTicketIds] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [pdfUrl, setPdfUrl] = useState(""); // URL của file PDF

    const token = localStorage.getItem("token");

    const sortSeats = (a, b) => {
        const numA = parseInt(a.seatName.replace(/\D/g, ''));
        const numB = parseInt(b.seatName.replace(/\D/g, ''));
        return numA - numB;
    };

    const handlePayMethod = (e) => {
        const selectedMethod = e.target.value;
        setPaymentMethod(selectedMethod);
        setTicketInfo((prevInfo) => ({
            ...prevInfo,
            method: selectedMethod,
        }));
    };

    const fetchPromotions = async () => {
        setIsLoading(true);

        try {
            const res = await Api.get(endpoints.promotions);
            const data = res.data.result;

            if (Array.isArray(data)) {
                setPromotions(data);
                localStorage("promotions", JSON.stringify(data));
            } else {
                console.log("Không có danh sách");
            }
        } catch (error) {
            console.log("Lỗi khi lấy danh sách mã giảm giá");
        } finally {
            setIsLoading(false);
        };
    };

    const handleChangeDiscount = (event, value) => {
        setSelectedPromo(value);

        const totalDiscount = value.reduce((acc, promotion) => acc + promotion.discountValue, 0);
        const totalDiscounted = totalPrice * (1 - totalDiscount);

        setTotalPaid(totalDiscounted);
    };

    useEffect(() => {
        fetchPromotions();
    }, [setIsLoading]);

    const handleCreateTicketsAndBill = async () => {
        setIsLoading(true);
        setMessage("");
        const newTicketIds = [];

        try {
            // Tạo ticket
            for (const seatReq of selectedSeats) {
                const res = await Api.post(endpoints["create-tickets"], {
                    "bookingType": "ONLINE",
                    "ticketPrice": selectedMovie.moviePrice,
                    "status": "PRE_BOOKED",
                    "showEvent": ticketInfo.showEvent.id,
                    "seat": seatReq.id,
                    "customer": currentUserInfo.userId,
                    "staff": null,
                    "movie": selectedMovie.id,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const temp = res.data.result.id;
                newTicketIds.push(temp);
            };

            // Lưu id ticket vừa tạo
            setTicketIds(newTicketIds);
            console.log("Tạo vé thành công!");

            // Tạo bill
            const promotionId = selectedPromo.length > 0 ? selectedPromo[0].id : null;

            // // Gọi API để lấy paymentUrl
            // const resPayment = await Api.get(`${endpoints["vn-pay"]}?amount=${totalPaid}`);
            // const paymentResponse = resPayment.data
            // console.log("AAAAAAAAA: ", paymentResponse)
            // if (paymentResponse.code === 200) {
            //     const paymentUrl = paymentResponse.data.paymentUrl;
            //     const vnp_TmnCode = paymentResponse.data.vnp_TmnCode;

            //     // Chuyển hướng người dùng tới paymentUrl
            //     window.location.href = paymentUrl;

            //     var billResponse;

            //     // Chờ người dùng thanh toán và sau đó gọi API tạo hóa đơn
            //     for (const promoReq of selectedPromo) {
            //         billResponse = await Api.post(endpoints["create-bill"], {
            //             "promotion": promoReq.id,
            //             "tickets": newTicketIds,
            //             "items": selectedFoods.map(food => food.id),
            //             "vnp_TmnCode": vnp_TmnCode,
            //         }, {
            //             headers: {
            //                 Authorization: `Bearer ${token}`,
            //             },
            //         });
            //     };

            //     if (promotionId === null) {
            //         billResponse = await Api.post(endpoints["create-bill"], {
            //             "promotion": null,
            //             "tickets": newTicketIds,
            //             "items": selectedFoods.map(food => food.id),
            //             "ticketInfo": ticketInfo,
            //             "vnp_TmnCode": vnp_TmnCode,
            //         }, {
            //             headers: {
            //                 Authorization: `Bearer ${token}`,
            //             },
            //         });
            //     };

            //     if (billResponse.code === 200) {
            //         // Lưu PDF URL để hiển thị
            //         setPdfUrl(billResponse.data.pdfUrl);
            //     } else {
            //         setMessage("Tạo hóa đơn không thành công!");
            //     }
            console.log("TTTTTTTTTT: ", selectedFoods.map(food => food.id))
            var billRes;
            for (const promoReq of selectedPromo) {
                billRes = await Api.post(endpoints["create-bill"], {
                    "promotion": promoReq.id,
                    "tickets": newTicketIds,
                    "items": selectedFoods ? selectedFoods.map(food => food.id) : null,
                    // "ticketInfo": ticketInfo,
                    // "vnp_TmnCode": vnp_TmnCode,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            };

            if (promotionId === null) {
                billRes = await Api.post(endpoints["create-bill"], {
                    "promotion": null,
                    "tickets": newTicketIds,
                    "items": selectedFoods ? selectedFoods.map(food => food.id) : null,
                    // "ticketInfo": ticketInfo,
                    // "vnp_TmnCode": vnp_TmnCode,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            };

            console.log("aAAAAAA: ", billRes.data.result.id)
            // Gọi API để lấy paymentUrl
            const resPayment = await Api.get(`${endpoints["vn-pay"]}?amount=${Math.round(totalPaid).toString()}&movie=${selectedMovie.id}&bill=${billRes.data.result.id}`);
            const paymentResponse = resPayment.data

            if (paymentResponse.code === 200) {
                const paymentUrl = paymentResponse.data.paymentUrl;

                // Chuyển hướng người dùng tới paymentUrl
                window.location.href = paymentUrl;
            }

            setPdfUrl(billRes.data.result.pdfUrl);

            setOpenSnackbar(true);
            setMessage("Đặt vé thành công!");
            // }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    const test = () => {
        console.log("abc: ", selectedFoods.map(food => food.id));
    }

    return (
        <>
            <Box component="main">
                <Grid container sx={{ mt: 3 }} spacing={5}>
                    <Grid item xs={8} component="payment">
                        <Box className="radius ticket-border-box">
                            <Box component="methods">
                                <FormControl sx={{ width: '100%' }}>
                                    <FormLabel id="radio-payment-methods" className="text-white title-box flex-center">
                                        <Typography variant="h6" className="title-m">
                                            Phương thức thanh toán
                                        </Typography>
                                    </FormLabel>

                                    <RadioGroup aria-labelledby="radio-payment-methods" name="payment-methods" className="ml-30 mt-10 mb-3" onChange={handlePayMethod}>
                                        <FormControlLabel value="vnpay" control={<Radio className="text-des" />}
                                            label="Thanh toán qua VNPAY (Visa, Master, Amex, JCB,...)" />
                                    </RadioGroup>
                                </FormControl>


                                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                    <Button variant="contained" onClick={handleCreateTicketsAndBill} disabled={Loading}>
                                        {Loading ? "Đang xử lý..." : "Đặt vé"}
                                    </Button>
                                </Stack>

                                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message={message} />

                                {/* Hiển thị nút để mở PDF nếu có pdfUrl */}
                                {pdfUrl && (
                                    <Box mt={2}>
                                        <Typography variant="h6">Hóa đơn đã được tạo!</Typography>
                                        <Stack direction="row" spacing={2} mt={1}>
                                            <Button variant="contained" href="/" onClick={() => window.location.href = "/"}>Trở về trang chủ</Button>
                                            <Button variant="contained" href={pdfUrl} target="_blank">Xem Hóa Đơn PDF</Button>
                                        </Stack>
                                    </Box>
                                )}


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
                                <Box className="promotion-box mb-20">
                                    <Autocomplete multiple id="promotion-tags" options={promotions} getOptionLabel={(option) => option.promotionName}
                                        isOptionEqualToValue={(option, value) => option.id === value.id} onChange={handleChangeDiscount} filterSelectedOptions renderInput={(params) => (
                                            <TextField {...params} label="Chọn mã giảm giá" placeholder="Chọn mã giảm giá" />
                                        )} />
                                </Box>

                                <Stack direction="row" alignItems="center">
                                    <Typography variant="h6" component="div" className="text-normal">
                                        Tổng tiền:
                                    </Typography>

                                    <Typography variant="h5" component="div" className={`text-normal start-end ${totalPaid > 0 ? 'text-especial' : ''}`}>
                                        {totalPrice.toLocaleString()} VND
                                    </Typography>
                                </Stack>

                                {totalPaid > 0 &&
                                    <Typography variant="h5" component="div" className="text-normal text-end mt-2">
                                        {totalPaid.toLocaleString()} VND
                                    </Typography>
                                }

                                <Button variant="contained" size="small" className="p-10 btn-bg btn-transition btn-total-money text-title"
                                    onClick={handleCreateTicketsAndBill} disabled={!paymentMethod} >
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

            <Snackbar open={openSnackbar} autoHideDuration={15000} onClose={() => setOpenSnackbar(false)}
                message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />

            <Loading />
        </>
    )
};

export default BuyTicketStep4;