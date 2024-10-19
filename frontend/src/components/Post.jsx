import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { BsThreeDots } from "react-icons/bs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import themeAtom from "../atoms/themeAtom";

const Post = ({ post, postedBy, activeTab }) => {  
  console.log('post is',post)
  const theme = useRecoilValue(themeAtom); 
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  console.log('active tab value is',activeTab)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reportLoading, setReportLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [postOwner,setPostOwner]=useState();


  

  const handleOpen = (e) => {
    e.preventDefault();
    onOpen();
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        if(activeTab==='foryou'){
          var res = await fetch("/api/users/profile/" + postedBy._id)
        }else{
          var res = await fetch("/api/users/profile/" + postedBy)
        }
        
        const data = await res.json();
        if (data.error) {
          console.log('error is',data.error)
          return;
        }
        setUser(data);
      } catch (error) {
        // console.log(error);
        console.log(error)
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        console.log(error)
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReportSubmit = async () => {
    setReportLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: currentUser._id,
          post: post._id,
          description,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(error)
      } else {
        showToast("Success", "Report submitted", "success");
        onClose();
        setDescription("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setReportLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size='md'
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[0].userId.profilePic || post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left='15px'
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[1].userId.profilePic || post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right='-5px'
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[2].userId.profilePic || post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left='4px'
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              <BsThreeDots onClick={(e) => handleOpen(e)} color={theme}  cursor={'pointer'}  />

              {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
            </Flex>
          </Flex>

          <Text
            fontSize={"sm"}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}/post/${post._id}`);
            }}
            cursor={'pointer'}
          >
            {post.text}
          </Text>

          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}/post/${post._id}`);
              }}
            >
              <Image src={post.img} w={"full"} maxH={"60vh"} objectFit={'cover'}  cursor={'pointer'}   />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent  bg={useColorModeValue('gray.200','gray.dark')}   >
          <ModalHeader>Report Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue with this post"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="gray"
              ml={3}
              onClick={handleReportSubmit}
              isLoading={reportLoading}
            >
              Send Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Post;
