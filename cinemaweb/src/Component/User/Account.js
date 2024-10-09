import React from 'react';
import './Style.css';
import { Avatar, Box, Button, Container, Divider, Grid, TextField, Typography } from '@mui/material';
import { useAuthContext } from '../../Context/AuthContext';
import dayjs from 'dayjs';

function Account() {
    const { currentUserInfo } = useAuthContext();

    return (
        <>
        <Container maxWidth="md">
            <Typography variant="h4" component="div" className="text-center p-30">
                TÀI KHOẢN
            </Typography>

            <Box className="a-container">
                <Grid container spacing={7}>
                    <Grid item>
                        <Avatar alt="My Avatar" sx={{ width: 115, height: 115 }} src={currentUserInfo.avatar} />
                    </Grid>

                    <Grid item>
                        <Grid container spacing={1.5} direction="column">
                            <Grid item>
                                <Typography variant="h6" component="div" className="text-main">
                                   {currentUserInfo.fullName}
                                </Typography>
                            </Grid>

                            <Grid item>
                                <Grid container spacing={7}>
                                    <Grid item>
                                        <Typography variant="body1" component="div" className="text-des">
                                            Tên đăng nhập: {currentUserInfo.username}
                                        </Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="body1" component="div" className="text-des">
                                            Ngày đăng ký: {dayjs(currentUserInfo.joinedDate).format('DD-MM-YYYY')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Button variant="contained" className="btn-bg">
                                    ĐĂNG XUẤT
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider className="divider" />

                <Box className="a-form" sx={{ '& .MuiTextField-root': { mt: 4, width: '100%' } }}>
                    <Grid container spacing={5}>
                        <Grid item xs={6}>
                            <TextField disabled label="Họ và tên" id="full-name" name="fullName" value={currentUserInfo.fullName} />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField disabled label="Số điện thoại" id="phone" name="phone" value={currentUserInfo.phone}/>
                        </Grid>
                    </Grid>

                    <TextField disabled id="email" label="Email" value={currentUserInfo.email} />

                    <TextField disabled id="password" name="password" type="password" label="Mật khẩu" defaultValue="123456" />

                    <TextField disabled id="birthday" name="birthday" label="Ngày tháng năm sinh" value={dayjs(currentUserInfo.birthday).format("DD-MM-YYYY")} />
                </Box>
            </Box>
        </Container>
        </>
    );
};

export default Account;