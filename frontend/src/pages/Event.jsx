import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Image,
  useColorMode,
} from '@chakra-ui/react';
import moment from 'moment'; 
import Loader from '../components/Loader';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode(); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events'); 
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Loader />
      </Flex>
    );
  }

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Events
      </Text>
      {events.map((event) => (
        <Flex
          key={event._id}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderWidth={1}
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
          borderRadius="md"
          p={4}
          mb={4}
          direction="column" 
        >
          <Flex justify="space-between" align="center">
            <Flex align="center">
              <Avatar
                src="m.png" // Placeholder for profile image
                name="Mystaria" // Placeholder for username
                mr={3}
              />
              <Text fontWeight="bold">Mystaria</Text>
            </Flex>
            <Text color="gray.500" fontSize="sm">
              {moment(event.createdAt).fromNow()} {/* Format the date */}
            </Text>
          </Flex>
          <Box mt={2}>
            <Text fontWeight="bold" fontSize="lg">{event.text}</Text>
            {event.image && (
              <Image src={event.image} alt={event.text} borderRadius="md" mt={2} />
            )}
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default Event;
