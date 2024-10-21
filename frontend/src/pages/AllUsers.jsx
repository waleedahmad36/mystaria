import { Avatar, Box, Text, Flex,  VStack, Button, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion'; 
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import themeAtom from '../atoms/themeAtom';
import Loader from '../components/Loader';

const MotionText = motion(Text);

const AllUsers = () => {
    const theme = useRecoilValue(themeAtom);
    const { colorMode } = useColorMode();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { socket, onlineUsers } = useSocket();
    console.log(onlineUsers)
     

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users/allusers'); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    

    return (
        <Box 
        padding={8} 
        minHeight="100vh" 
        borderRadius={'md'}
    >
                        <MotionText 
            as="h1" 
            fontSize="4xl" 
            fontWeight="bold" 
            color={colorMode === 'light' ? "gray.800" : "white"} 
            marginBottom={8}
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 1.5 }} 
        >
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }} 
                >
                    C
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1, duration: 0.5 }} 
                >
                    o
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2, duration: 0.5 }} 
                >
                    m
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.3, duration: 0.5 }} 
                >
                    m
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }} 
                >
                    u
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.5, duration: 0.5 }} 
                >
                    n
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }}
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.6, duration: 0.5 }} 
                >
                    i
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.7, duration: 0.5 }} 
                >
                    t
                </motion.span>
                <motion.span
                    whileHover={{ color: colorMode === 'light' ? "teal.500" : "teal.200" }}
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.8, duration: 0.5 }} 
                >
                    y
                </motion.span>
            </MotionText>
            <Flex wrap="wrap" justify="center">
                {loading ? (
                    <Flex justify="center" align="center" height="100vh">
                        <Loader />
                    </Flex>
                ) : error ? (
                    <Flex justify="center" align="center" height="100vh">
                        <Text fontSize="xl" color="red.500">{error}</Text>
                    </Flex>
                ) : (
                    users.map(user => (
                        <Link   to={`/${user?.username}`}  >
                        <Box
                            key={user._id}
                            className="user-card"
                            padding={6}
                            borderRadius="lg"
                            boxShadow="lg"
                            width="250px"
                            margin={4}
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }}
                        >
                            <VStack spacing={4}>
                                {user.profilePic ? (
                                    <Avatar src={user.profilePic} size="xl"  position={'relative'}  >
                                        {onlineUsers.includes(user._id) && <div className='online-dot' ></div>}
                                    </Avatar>
                                ) : (
                                    <Avatar size="xl"    name={user.name}  position={'relative'} >
                                        {onlineUsers.includes(user._id) && <div className='online-dot' ></div>}
                                    </Avatar>
                                )   
                                }
                                <Text fontSize="lg" fontWeight="bold" color={colorMode === 'light' ? "gray.700" : "white"}>{user.name}</Text>
                                <Text fontSize="md" color={colorMode === 'light' ? "gray.600" : "gray.300"}>@{user.username}</Text>
                                <Text fontSize="sm" textAlign="center" color={colorMode === 'light' ? "gray.600" : "gray.300"}>{user.bio}</Text>
                                <Button border={`1px solid ${theme}`} variant="outline"  color={theme}  >{user.followers.length} {"->"} </Button>
                            </VStack>
                        </Box>
                        </Link>
                    ))
                )}
            </Flex>
        </Box>
    );
};

export default AllUsers;
