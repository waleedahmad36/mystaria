import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext"; // Assuming you are using context for socket

const NotificationComponent = () => {
	const { socket } = useSocket();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (socket) {
			// Listen for incoming notifications
			socket.on("notification", (notification) => {
                console.log(notification);  // Add this to check the incoming notification
                setNotifications((prevNotifications) => [...prevNotifications, notification]);
            });
		}
	}, [socket]);

	// Display notifications
	return (
		<div>
            <p>Notification Component</p>
			{notifications.map((notif, index) => (
				<div key={index} className="notification">
					<p>{notif.message}</p>
				</div>
			))}
		</div>
	);
};

export default NotificationComponent;
