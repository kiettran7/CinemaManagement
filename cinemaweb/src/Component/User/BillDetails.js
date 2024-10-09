// import React, { useEffect, useState } from 'react';
// import Api, { endpoints } from "../../Api";
// import { useAuthContext } from '../../Context/AuthContext';
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   Grid,
//   CircularProgress,
//   Box,
//   CardActions
// } from '@mui/material';

// // const BillDetails = () => {
// function BillDetails() {
//   const { currentUserInfo } = useAuthContext(); // Lấy thông tin người dùng hiện tại từ AuthContext
//   const [bills, setBills] = useState([]);
//   const [tickets, setTickets] = useState([]);
//   const [billsRes, setBillsRes] = useState([]);
//   const [ticketsRes, setTicketsRes] = useState([]);
//   const [filteredBills, setFilteredBills] = useState([]);
//   const token = localStorage.getItem("token");
//   const [loading, setLoading] = useState(false);

//   const removeDuplicateBills = (tickets) => {
//     const uniqueBills = new Set(); // Tạo Set để lưu trữ bill.id duy nhất
//     const filteredTickets = []; // Tạo danh sách lưu các tickets không bị trùng bill.id

//     tickets.forEach(ticket => {
//       const billId = ticket.bill.id; // Lấy bill.id của ticket hiện tại

//       // Kiểm tra nếu billId chưa tồn tại trong Set
//       if (!uniqueBills.has(billId)) {
//         uniqueBills.add(billId); // Thêm billId vào Set
//         filteredTickets.push(ticket); // Thêm ticket vào danh sách kết quả
//       }
//     });

//     return filteredTickets; // Trả về danh sách tickets đã được lọc
//   };

//   const fetchBills_Tickets = async () => {
//     setLoading(true);
//     try {
//       const [resBills, resTickets] = await Promise.all([
//         Api.get(endpoints['bills'], { headers: { Authorization: `Bearer ${token}` } }),
//         Api.get(endpoints['tickets'], { headers: { Authorization: `Bearer ${token}` } })
//       ]);

//       setBillsRes(resBills.data.result);
//       setTicketsRes(resTickets.data.result);

//       console.log("1. 2 API nè: ", billsRes, ticketsRes)

//       // Lọc tickets theo người dùng hiện tại
//       const filteredTickets = ticketsRes.filter(ticket =>
//         ticket.customer && ticket.customer.userId === currentUserInfo.userId
//       );

//       setTickets(filteredTickets);
//       setBills(billsRes);

//       console.log("2. Lọc tickets theo người dùng hiện tại (lấy từ ticketAPI): ", filteredTickets)
//       console.log("3. Hóa đơn (từ API): ", bills)

//       // Lọc bills dựa trên thông tin ticket
//       const ticket_billUnique = filteredTickets.length > 0
//         ? removeDuplicateBills(filteredTickets.filter((filteredTicket) => filteredTicket.bill !== null && filteredTicket.bill.id))
//         : null;
//       console.log("4. lấy các vé chung 1 bill: ", ticket_billUnique)

//       // Tạo Set từ các bill.id trong ticket_billUnique
//       const billIdsSet = new Set(ticket_billUnique?.map(ticket => ticket?.bill && ticket.bill.id));

//       // Lọc bills dựa trên Set chứa các bill.id
//       setFilteredBills(bills.filter(bill => billIdsSet.has(bill.id)));

//       console.log("5. in lại lần cuối cho bill - ticket: ", bills, tickets)

//     } catch (error) {
//       console.error("Error fetching tickets:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBills_Tickets();
//   }, []);

//   // Xử lý khi click tải PDF
//   const handlePdfDownload = (pdfUrl) => {
//     window.open(pdfUrl, '_blank');
//   };

//   return (
//     <Container>
//       <Box mt={4}>
//         <Typography variant="h4" align="center" gutterBottom>
//           THÔNG TIN HÓA ĐƠN CỦA BẠN
//         </Typography>

//         {loading ? (
//           <Typography variant="body1">Đang tải dữ liệu...</Typography>
//         ) : (
//           <>
//             <Grid container spacing={3} justifyContent="center">
//               {filteredBills.length > 0 ? (
//                 filteredBills.map((bill) => (
//                   <Grid item xs={12} sm={6} md={4} key={bill.id}>
//                     <Card elevation={3}>
//                       <CardContent>
//                         <Typography variant="h6" gutterBottom>
//                           Mã hóa đơn: {bill.id}
//                         </Typography>
//                         <Typography variant="body2">
//                           <strong>Tổng hóa đơn chưa áp dụng khuyến mãi:</strong> {bill.totalAmount} VND
//                         </Typography>
//                         <Typography variant="body2">
//                           <strong>Số tiền khách hàng đã thanh toán:</strong> {bill.customerPaid} VND
//                         </Typography>
//                         <Typography variant="body2">
//                           <strong>Khuyến mãi áp dụng:</strong> {bill.promotion ? bill.promotion.promotionName : 'None'}
//                         </Typography>
//                       </CardContent>
//                       <CardActions>
//                         <Button
//                           size="small"
//                           color="primary"
//                           onClick={() => handlePdfDownload(bill.pdfUrl)}
//                         >
//                           Download chi tiết hóa đơn .pdf
//                         </Button>
//                       </CardActions>
//                     </Card>
//                   </Grid>
//                 ))
//               ) : (
//                 <Grid item xs={12}>
//                   <Typography variant="h6" color="textSecondary" align="center">
//                     KHÔNG TÌM THẤY HÓA ĐƠN.
//                   </Typography>
//                 </Grid>
//               )}
//             </Grid>

//             {/* Hiển thị thông tin người dùng hiện tại */}
//             <Box mt={5}>
//               <Typography variant="h5" align="center" gutterBottom>
//                 THÔNG TIN TÀI KHOẢN CÁ NHÂN
//               </Typography>
//               {currentUserInfo ? (
//                 <Card elevation={2}>
//                   <CardContent>
//                     <Typography variant="body1">
//                       <strong>User ID:</strong> {currentUserInfo.userId}
//                     </Typography>
//                     <Typography variant="body1">
//                       <strong>Name:</strong> {currentUserInfo.fullName}
//                     </Typography>
//                     <Typography variant="body1">
//                       <strong>Email:</strong> {currentUserInfo.email}
//                     </Typography>
//                     <Typography variant="body1">
//                       <strong>Phone:</strong> {currentUserInfo.phone}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <CircularProgress />
//               )}
//             </Box>
//           </>
//         )}

//       </Box>
//     </Container>
//   );
// };

// export default BillDetails;

import React, { useEffect, useState } from 'react';
import Api, { endpoints } from "../../Api";
import { useAuthContext } from '../../Context/AuthContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Box,
  CardActions
} from '@mui/material';

function BillDetails() {
  const { currentUserInfo } = useAuthContext(); 
  const [bills, setBills] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const removeDuplicateBills = (tickets) => {
    const uniqueBills = new Set();
    const filteredTickets = [];

    tickets.forEach(ticket => {
      const billId = ticket.bill.id;
      if (!uniqueBills.has(billId)) {
        uniqueBills.add(billId);
        filteredTickets.push(ticket);
      }
    });

    return filteredTickets;
  };

  const fetchBills_Tickets = async () => {
    setLoading(true);
    try {
      const [resBills, resTickets] = await Promise.all([
        Api.get(endpoints['bills'], { headers: { Authorization: `Bearer ${token}` } }),
        Api.get(endpoints['tickets'], { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const billsRes = resBills.data.result;
      const ticketsRes = resTickets.data.result;

      const filteredTickets = ticketsRes.filter(ticket =>
        ticket.customer && ticket.customer.userId === currentUserInfo.userId
      );

      setTickets(filteredTickets);
      setBills(billsRes);

      const ticket_billUnique = filteredTickets.length > 0
        ? removeDuplicateBills(filteredTickets.filter((filteredTicket) => filteredTicket.bill !== null && filteredTicket.bill.id))
        : null;

      const billIdsSet = new Set(ticket_billUnique?.map(ticket => ticket?.bill && ticket.bill.id));

      setFilteredBills(bills.filter(bill => billIdsSet.has(bill.id)));

    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills_Tickets();
  }, []);

  const handlePdfDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          THÔNG TIN HÓA ĐƠN CỦA BẠN
        </Typography>

        <Button variant="contained" color="primary" onClick={fetchBills_Tickets}>
          TẢI LẠI TRANG
        </Button>

        {loading ? (
          <Typography variant="body1">Đang tải dữ liệu...</Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <Grid item xs={12} sm={6} md={4} key={bill.id}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Mã hóa đơn: {bill.id}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Tổng hóa đơn chưa áp dụng khuyến mãi:</strong> {bill.totalAmount} VND
                        </Typography>
                        <Typography variant="body2">
                          <strong>Số tiền khách hàng đã thanh toán:</strong> {bill.customerPaid} VND
                        </Typography>
                        <Typography variant="body2">
                          <strong>Khuyến mãi áp dụng:</strong> {bill.promotion ? bill.promotion.promotionName : 'None'}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handlePdfDownload(bill.pdfUrl)}
                        >
                          Download chi tiết hóa đơn .pdf
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" color="textSecondary" align="center">
                    KHÔNG TÌM THẤY HÓA ĐƠN.
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Box mt={5}>
              <Typography variant="h5" align="center" gutterBottom>
                THÔNG TIN TÀI KHOẢN CÁ NHÂN
              </Typography>
              {currentUserInfo ? (
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="body1">
                      <strong>User ID:</strong> {currentUserInfo.userId}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Name:</strong> {currentUserInfo.fullName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {currentUserInfo.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Phone:</strong> {currentUserInfo.phone}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default BillDetails;
