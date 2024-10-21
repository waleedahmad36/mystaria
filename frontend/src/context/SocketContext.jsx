import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from 'socket.io-client';
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]); 
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        if (user?._id) {
            const newSocket = io("https://mystaria.onrender.com/", {
                query: { userId: user._id },
            });

            setSocket(newSocket);

            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            newSocket.on("notification", (notification) => {
                
                setNotifications(prev => [...prev, notification]);


                console.log("New notification:", notification);
            });

            return () => newSocket.close();
        }
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, notifications }}>
            {children}
        </SocketContext.Provider>
    );
};
