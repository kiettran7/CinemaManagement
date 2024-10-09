import React, { useEffect, useState } from "react";
import './Style.css';
import { Box, Grid, Typography, Button, Stack } from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useBuyTicketContext } from "../../Context/BuyTicketContext";
import { useMovieContext } from "../../Context/MovieContext";

function BuyTicketStep1() {
    const { nextStep, setIsActiveTimer, setTicketInfo } = useBuyTicketContext();
    const { selectedMovie } = useMovieContext();
    
    const [selectedDate, setSelectedDate] = useState(dayjs());
    
    const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;

    const goStep2 = (showEvent) => {
        setTicketInfo({
            showEvent,
        });
        nextStep(selectedMovie);
        setIsActiveTimer(true);
    }

    // const goStep2 = (schedule, time, room, showEvent) => {
    //     setTicketInfo({
    //         schedule,
    //         time,
    //         room,
    //         showEvent,
    //     });
    //     nextStep(selectedMovie);
    //     setIsActiveTimer(true);
    // }

    const getFilteredShowTimes = () => {
        if (!formattedDate || !selectedMovie) return [];
    
        return selectedMovie.showEvents
            .filter((show) => dayjs(show.showSchedule.showDate).isSame(dayjs(formattedDate), 'day'))
            .map((show) => ({
                showEvent: show,
                schedule: show.showSchedule,
                time: show.showtime,      
                room: show.showRoom,
            }));
    };

    const filteredShowTimes = getFilteredShowTimes();
    console.log(filteredShowTimes);

    return (
        <>
        <Box component="booking">
            <Grid container sx={{ mt: 3 }} spacing={5}>
                <Grid item xs={4.5} component="calendar">
                    <Box className="radius flex-center ticket-border-box">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateCalendar']}>
                                <DateCalendar className="ticket-border-box ticket-m" defaultValue={dayjs(Date())} disablePast views={['year', 'month', 'day']}
                                    onChange={(newDate) => setSelectedDate(newDate)}/>
                            </DemoContainer>
                        </LocalizationProvider>
                    </Box>
                </Grid>

                <Grid item md={7.5} component="info">
                    <Box className="radius ticket-p ticket-border-box">
                        <Box sx={{ mb: 3 }} className="radius ticket-info-p ticket-border-box">
                            <Typography gutterBottom variant="h6" component="div">
                                KLH Cinema Nhà Bè
                            </Typography>

                            <Typography variant="body2" component="div" className="text-normal text-des">
                                Khu dân cư Nhơn Đức, Nhà Bè, Thành phố Hồ Chí Minh
                            </Typography>

                            <Stack direction="row" spacing={4} component="showing">
                                {filteredShowTimes.map((info, index) => (
                                    <Box component="time" key={index}>
                                        {/* <Button className="text-center show-time text-white" onClick={() => goStep2(info.schedule, info.time, info.room)}> */}
                                        <Button className="text-center show-time text-white" onClick={() => goStep2(info.showEvent)}>
                                            {info.time.startTime}
                                        </Button>

                                        <Stack direction="row" spacing={1} className="text-center flex-center mt-10" component="des">
                                            <Typography variant="body1" fontSize={12} className="text-normal border-2 des-box">
                                                {info.time.endTime}
                                            </Typography>

                                            <Typography variant="body1" fontSize={12} className="text-normal border-2 des-box">
                                                {info.room.showRoomName}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        </>
    );
};

export default BuyTicketStep1;