import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Spinner, useColorMode, Image, HStack, Button, Tooltip, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import themeAtom from '../atoms/themeAtom';

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
        // Update notifications state with the new notification
        setNotifications((prev) => [...prev, notification]);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

  // Handle notification click for redirection
  const handleNotificationClick = (notification) => {
    if (notification.type === 'follow') {
      window.location.href = `/${notification.sender.username}`; // Redirect to user's profile
    } else if (notification.type === 'like' || notification.type === 'reply') {
      window.location.href = `/${notification.receiver}/post/${notification.post}`; // Redirect to the specific post
    }
  };

  // Mark a notification as read
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

      // Update the notification list, marking the notification as read
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete a single notification
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Update the notification list by removing the deleted notification
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      await fetch(`/api/notifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user._id }), // Send userId in the request body
      });
  
      // Clear all notifications from the state
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };
  

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <VStack spacing={4} p={4}>
    {/* Delete All Notifications Icon Button with Tooltip */}

    {notifications.length === 0 ? (
      <Text>No notifications</Text>
    ) : (
      notifications?.map((notification) => (
        <Box
          key={notification._id}
          p={4}
          width="100%" // Increase width for better readability
          maxW="full" // Limit width to a max for layout consistency
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
              {/* Display sender's profile picture */}
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

            {/* Dropdown for notification actions (mark as read/delete) */}
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
