import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useShowToast from '../hooks/useShowToast';
import useFollowUnfollow from '../hooks/useFollowUnfollow';
import MidSuggestion from './MidSuggestionButton';
import MidSuggestionButton from './MidSuggestionButton';
import { Link } from 'react-router-dom';



const MidSuggestions = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();
  const [showArrows, setShowArrows] = useState(false); // State to control arrow visibility
  const sliderRef = React.useRef();
  const { colorMode } = useColorMode();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          console.log(error)
          return;
        }
        setSuggestedUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [showToast]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <Box
      borderRadius="md"
      position="relative"
      overflow="hidden"
      maxW={{ base: '100%', md: '700px' }}
      mx="auto"
      onMouseEnter={() => setShowArrows(true)} 
      onMouseLeave={() => setShowArrows(false)} 
    >
      <Flex
        overflowX="auto"
        ref={sliderRef}
        gap={4}
        pl={2}
        pb={2}
        position="relative"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {suggestedUsers?.map((user) => (
          <Box
            key={user.id}
            flex="0 0 160px"
            p={4}
            minW="200px"
            borderRadius="md"
            boxShadow="lg"
            bg={colorMode === 'light' ? 'white' : 'gray.900'}
            color={colorMode === 'light' ? 'black' : 'white'}
            transition="transform 0.3s ease"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
          >
            <VStack spacing={2} align="center">
              <Link to={`/${user.username}`}  >
              <Image
                borderRadius="full"
                boxSize={{ base: '60px', md: '70px' }}
                src={user.profilePic}
                alt={user.name}
                fallbackSrc="https://via.placeholder.com/70"
              />
              </Link>
              <Text fontWeight="medium" textAlign="center" fontSize={{ base: 'sm', md: 'md' }}>
                {user.name}
              </Text>
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                textAlign="center"
                color={colorMode === 'light' ? 'gray.500' : 'gray.300'}
              >
                {user.bio ? user.bio : 'Mystaria User'}
              </Text>
              <MidSuggestionButton   user={user}  />
            </VStack>
          </Box>

          // <MidSuggestion user={user}  />
        ))}
      </Flex>

      {/* Conditionally render arrows only when hovering */}
      {showArrows && (
        <>
          <ChevronLeft
            className="absolute top-1/2 left-2 w-8 h-8 bg-black/60 text-white rounded-full cursor-pointer 
            hidden md:inline-flex"
            onClick={scrollLeft}
          />
          <ChevronRight
            className="absolute top-1/2 right-2 w-8 h-8 bg-black/60 text-white rounded-full cursor-pointer hidden md:inline-flex"
            onClick={scrollRight}
          />
        </>
      )}
    </Box>
  );
};

export default MidSuggestions;
