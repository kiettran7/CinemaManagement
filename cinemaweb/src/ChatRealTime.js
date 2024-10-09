// import React, { useEffect, useState } from "react";
// import {
// 	Autocomplete,
// 	TextField,
// 	Button,
// 	List,
// 	ListItem,
// 	ListItemText,
// 	Paper,
// 	ListItemAvatar,
// 	Avatar,
// 	Typography,
// 	Snackbar,
// 	Alert,
// } from "@mui/material";
// import {
// 	collection,
// 	doc,
// 	query,
// 	orderBy,
// 	onSnapshot,
// 	addDoc,
// 	serverTimestamp,
// } from "firebase/firestore";
// import { db } from "./firebase";
// import { blue } from "@mui/material/colors";
// import Api, { endpoints } from "./Api";
// import { Link, Navigate } from "react-router-dom";

// const ChatComponent = () => {
// 	const currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
// 	const [selectedReceiver, setSelectedReceiver] = useState(null);
// 	const [messages, setMessages] = useState([]);
// 	const [messageContent, setMessageContent] = useState("");
// 	const [filteredUsers, setFilteredUsers] = useState([]);
// 	const [nonAdminUsers, setNonAdminUsers] = useState([]);
// 	const token = localStorage.getItem("token");
// 	const [notification, setNotification] = useState(null);
// 	const [unreadCount, setUnreadCount] = useState(0);

// 	const handleReceiverSelect = (event, newValue) => {
// 		setSelectedReceiver(newValue ? newValue.email : null);
// 		setUnreadCount(0); // Reset unread count when a new receiver is selected
// 	};

// 	const fetchUsers = async () => {
// 		try {
// 			const response = await Api.get(endpoints['users'], {
// 				headers: { Authorization: `Bearer ${token}` },
// 			});
// 			setNonAdminUsers(response.data.result);
// 		} catch (error) {
// 			console.error("Error fetching users:", error);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchUsers();
// 	}, []);

// 	useEffect(() => {
// 		if (currentUserInfo && (currentUserInfo.roles[0].name === "CUSTOMER" || currentUserInfo.roles[0].name === "STAFF")) {
// 			const filtered = nonAdminUsers.filter(
// 				(u) => u.roles[0].name !== "ADMIN" && u.userId !== currentUserInfo.userId
// 			);
// 			setFilteredUsers(filtered);
// 		}

// 		if (currentUserInfo && selectedReceiver) {
// 			const sortedUsers = [currentUserInfo.email, selectedReceiver].sort();
// 			const chatId = `${sortedUsers[0]}_${sortedUsers[1]}`;
// 			const chatDocRef = doc(db, "chats", chatId);
// 			const messagesRef = collection(chatDocRef, "messages");
// 			const q = query(messagesRef, orderBy("timestamp"));

// 			const unsubscribe = onSnapshot(q, (querySnapshot) => {
// 				const messageList = [];
// 				querySnapshot.forEach((doc) => {
// 					messageList.push(doc.data());
// 				});
// 				setMessages(messageList);

// 				// Check for unread messages
// 				const unreadMessages = messageList.filter(
// 					(message) => message.receiver === currentUserInfo.email && message.sender !== currentUserInfo.email
// 				);
// 				if (unreadMessages.length > 0) {
// 					setUnreadCount(unreadMessages.length);
// 					setNotification(`You have ${unreadMessages.length} new message(s) from ${unreadMessages[0].sender}`);
// 				}
// 			});

// 			return () => unsubscribe();
// 		}
// 	}, [selectedReceiver, nonAdminUsers]);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (messageContent.trim() === "" || !selectedReceiver) return;

// 		try {
// 			const sortedUsers = [currentUserInfo.email, selectedReceiver].sort();
// 			const chatId = `${sortedUsers[0]}_${sortedUsers[1]}`;
// 			const chatDocRef = doc(db, "chats", chatId);
// 			const messagesRef = collection(chatDocRef, "messages");

// 			await addDoc(messagesRef, {
// 				sender: currentUserInfo.email,
// 				receiver: selectedReceiver,
// 				content: messageContent,
// 				timestamp: serverTimestamp(),
// 			});

// 			setMessageContent("");
// 			setNotification(null); // Clear notification when a message is sent
// 			setUnreadCount(0); // Reset unread count when a message is sent
// 		} catch (error) {
// 			console.error("Error sending message:", error);
// 		}
// 	};

// 	const handleCloseNotification = () => {
// 		setNotification(null);
// 	};

// 	return (
// 		<>
// 			{currentUserInfo ? (
// 				<div className="App container" style={{ backgroundColor: "#e3f2fd", padding: "20px", borderRadius: "8px" }}>
// 					<Typography
// 						variant="h4"
// 						sx={{ textAlign: "center", mt: 4, mb: 4, color: blue[800] }}
// 					>
// 						NHẮN TIN TRỰC TUYẾN THỜI GIAN THỰC SỬ DỤNG{" "}
// 						<p>
// 							<b style={{ color: blue[600] }}>FIREBASE</b>
// 						</p>
// 					</Typography>
// 					<div>
// 						<Autocomplete
// 							disablePortal
// 							id="receiver-select"
// 							options={filteredUsers}
// 							getOptionLabel={(option) => option.email}
// 							onChange={handleReceiverSelect}
// 							sx={{ width: "100%" }}
// 							renderInput={(params) => (
// 								<TextField
// 									{...params}
// 									label="Chọn người muốn gửi tin nhắn"
// 								/>
// 							)}
// 						/>
// 					</div>
// 					{selectedReceiver && (
// 						<>
// 							<Paper
// 								style={{
// 									maxHeight: 400,
// 									overflow: "auto",
// 									marginTop: 20,
// 									marginBottom: 20,
// 									padding: "10px",
// 									backgroundColor: "#ffffff",
// 								}}
// 							>
// 								<List>
// 									{messages.map((message, index) => (
// 										<ListItem
// 											key={index}
// 											style={{
// 												justifyContent:
// 													message.sender === currentUserInfo.email
// 														? "flex-end"
// 														: "flex-start",
// 											}}
// 										>
// 											<ListItemAvatar>
// 												<Avatar>
// 													{message.sender.charAt(0).toUpperCase()}
// 												</Avatar>
// 											</ListItemAvatar>
// 											<ListItemText
// 												primary={message.content}
// 												secondary={`Sent by: ${message.sender}`}
// 												style={{
// 													textAlign:
// 														message.sender === currentUserInfo.email
// 															? "right"
// 															: "left",
// 													backgroundColor:
// 														message.sender === currentUserInfo.email
// 															? "#dcf8c6"
// 															: "#e3f2fd",
// 													borderRadius: "10px",
// 													padding: "10px",
// 													maxWidth: "60%",
// 												}}
// 											/>
// 										</ListItem>
// 									))}
// 								</List>
// 							</Paper>
// 							<form
// 								onSubmit={handleSubmit}
// 								style={{
// 									display: "flex",
// 									alignItems: "center",
// 									marginTop: 20,
// 								}}
// 							>
// 								<TextField
// 									type="text"
// 									value={messageContent}
// 									onChange={(e) =>
// 										setMessageContent(e.target.value)
// 									}
// 									placeholder="Type your message..."
// 									fullWidth
// 									variant="outlined"
// 									sx={{ marginRight: 2 }}
// 								/>
// 								<Button
// 									type="submit"
// 									variant="contained"
// 									sx={{ backgroundColor: blue[600], "&:hover": { backgroundColor: blue[700] }}}
// 								>
// 									Gửi
// 								</Button>
// 							</form>
// 						</>
// 					)}
// 					<Snackbar open={Boolean(notification)} autoHideDuration={6000} onClose={handleCloseNotification}>
// 						<Alert onClose={handleCloseNotification} severity="info" sx={{ width: '100%' }}>
// 							{notification}
// 						</Alert>
// 					</Snackbar>
// 					{unreadCount > 0 && (
// 						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginTop: 2 }}>
// 							{unreadCount} tin nhắn chưa đọc
// 						</Typography>
// 					)}
// 				</div>
// 			) : (
// 				<Navigate to={"/login"} />
// 			)}
// 		</>
// 	);
// };

// export default ChatComponent;


import React, { useEffect, useState } from "react";
import {
	Autocomplete,
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	Paper,
	ListItemAvatar,
	Avatar,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import {
	collection,
	doc,
	query,
	orderBy,
	onSnapshot,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { blue } from "@mui/material/colors";
import Api, { endpoints } from "./Api";
import { Link, Navigate } from "react-router-dom";

const ChatComponent = () => {
	const currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
	const [selectedReceiver, setSelectedReceiver] = useState(null);
	const [messages, setMessages] = useState([]);
	const [messageContent, setMessageContent] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [nonAdminUsers, setNonAdminUsers] = useState([]);
	const token = localStorage.getItem("token");
	const [notification, setNotification] = useState(null);
	const [unreadCount, setUnreadCount] = useState(0);

	const handleReceiverSelect = (event, newValue) => {
		setSelectedReceiver(newValue ? newValue.email : null);
		setUnreadCount(0); // Reset unread count when a new receiver is selected
	};

	const fetchUsers = async () => {
		try {
			const response = await Api.get(endpoints['users'], {
				headers: { Authorization: `Bearer ${token}` },
			});
			setNonAdminUsers(response.data.result);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		if (currentUserInfo) {
			const filtered = nonAdminUsers.filter(
				(u) => u.roles[0].name !== "ADMIN" && u.userId !== currentUserInfo.userId
			);
			setFilteredUsers(filtered);
		}

		if (currentUserInfo && selectedReceiver) {
			const sortedUsers = [currentUserInfo.email, selectedReceiver].sort();
			const chatId = `${sortedUsers[0]}_${sortedUsers[1]}`;
			const chatDocRef = doc(db, "chats", chatId);
			const messagesRef = collection(chatDocRef, "messages");
			const q = query(messagesRef, orderBy("timestamp"));

			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const messageList = [];
				querySnapshot.forEach((doc) => {
					messageList.push(doc.data());
				});
				setMessages(messageList);

				// Check for unread messages
				const unreadMessages = messageList.filter(
					(message) => message.receiver === currentUserInfo.email && message.sender !== currentUserInfo.email
				);
				
				const unreadCountFromSender = unreadMessages.length;

				if (unreadCountFromSender > 0) {
					setUnreadCount(unreadCountFromSender);
					setNotification(`You have ${unreadCountFromSender} new message(s) from ${unreadMessages[0].sender}`);
				} else {
					setUnreadCount(0); // Reset if there are no unread messages
				}
			});

			return () => unsubscribe();
		}
	}, [selectedReceiver, nonAdminUsers]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (messageContent.trim() === "" || !selectedReceiver) return;

		try {
			const sortedUsers = [currentUserInfo.email, selectedReceiver].sort();
			const chatId = `${sortedUsers[0]}_${sortedUsers[1]}`;
			const chatDocRef = doc(db, "chats", chatId);
			const messagesRef = collection(chatDocRef, "messages");

			await addDoc(messagesRef, {
				sender: currentUserInfo.email,
				receiver: selectedReceiver,
				content: messageContent,
				timestamp: serverTimestamp(),
			});

			setMessageContent("");
			setNotification(null); // Clear notification when a message is sent

			// Reset unread count for the other user
			if (currentUserInfo.email === selectedReceiver) {
				setUnreadCount(0);
			}
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const handleCloseNotification = () => {
		setNotification(null);
	};

	return (
		<>
			{currentUserInfo ? (
				<div className="App container" style={{ backgroundColor: "#e3f2fd", padding: "20px", borderRadius: "8px" }}>
					<Typography
						variant="h4"
						sx={{ textAlign: "center", mt: 4, mb: 4, color: blue[800] }}
					>
						NHẮN TIN TRỰC TUYẾN THỜI GIAN THỰC SỬ DỤNG{" "}
						<p>
							<b style={{ color: blue[600] }}>FIREBASE</b>
						</p>
					</Typography>
					<div>
						<Autocomplete
							disablePortal
							id="receiver-select"
							options={filteredUsers}
							getOptionLabel={(option) => option.email}
							onChange={handleReceiverSelect}
							sx={{ width: "100%" }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Chọn người muốn gửi tin nhắn"
								/>
							)}
						/>
					</div>
					{selectedReceiver && (
						<>
							<Paper
								style={{
									maxHeight: 400,
									overflow: "auto",
									marginTop: 20,
									marginBottom: 20,
									padding: "10px",
									backgroundColor: "#ffffff",
								}}
							>
								<List>
									{messages.map((message, index) => (
										<ListItem
											key={index}
											style={{
												justifyContent:
													message.sender === currentUserInfo.email
														? "flex-end"
														: "flex-start",
											}}
										>
											<ListItemAvatar>
												<Avatar>
													{message.sender.charAt(0).toUpperCase()}
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={message.content}
												secondary={`Sent by: ${message.sender}`}
												style={{
													textAlign:
														message.sender === currentUserInfo.email
															? "right"
															: "left",
													backgroundColor:
														message.sender === currentUserInfo.email
															? "#dcf8c6"
															: "#e3f2fd",
													borderRadius: "10px",
													padding: "10px",
													maxWidth: "60%",
												}}
											/>
										</ListItem>
									))}
								</List>
							</Paper>
							<form
								onSubmit={handleSubmit}
								style={{
									display: "flex",
									alignItems: "center",
									marginTop: 20,
								}}
							>
								<TextField
									type="text"
									value={messageContent}
									onChange={(e) =>
										setMessageContent(e.target.value)
									}
									placeholder="Type your message..."
									fullWidth
									variant="outlined"
									sx={{ marginRight: 2 }}
								/>
								<Button
									type="submit"
									variant="contained"
									sx={{ backgroundColor: blue[600], "&:hover": { backgroundColor: blue[700] }}}
								>
									Gửi
								</Button>
							</form>
						</>
					)}
					<Snackbar open={Boolean(notification)} autoHideDuration={6000} onClose={handleCloseNotification}>
						<Alert onClose={handleCloseNotification} severity="info" sx={{ width: '100%' }}>
							{notification}
						</Alert>
					</Snackbar>
					{unreadCount > 0 && (
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginTop: 2 }}>
							{unreadCount} tin nhắn chưa đọc
						</Typography>
					)}
				</div>
			) : (
				<Navigate to={"/login"} />
			)}
		</>
	);
};

export default ChatComponent;
