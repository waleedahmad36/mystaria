import { Avatar, Box,  Divider, Flex, Image,  Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";
import Loader from "../components/Loader";

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();

	const currentPost = posts[0];

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					console.log(error)
					return;
				}
				console.log('data is',data)
				setPosts([data]);
			} catch (error) {
				console.log(error)
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				console.log(error)
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			console.log(error);
		}
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Loader />
			</Flex>
		);
	}

	if (!currentPost) return null;
	console.log("currentPost", currentPost);

	return (
		<>

		<div >

		<div  className="px-10  max-w-lg mt-5     mb-10 md:mb-2 mx-auto" >
			<Flex     >
				<Flex w={"full"} alignItems={"center"} gap={3} >
					<Avatar src={user.profilePic} size={"md"} name={user.username} />
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Image src='/verified.png' w='4' h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>

					{currentUser?._id === user._id && (
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
				</Flex>
			</Flex>

			<Text my={3}>{currentPost.text}</Text>

			{currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}
				    >
					<Image src={currentPost.img} w="full"    />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>What you think about this post🥰.</Text>
				</Flex>
			</Flex>

			<Divider my={4} />

			<div className="scrollbar-hidden " style={{ maxHeight: "150px", overflowY: "auto" }}>
    {currentPost.replies.map((reply) => (
      <Comment
        key={reply._id}
        reply={reply}
        lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
      />
    ))}
  </div>

</div>

</div>
		</>
	);
};

export default PostPage;
