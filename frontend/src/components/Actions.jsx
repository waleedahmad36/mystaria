import {
	Box,
	Button,
	Collapse,
	Flex,
	FormControl,
	Input,
	Text,
	useDisclosure,
	useColorModeValue,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Avatar,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import themeAtom from "../atoms/themeAtom";
import { motion } from "framer-motion";

const Actions = ({ post }) => {
	const user = useRecoilValue(userAtom);
	const [liked, setLiked] = useState(post.likes.some(like => like._id === user?._id));
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [isLiking, setIsLiking] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [reply, setReply] = useState("");
	const { isOpen, onToggle } = useDisclosure(); // This manages expand/collapse
	const theme = useRecoilValue(themeAtom);
	const [likesModalVisible, setLikesModalVisible] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); 

	const showToast = useShowToast();

	// Handle like/unlike functionality
	const handleLikeAndUnlike = async () => {
		if (!user) return showToast("Error", "You must be logged in to like a post", "error");
		if (isLiking) return;
		setIsLiking(true);
		try {
			const res = await fetch("/api/posts/like/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) return console.log(error)

			// Update post's likes in the state
			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return {
						...p,
						likes: liked
							? p.likes.filter((id) => id !== user._id)
							: [...p.likes, user._id],
					};
				}
				return p;
			});
			setPosts(updatedPosts);
			setLiked(!liked);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLiking(false);
		}
	};


	
	const handleMouseEnter = (e) => {
        const rect = e.target.getBoundingClientRect();
        setModalPosition({
            top: rect.top + window.scrollY - 100, 
            left: rect.left + window.scrollX,
        });
        setLikesModalVisible(true);
    };

	const handleMouseLeave = () => {
		setLikesModalVisible(false);
	};

	const handleReply = async () => {
		if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
		if (isReplying) return;
		setIsReplying(true);
		try {
			const res = await fetch("/api/posts/reply/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: reply }),
			});
			const data = await res.json();
			if (data.error) return console.log(error)

			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return { ...p, replies: [...p.replies, data] };
				}
				return p;
			});
			setPosts(updatedPosts);
			showToast("Success", "Reply posted successfully", "success");
			setReply("");
		} catch (error) {
			console.log(error);
		} finally {
			setIsReplying(false);
		}
	};

	return (
		<Flex flexDirection='column' w='100%'> 
			<Flex gap={3} my={2} w="100%" onClick={(e) =>{
				e.preventDefault();
				e.stopPropagation();

			}

			}> 
				<svg
					aria-label='Like'
					color={liked ? theme : theme}
					fill={liked ? theme : "transparent"}
					height='19'
					role='img'
					viewBox='0 0 24 22'
					width='20'
					onClick={handleLikeAndUnlike}
					className=" cursor-pointer"
				>
					<path
						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
						stroke='currentColor'
						strokeWidth='2'
					></path>
				</svg>

				<svg
					aria-label='Comment'
					color={theme}
					fill='transparent'
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={onToggle} // Toggle the comment section
					className=" cursor-pointer"
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>
			</Flex>

			<Flex gap={2} alignItems={"center"} w="100%"> 
				<Text color={"gray.light"} fontSize='sm'>
					{post.replies.length} replies
				</Text>


				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>

				<Button     onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}   >
				<Text color={"gray.light"} fontSize='sm'>
					{post.likes.length} likes
				</Text>
				</Button>


			</Flex>

			{likesModalVisible && (
				<motion.div
				style={{
					position: 'absolute',
					top: modalPosition.top,
					left: modalPosition.left,
					zIndex: 99999,
					background: useColorModeValue('white','black'),
					borderRadius: '8px',
					boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
				}}
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5 }}
				>
					<Flex direction="column" p={4}>
						{post.likes?.map((likedUser) => {
							return (
								<Flex key={likedUser._id} align="center" mb={2}>
									<img src={likedUser.profilePic  || user.profilePic} alt={user.username} style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px' }} />
									<Text>{likedUser.username   || user.username}</Text>
								</Flex>
							);
						})}
					</Flex>
				</motion.div>
			)}


			

			<Collapse in={isOpen} animateOpacity w="100%"   
			onClick={(e)=>e.stopPropagation()}
			>
				<Box mt={4} bg={useColorModeValue("gray.200", "gray.900")} p={4} borderRadius='md' w={'100%'}  
				onClick={(e)=>e.stopPropagation()}
				>
				
					<FormControl>
						<Input
							placeholder='Write a comment...'
							value={reply}
							onChange={(e) => setReply(e.target.value)}
							onClick={(e) => e.stopPropagation()}
						/>
					</FormControl>
					<Flex justifyContent='flex-end'>
						<Button
							mt={2}
							size='sm'
							isLoading={isReplying}
							onClick={handleReply}
							bg={useColorModeValue("gray.100", theme)} 
							color={useColorModeValue(theme, 'white')}
						>
							Reply
						</Button>
					</Flex>

				</Box>
			</Collapse>
		</Flex>
	);
};

export default Actions;
