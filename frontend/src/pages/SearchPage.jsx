import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Input,
  Text,
  Avatar,
  Flex,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import themeAtom from "../atoms/themeAtom";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useRecoilValue(themeAtom);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: searchQuery }),
      });
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error searching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputBorderColor = useColorModeValue("gray.400", "gray.600");

  return (
    <Container maxW={{ base: "90%", md: "xl" }} centerContent>
      <Box mt={8} textAlign="center" w="100%">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={4}>
          Search Users
        </Text>
        <Flex mb={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
          <Input
            type="text"
            placeholder="Enter name to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size={{ base: "lg", md: "lg" }}
            minH={'6vh'}
            flex="1"
            mb={{ base: 2, md: 0 }}
            mr={{ md: 2 }}
            borderColor={inputBorderColor}
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            bg={theme}
            color="white"
            size={{ base: "md", md: "lg" }}
          >
            Search
          </Button>
        </Flex>

        {loading && (
          <Center mt={8}>
            <Loader />
          </Center>
        )}

        {searchResult.length > 0 ? (
          <Box mt={8} w="100%">
            {searchResult.map((user) => (
              <Link key={user._id} to={`/${user.username}`}>
                <Box
                  bg={useColorModeValue("gray.100", "gray.900")}
                  p={4}
                  mb={4}
                  rounded="md"
                  boxShadow="md"
                  w="100%"
                  cursor="pointer"
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                    flexDirection={{ base: "column", md: "row" }}
                  >
                    <Flex alignItems="center">
                      <Box mr={4}>
                        {user.profilePic ? (
                          <Avatar src={user.profilePic} alt={user.name} size="lg" />
                        ) : (
                          <Avatar name={user.name} size="lg" />
                        )}
                      </Box>
                      <Box textAlign="left">
                        <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
                          {user.name}
                        </Text>
                        <Text fontSize="md" color="gray.600">
                          {user.username}
                        </Text>
                        {user.bio && (
                          <Text fontSize="sm" color="gray.500">
                            {user.bio}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                    <Box mt={{ base: 2, md: 0 }}>
                      <Badge bg={useColorModeValue('white', 'gray.dark')} mr={2} p={2} borderRadius="md">
                        Followers: {user.followers.length}
                      </Badge>
                      <Badge colorScheme="white" p={2} borderRadius="md">
                        Following: {user.following.length}
                      </Badge>
                    </Box>
                  </Flex>
                </Box>
              </Link>
            ))}
          </Box>
        ) : (
          !loading && (
            <Text fontSize="xl" fontWeight="bold" mt={8}>
              No users found.
            </Text>
          )
        )}
      </Box>
    </Container>
  );
};

export default SearchPage;
