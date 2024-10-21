import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Image,
  useColorMode,
} from '@chakra-ui/react';
import moment from 'moment'; // Import moment for date formatting
import Loader from '../components/Loader';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode(); // To handle light/dark mode

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events'); // Replace with your API endpoint
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
          direction="column" // Stack elements vertically
        >
          <Flex justify="space-between" align="center">
            <Flex align="center">
              <Avatar
                src="data:image/jpeg;base64,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" // Placeholder for profile image
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
