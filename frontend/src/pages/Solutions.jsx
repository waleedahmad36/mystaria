import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  Box,
  Flex,
  Image,
  Collapse,
  Stack,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  Avatar,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import themeAtom from "../atoms/themeAtom";

const Solutions = () => {
  const theme = useRecoilValue(themeAtom)
  const [solutions, setSolutions] = useState([]);
  const { isOpen, onToggle } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [solutionImage, setSolutionImage] = useState("");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSolution, setSelectedSolution] = useState(null);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const access_key = "TjTIpJVAwbUSUQ73_Qlem4wTha_Wjl39Rz6iGghNTtc";
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await fetch("/api/solutions");
        if (!response.ok) {
          throw new Error("Failed to fetch solutions");
        }
        const data = await response.json();
        setSolutions(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const handleCreateSolution = async () => {
    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    const newSolution = {
      title,
      description,
      tags,
      imageUrl: solutionImage,
    };

    try {
      const response = await fetch("/api/solutions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSolution),
      });

      if (!response.ok) {
        throw new Error("Failed to create solution");
      }

      const savedSolution = await response.json();
      setSolutions([...solutions, savedSolution]);
      showToast("Success", "Solution created successfully ✅", "success");
    } catch (error) {
      console.error("Failed to create solution:", error);
    }
  };

  const handleDeleteSolution = async (solutionId) => {
    try {
      const response = await fetch(`/api/solutions/${solutionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete solution");
      }

      setSolutions(solutions.filter((solution) => solution._id !== solutionId));
      showToast("Success", "Solution deleted ✅", "success");
    } catch (error) {
      console.error("Failed to delete solution:", error);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      const response = await fetch("/api/solutions");
      const data = await response.json();
      setSolutions(data);
    } else {
      try {
        const response = await fetch("/api/solutions/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Failed to search solutions");
        }

        const data = await response.json();
        setSolutions(data);
      } catch (error) {
        console.error("Failed to search solutions:", error);
      }
    }
  };

  const handleGetImage = async () => {
    if (!imageTitle) return;
    setLoadingImage(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${imageTitle}&client_id=${access_key}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images from Unsplash");
      }
      const data = await response.json();
      if (data.results.length > 0) {
        setSolutionImage(data.results[0].urls.regular);
      } else {
        console.error("No images found for the provided title");
      }
    } catch (error) {
      console.error("Failed to fetch images from Unsplash:", error);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleTagInput = (e) => {
    const currentTag = e.target.value;
    if (e.key === "Enter" && currentTag.trim() !== "") {
      setTags([...tags, currentTag.trim()]);
      e.target.value = "";
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const openSolutionModal = (solution) => {
    setSelectedSolution(solution);
  };

  return (
    <Box className="relative min-h-[80vh] rounded-md container mx-auto px-4 sm:px-6 lg:px-8">
      <Flex direction="column" className="relative z-10 space-y-6">
        {/* Solution Creation Form */}
        <Box bg="gray.900" p={4} rounded="md">
          <Flex justify="space-between" align="center" gap={4}>
            <Avatar src={user.profilePic} size="md" />
            <Box
              h={10}
              flex={1}
              bg="gray.900"
              justifyContent="center"
              display="flex"
              alignItems="center"
              rounded="lg"
              cursor="pointer"
              onClick={onToggle}
            >
              <Text color="white">What's on your mind? {user.username}</Text>
            </Box>
          </Flex>

          <Collapse in={isOpen}>
            <Stack spacing={4} mt={2}>
              <Flex gap={3}>
                <Input
                  placeholder="Solution Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  border={'none'}
                />
                <Input
                  placeholder="Image Title"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  border={'none'}
                />
                <Button onClick={handleGetImage} bg={theme}  color={'white'}   p={2} >
                  <Text>Get</Text>
                </Button>
              </Flex>

              <Box mx={'auto'}>
                {solutionImage && !loadingImage && (
                  <Image src={solutionImage} alt="Solution" borderRadius="md" mb={2}  w={'200px'}  />
                )}
                {loadingImage && <Spinner />}
              </Box>

              <Textarea
                placeholder="Solution Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                bg="gray.800"
                color="white"
                borderRadius="md"
                border={'none'}
              />

              {/* Tags */}
              <Flex gap={2}>
                <Input
                  placeholder="Add a tag and press Enter"
                  onKeyDown={handleTagInput}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  border={'none'}
                />
                <Flex wrap="wrap" gap={2}>
                  {tags.map((tag, index) => (
                    <Tag size="sm" key={index} variant="solid" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveTag(index)} />
                    </Tag>
                  ))}
                </Flex>
              </Flex>

              <Button onClick={handleCreateSolution} bg={theme} color={'white'} mt={4}>
                Create Solution
              </Button>
            </Stack>
          </Collapse>
        </Box>

        {/* Search Bar */}
        <Flex justify="center">
          <Input
            type="text"
            placeholder="Search your problem here"
            value={searchQuery}
            onChange={handleSearchChange}
            bg="gray.800"
            color="white"
            borderRadius="md"
            w={{ base: "full", sm: "50%" }}
          />
        </Flex>

        {/* Solutions Grid */}
        <Flex wrap="wrap" justify="center" gap={4}>
          {loading ? (
            <Spinner />
          ) : (
            solutions.map((solution) => (
              <Box
                key={solution._id}
                bg="gray.900"
                p={6}
                rounded="lg"
                shadow="md"
                width={{ base: "full", sm: "48%", md: "30%" }}
                onClick={() => openSolutionModal(solution)} // Open modal on click
                cursor="pointer"
              >
                <Flex align="center" mb={4}>
                  <Avatar src={solution.author.profilePic} size="md" />
                  <Box ml={3}>
                    <Text color="white" fontWeight="bold">{solution.author.username}</Text>
                    <Text color="gray.400" fontSize="sm">
                      {new Date(solution.createdAt).toLocaleDateString()} at {new Date(solution.createdAt).toLocaleTimeString()}
                    </Text>
                  </Box>
                </Flex>

                <Image src={solution.imageUrl} alt={solution.title} borderRadius="md" mb={4} />
                <Text color="white" fontWeight="bold" fontSize="lg">{solution.title}</Text>
                <Text color="gray.300" mt={2} noOfLines={3}>{solution.description}</Text> {/* Limit to 3 lines */}

                <Flex justify="space-between" mt={4}>
                  {user._id === solution.author._id && (
                    <Button bg={theme} onClick={() => handleDeleteSolution(solution._id)}>
                    Delete
                  </Button>
                  )}
                </Flex>
              </Box>
            ))
          )}
        </Flex>
      </Flex>

      {/* Modal for Full Solution */}
      {selectedSolution && (
        <Modal isOpen={!!selectedSolution} onClose={() => setSelectedSolution(null)}>
          <ModalOverlay />
          <ModalContent bg={useColorModeValue('gray.100','gray.dark')} pb={5}  color={useColorModeValue('gray.900','gray.100')}  >
            <ModalHeader>{selectedSolution.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Flex align="center" mb={4}>
                  <Avatar src={selectedSolution.author.profilePic} size="md" />
                  <Box ml={3}>
                    <Text  fontWeight="bold">{selectedSolution.author.username}</Text>
                    <Text color="gray.400" fontSize="sm">
                      {new Date(selectedSolution.createdAt).toLocaleDateString()} at {new Date(selectedSolution.createdAt).toLocaleTimeString()}
                    </Text>
                  </Box>
                </Flex>
              <Text >{selectedSolution.description}</Text>
              {/* Display other details as needed */}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Solutions;
