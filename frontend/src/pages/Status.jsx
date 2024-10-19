import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  Textarea,
  Stack,
  Text,
  Image,
  useToast,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';

const StatusPage = () => {
    const [text, setText] = useState('');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [visibility, setVisibility] = useState('public');
    const [statuses, setStatuses] = useState([]);
    const toast = useToast();
  
    // Fetch statuses
    useEffect(() => {
      const fetchStatuses = async () => {
        try {
          const response = await axios.get('/api/status'); // Adjust based on your backend
          setStatuses(response.data);
        } catch (error) {
          console.error('Error fetching statuses:', error);
        }
      };
  
      fetchStatuses();
    }, []);
  
    // Submit status
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('text', text);
      formData.append('caption', caption);
      formData.append('visibility', visibility);
  
      if (image) formData.append('image', image);
      if (video) formData.append('video', video);
  
      try {
        await axios.post('/api/status', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        toast({
          title: 'Status posted successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
  
        // Clear the form after posting
        setText('');
        setCaption('');
        setImage(null);
        setVideo(null);
  
        // Refetch statuses after posting
        const response = await axios.get('/api/status');
        setStatuses(response.data);
      } catch (error) {
        console.error('Error posting status:', error);
        toast({
          title: 'Error posting status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
  
    return (
      <Box p={6} maxW="800px" mx="auto">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="status-text">
              <FormLabel>Text</FormLabel>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
              />
            </FormControl>
  
            <FormControl id="status-visibility">
              <FormLabel>Visibility</FormLabel>
              <Select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="public">Public</option>
                <option value="followers">Only Followers</option>
              </Select>
            </FormControl>
  
            <FormControl id="status-image">
              <FormLabel>Upload Image</FormLabel>
              <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </FormControl>
  
            <FormControl id="status-video">
              <FormLabel>Upload Video</FormLabel>
              <Input type="file" onChange={(e) => setVideo(e.target.files[0])} />
            </FormControl>
  
            <FormControl id="status-caption">
              <FormLabel>Caption</FormLabel>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption"
              />
            </FormControl>
  
            <Button type="submit" colorScheme="blue">
              Post Status
            </Button>
          </Stack>
        </form>
  
        <Box mt={10}>
          <Text fontSize="xl" mb={4}>
            Recent Statuses
          </Text>
          {statuses.map((status) => (
            <Box key={status._id} border="1px solid gray" p={4} borderRadius="md" mb={4}>
              <Text fontWeight="bold">{status.text}</Text>
              {status.image && <Image src={status.image} alt={status.caption} mt={2} />}
              {status.video && <Text>(Video content)</Text>}
              <Text fontSize="sm" color="gray.500">
                {status.caption}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {status.visibility === 'public' ? 'Public' : 'Only Followers'}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };
  

export default StatusPage;
