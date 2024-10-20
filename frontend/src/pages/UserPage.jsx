import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Loader from "../components/Loader";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				console.log(data);
				setPosts(data);
			} catch (error) {
				// console.log(error);
				console.log(error);
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Loader />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

	return (
		<div  className="px-5"  >
			<UserHeader user={user} />

			{!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Loader/>
				</Flex>
			)}

			{posts.map((post) => (
				 <Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</div>
	);
};

export default UserPage;
