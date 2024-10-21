import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Input,
  Textarea,
  Stack,
  Text,
  Image,
  useToast,
  FormControl,
  FormLabel,
  Select,
  IconButton,
  Flex,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPlusCircle } from 'react-icons/fa';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';
import themeAtom from '../atoms/themeAtom';
import useShowToast from '../hooks/useShowToast';

const StatusBar = () => {
  const theme = useRecoilValue(themeAtom);
  const [loading,setLoading]=useState(false);
  const [statuses, setStatuses] = useState([]);
  const sliderRef = useRef(null);
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isViewerModalOpen, onOpen: onViewerModalOpen, onClose: onViewerModalClose } = useDisclosure();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [viewers, setViewers] = useState([]); // Viewers data
  const [text, setText] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const toast = useToast();
  const user = useRecoilValue(userAtom);
  const showToast=useShowToast();

  // Fetch statuses from the server
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get('/api/status');
        setStatuses(response.data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };
    fetchStatuses();
  }, []);

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

  // Track status view
  const trackStatusView = async (statusId) => {
    try {
      await axios.post(`/api/status/view/${statusId}`);
      toast({
        title: 'Status viewed!',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error tracking status view:', error);
    }
  };

  const viewStatus = (status) => {
    setSelectedStatus(status);
    trackStatusView(status._id); // Track the view
    onViewOpen(); // Open modal to show status
  };

  // Fetch viewers for a status
  const viewStatusViewers = (status) => {
    setViewers(status.viewers); // Assuming `viewers` field contains an array of users
    onViewerModalOpen(); // Open modal to show viewers
  };

  // Submit new status
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!text && !caption && !image && !video){
      showToast("all fields r empty","error","error");
      return;
    }
    setLoading(true)
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

      showToast("Status Posted","success","success");

      setText('');
      setCaption('');
      setImage(null);
      setVideo(null);

      onCreateClose();

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
    } finally{
      setLoading(false)
    }
  };


  return (
    <div className="relative w-full pl-4 flex items-center group">
      <div className="relative w-full">
        <div
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          ref={sliderRef}
          style={{
            scrollBehavior: 'smooth',
            overflowX: 'auto', 
            WebkitOverflowScrolling: 'touch', 
          }}
          
        >
          {/* Plus icon to add a new status */}
          <div className="flex-shrink-0">
            <button className="relative" onClick={onCreateOpen}>
              <FaPlusCircle size={40}   color={theme}   />
            </button>
          </div>

          {/* Render each status */}
          {statuses?.map((status) => (
            <div key={status._id} className="flex-shrink-0 relative cursor-pointer">
              <div
                className={`w-12 h-12 rounded-full overflow-hidden p-1  border-2 hover:scale-105 transition-transform duration-200`}

                style={{borderColor: status.viewed ? '#6b7280' : theme}}
                onClick={() => viewStatus(status)}
              >
                <Avatar
                  src={status.image || status.userId?.profilePic}
                  alt={status.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className={`${useColorModeValue('text-gray-900','text-gray-300')}text-gray-300 text-xs block text-center mt-1`}>
                {status?.userId?.username?.length > 8
                  ? `${status.userId.username.slice(0, 6)}...`
                  : status.userId.username}
              </span>

              {/* Eye icon and viewer count */}
              <div className="flex items-center justify-center mt-1">
                {user._id === status.userId._id && (
                  <>
                  <IconButton
                  icon={<Eye />}
                  size="xs"
                  variant="ghost"
                  onClick={() => viewStatusViewers(status)}
                  aria-label="Viewers"
                />
                <Text fontSize="xs">{status.viewers?.length}</Text>
                </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll buttons */}
        <ChevronLeft
          className="absolute top-1/2 left-2 w-8 h-8 bg-black/60 text-white rounded-full cursor-pointer hidden md:group-hover:block "
          onClick={scrollLeft}
        />
        <ChevronRight
          className="absolute top-1/2 right-2 w-8 h-8 bg-black/60 text-white rounded-full cursor-pointer hidden md:group-hover:block"
          onClick={scrollRight}
        />

        {/* Modal for viewing status */}
        {selectedStatus && (
          <Modal isOpen={isViewOpen} onClose={onViewClose}    >
            <ModalOverlay />
            <ModalContent  bg={useColorModeValue('gray.100','gray.dark')}  >
              <ModalHeader>
                <Flex  gap={4}>
                <img src={selectedStatus?.userId?.profilePic} alt="" className="w-12 h-12 rounded-full" />
                {selectedStatus?.userId?.username}
                </Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedStatus?.text && <Text>{selectedStatus.text}</Text>}
                {selectedStatus?.image && <img src={selectedStatus.image} alt={selectedStatus?.username} />}
                {selectedStatus?.video && <video src={selectedStatus.video} controls autoPlay></video>}
                {selectedStatus?.caption && (
                  <Text mt={2}  bg={useColorModeValue('gray.200','gray.900')}  py={2} textAlign={'center'} rounded={'lg'}  >{selectedStatus?.caption}</Text>
                )}
              </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Modal to add new status */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
      <ModalOverlay />
      <ModalContent   bg={useColorModeValue('gray.100','gray.dark')}  >
        <ModalHeader>Upload Story🥰</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="status-text">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                />
              </FormControl>

              <FormControl id="status-visibility">
                <Select value={visibility} onChange={(e) => setVisibility(e.target.value)}    cursor={'pointer'}  >
                  <option value="public">Public</option>
                  <option value="followers">Only Followers</option>
                </Select>
              </FormControl>

              <FormControl id="status-image">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  display="none"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button as="span" leftIcon={<AiOutlineFileImage />}   cursor={'pointer'}  >
                    {image ? 'Change Image' : 'Upload Image'}
                  </Button>
                </label>
                {image && (
                  <Box mt={2}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Image Preview"
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl id="status-video">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                  display="none"
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button as="span" leftIcon={<AiOutlineVideoCamera />}     cursor={'pointer'} >
                    {video ? 'Change Video' : 'Upload Video'}
                  </Button>
                </label>
                {video && (
                  <Box mt={2}>
                    <video
                      controls
                      src={URL.createObjectURL(video)}
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl id="status-caption">
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption"
                />
              </FormControl>
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button bg={theme} color={'white'} onClick={handleSubmit}   isLoading={loading} >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

        {/* Modal to view status viewers */}
        <Modal isOpen={isViewerModalOpen} onClose={onViewerModalClose}>
          <ModalOverlay />
          <ModalContent   bg={useColorModeValue('gray.100','gray.dark')} >
            <ModalHeader>Viewers</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                {viewers.map((viewer) => (
                  <Box key={viewer._id} className="flex items-center">
                    <Avatar src={viewer.profilePic} alt={viewer.username} />
                    <Text ml={2}>{viewer.username}</Text>
                  </Box>
                ))}
              </Stack>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default StatusBar;
