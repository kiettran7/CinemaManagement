import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from './MovieContext';

const BuyTicketContext = createContext();

export const BuyTicketContextProvider = ({ children }) => {
    // danh sách các bước
    const steps = [
        'Chọn thời gian và địa điểm',
        'Chọn ghế ngồi',
        'Chọn đồ ăn',
        'Thanh toán'
    ];

    const [activeStep, setActiveStep] = useState(0); // bước hiện tại
    const { selectedMovie } = useMovieContext(); // phim đã chọn mua
    const navigate = useNavigate();

    // các biến để đếm ngược thời gian
    const initialTotalSeconds = 300;
    const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds); // tổng giây
    const [minutes, setMinutes] = useState(initialTotalSeconds / 60); // phút
    const [seconds, setSeconds] = useState(initialTotalSeconds % 60); // giây
    const [isActiveTimer, setIsActiveTimer] = useState(false); // biến để khởi động timer

    const [selectedSeats, setSelectedSeats] = useState([]); // danh sách các ghế tick chọn
    const [totalPriceSeats, setTotalPriceSeats] = useState({}); // tổng tiền các loại ghế đã chọn

    const [selectedFoods, setSelectedFoods] = useState([]); // danh sách các dồ ăn đã chọn
    const [quantityFoods, setQuantityFoods] = useState({}); // số lượng đồ ăn chọn theo từng loại
    const [totalPriceFoods, setTotalPriceFoods] = useState({}); // tổng tiền các loại đồ ăn đã chọn

    const [totalPrice, setTotalPrice] = useState(0); // tổng tiền
    const [totalPaid, setTotalPaid] = useState(totalPrice);

    const resetContext = () => {
        setActiveStep(0);
        resetTimer();
        setSelectedSeats([]);
        setTotalPriceSeats({});
        setSelectedFoods([]);
        setQuantityFoods({});
        setTotalPrice(0);
        setTicketInfo({ showEvent: null, });
        // setTicketInfo({ schedule: null, time: null, room: null, showEvent: null, });
        setTotalPaid(0);
    }

    // chuyển sang bước tiếp theo
    const nextStep = (movieId) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        navigate(`/buy-ticket/step${activeStep + 2}?movieId=${movieId.id}`);
    };


    // lùi về bước trước đó
    const backStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        resetStep4();
        navigate(`/buy-ticket/step${activeStep}?movieId=${selectedMovie.id}`);
    };


    // lùi về step1
    const backStep1 = () => {
        setActiveStep(0);
        navigate(`/buy-ticket/step${1}?movieId=${selectedMovie.id}`);
        resetTimer();
        setIsActiveTimer(false);
        resetStep2();
        resetStep3();
        setTotalPrice(0);
    }


    // hook để bắt đầu đếm ngược thời gian
    useEffect(() => {
        if (isActiveTimer) {
            const interval = setInterval(() => {
                if (totalSeconds > 0) {
                    setTotalSeconds(totalSeconds - 1);
                    setMinutes(Math.floor(totalSeconds / 60));
                    setSeconds(totalSeconds % 60);
                } else {
                    clearInterval(interval);
                    handleTimeout();
                };
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isActiveTimer, totalSeconds]);


    // format lại kiểu hiển thị
    const formatTime = (time) => {
        return `${time.minutes} phút, ${time.seconds < 10 ? '0' : ''}${time.seconds} giây`;
    };


    // xử lý khi hết thời gian đếm ngược
    const handleTimeout = () => {
        alert('Hết thời gian chờ. Vui lòng thực hiện lại bước 1!');
        backStep1();
    };


    // reset lại đồng hồ đếm ngược
    const resetTimer = () => {
        setTotalSeconds(initialTotalSeconds);
        setMinutes(Math.floor(initialTotalSeconds / 60));
        setSeconds(initialTotalSeconds % 60);
        setTotalPaid(0);
    }


    // xử lý sự kiện nhấn chọn ghế
    const handleSelectSeat = (seat) => {
        if (seat !== null) {
            setSelectedSeats((prevSeats) => {
                const alreadySelected = prevSeats.some((s) => s.id === seat.id);
                const updatedSeats = alreadySelected
                    ? prevSeats.filter((s) => s.id !== seat.id)
                    : [...prevSeats, seat];

                calculatePriceSeats(updatedSeats);
                return updatedSeats;
            });
        }
    };

    // tính tổng tiền từng loại ghế
    const calculatePriceSeats = (updatedSeats) => {
        const price = selectedMovie ? selectedMovie.moviePrice : 0;
        const totalSeats = updatedSeats.length;

        setTotalPriceSeats(price * totalSeats)
    };


    // reset danh sách ghế đã chọn
    const resetStep2 = () => {
        setSelectedSeats([]);
        setTotalPriceSeats({});
    }


    // xử lý khi tăng số lượng 1 loại đồ ăn
    const handleIncrementFood = (item) => {
        setQuantityFoods((prev) => {
            const increment = (prev[item.itemName] || 0) + 1;
            const newQuantity = {
                ...prev,
                [item.itemName]: increment
            };

            // setSelectedFoods((prevSelected) => {
            //     if (!prevSelected.some((selectedItem) => selectedItem.itemName === item.itemName)) {
            //         return [...prevSelected, { ...item }];
            //     }
            //     return prevSelected;
            // });

            setSelectedFoods((prevSelected) => {
                // Tạo một mảng mới với bản sao của món ăn
                const updatedSelected = [...prevSelected, { ...item }];
                return updatedSelected; // Trả về danh sách đã cập nhật
            });

            calculatePriceFoods(item, increment);

            return newQuantity;
        });
    };

    // xử lý khi giảm số lượng 1 loại đồ ăn
    const handleDecrementFood = (item) => {
        setQuantityFoods((prev) => {
            const currentQuantity = prev[item.itemName] || 0;

            if (currentQuantity === 0) return prev;

            const decrement = currentQuantity - 1;
            const newQuantity = {
                ...prev,
                [item.itemName]: decrement
            };

            // if (decrement === 0) {
            //     setSelectedFoods((prevFoodItems) => {
            //         return prevFoodItems.filter((selectedItem) => selectedItem.itemName !== item.itemName);
            //     });
            // }

            if (decrement === 0) {
                // Xóa item khỏi danh sách đã chọn nếu số lượng là 0
                setSelectedFoods((prevFoodItems) => {
                    return prevFoodItems.filter((selectedItem) => selectedItem.itemName !== item.itemName);
                });
            } else {
                // Cập nhật selectedFoods để xóa bớt một bản sao của item
                setSelectedFoods((prevSelected) => {
                    // Tìm index của item trong selectedFoods
                    const index = prevSelected.findIndex((selectedItem) => selectedItem.itemName === item.itemName);

                    if (index !== -1) {
                        // Nếu item tồn tại trong selectedFoods, xóa bớt một bản sao
                        const updatedSelected = [...prevSelected];
                        updatedSelected.splice(index, 1); // Xóa bản sao đầu tiên tìm thấy
                        return updatedSelected;
                    }

                    return prevSelected; // Trả về danh sách không thay đổi nếu không tìm thấy
                });
            }

            calculatePriceFoods(item, decrement);

            return newQuantity;
        });
    };

    const calculatePriceFoods = (item, quantity) => {
        const total = item.itemPrice * quantity;

        setTotalPriceFoods((prev) => ({
            ...prev,
            [item.itemName]: total
        }));
    }

    const resetStep3 = () => {
        setSelectedFoods([]);
        setQuantityFoods(0);
        setTotalPriceFoods({});
    }


    // tính tổng tiền
    useEffect(() => {
        const totalStep3 = Object.values(totalPriceFoods).reduce((acc, price) => acc + price, 0);
        setTotalPrice(totalPriceSeats + totalStep3);
    }, [totalPriceSeats, totalPriceFoods]);

    const [ticketInfo, setTicketInfo] = useState({
        // schedule: null,
        // time: null,
        // room: null,
        showEvent: null,
    });

    const resetStep4 = () => {
        setTotalPaid(0);
    }

    return (
        <BuyTicketContext.Provider value={{
            steps, activeStep, nextStep, backStep, backStep1, minutes, seconds, formatTime, setIsActiveTimer,
            handleSelectSeat, selectedSeats, totalPriceSeats, handleIncrementFood, handleDecrementFood, selectedFoods, totalPaid, setTotalPaid,
            quantityFoods, totalPriceFoods, totalPrice, ticketInfo, setTicketInfo, resetContext, resetStep4
        }}>
            {children}
        </BuyTicketContext.Provider>
    );
};

export const useBuyTicketContext = () => useContext(BuyTicketContext)