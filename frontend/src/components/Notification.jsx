import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext"; 

const NotificationComponent = () => {
	const { socket } = useSocket();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (socket) {
			socket.on("notification", (notification) => {
                console.log(notification);  
                setNotifications((prevNotifications) => [...prevNotifications, notification]);
            });
		}
	}, [socket]);
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
