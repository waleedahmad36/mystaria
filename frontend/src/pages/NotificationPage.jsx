import React, { useEffect, useState } from 'react';
import { Box, Text, VStack,  useColorMode, Image, HStack, Button, Tooltip, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
import {  DeleteIcon } from '@chakra-ui/icons';
import themeAtom from '../atoms/themeAtom';
import Loader from '../components/Loader';

const NotificationsPage = () => {
  const user = useRecoilValue(userAtom);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  const { socket } = useSocket();
  const theme = useRecoilValue(themeAtom)

  const fetchNotifications = async () => {
    if (!user) return; // Ensure the user is logged in before making the request

    try {
      const response = await fetch(`/api/notifications?userId=${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Include your token if needed
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        setNotifications((prev) => [...prev, notification]);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);


  const handleNotificationClick = (notification) => {
    if (notification.type === 'follow') {
      window.location.href = `/${notification.sender.username}`; 
    } else if (notification.type === 'like' || notification.type === 'reply') {
      window.location.href = `/${notification.receiver}/post/${notification.post}`; 
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ notificationId }),
      });


      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

 
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  
  const deleteAllNotifications = async () => {
    try {
      await fetch(`/api/notifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });
  
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };
  

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <Loader />
      </Box>
    );
  }

  return (
    <VStack spacing={4} p={4}>


    {notifications.length === 0 ? (
      <Text>No notifications</Text>
    ) : (
      notifications?.map((notification) => (
        <Box
          key={notification._id}
          p={4}
          width="100%"
          maxW="full"
          borderRadius="md"
          boxShadow="md"
          bg={colorMode === 'dark' ? 'gray.dark' : 'white'}
          color={colorMode === 'dark' ? 'white' : 'gray.800'}
          cursor="pointer"
          _hover={{ bg: colorMode === 'dark' ? 'gray.900' : 'gray.100' }}
          onClick={() => {notification?.sender?.username && handleNotificationClick(notification)}}
        >
          <HStack spacing={3} justifyContent="space-between">
            <HStack spacing={3}>

              {notification?.sender?.profilePic && (
                <Image
                  src={notification?.sender?.profilePic}
                  alt={notification?.sender?.username}
                  borderRadius="full"
                  boxSize="40px"
                />
              )}
              <VStack align="start">
                <Text fontWeight="bold">{notification?.sender?.username}</Text>
                <Text>{notification?.message}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(notification?.createdAt).toLocaleString()}
                </Text>
              </VStack>
            </HStack>

            <Menu>
              <MenuButton as={Button} rightIcon={<p>...</p>} size="sm" variant="" color={theme}
              onClick={(e) => e.stopPropagation()}
              >
              </MenuButton>
              <MenuList>
                {!notification.read && (
                  <MenuItem onClick={(e) =>{
                    e.stopPropagation();
                    markNotificationAsRead(notification._id);
                    fetchNotifications();
                }
                  } >Mark as Read</MenuItem>
                )}
                <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                    fetchNotifications();
                }
                } >Delete</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Box>
      ))
    )}

{notifications.length > 0 && (
      <Tooltip label="Delete All Notifications" aria-label="Delete All Notifications Tooltip">
        <IconButton
          icon={<DeleteIcon />}
          colorScheme="gray"
          onClick={deleteAllNotifications}
          aria-label="Delete All Notifications"
        />
      </Tooltip>
    )}
  </VStack>
  );
};

export default NotificationsPage;
