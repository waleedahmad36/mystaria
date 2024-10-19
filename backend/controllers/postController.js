import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getRecipientSocketId, io } from "../socket/socket.js";
import Notification from "../models/notificationModel.js";

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

// const getPost = async (req, res) => {
// 	try {
// 		const post = await Post.findById(req.params.id);

// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		res.status(200).json(post);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

const getPost = async (req, res) => {
	try {
	  const post = await Post.findById(req.params.id)
		.populate('postedBy', 'username profilePic')  // Populate post author details
		.populate({
		  path: 'replies.userId', 
		  select: 'username profilePic', // Populate reply author details
		})
		.populate({
			path: 'likes',
			select: 'username profilePic', // Populate like author details
		});
  
	  if (!post) {
		return res.status(404).json({ error: "Post not found" });
	  }
  
	  res.status(200).json(post);
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
  };
  

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// const likeUnlikePost = async (req, res) => {
// 	try {
// 		const { id: postId } = req.params;
// 		const userId = req.user._id;

// 		const post = await Post.findById(postId);

// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		const userLikedPost = post.likes.includes(userId);

// 		if (userLikedPost) {
// 			// Unlike post
// 			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
// 			res.status(200).json({ message: "Post unliked successfully" });
// 		} else {
// 			// Like post
// 			post.likes.push(userId);
// 			await post.save();
// 			res.status(200).json({ message: "Post liked successfully" });
// 		}
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

// const replyToPost = async (req, res) => {
// 	try {
// 		const { text } = req.body;
// 		const postId = req.params.id;
// 		const userId = req.user._id;
// 		const userProfilePic = req.user.profilePic;
// 		const username = req.user.username;

// 		if (!text) {
// 			return res.status(400).json({ error: "Text field is required" });
// 		}

// 		const post = await Post.findById(postId);
// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		const reply = { userId, text, userProfilePic, username };

// 		post.replies.push(reply);
// 		await post.save();

// 		res.status(200).json(reply);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };




const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();

			// Notify post owner
			const recipientSocketId = getRecipientSocketId(post.postedBy);
			if (recipientSocketId) {
				io.to(recipientSocketId).emit("notification", {
					message: `${req.user.username} liked your post!`,
					type: "like",
					senderId: req.user._id,
					postId,
				});
			}

			// Save notification to database
			const notification = new Notification({
				sender: req.user._id,
				receiver: post.postedBy,
				type: "like",
				message: `${req.user.username} liked your post!`,
				post: postId, // Link the notification to the post
			});
			await notification.save(); // Save the notification

			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in likeUnlikePost: ", err.message);
	}
};




const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const username = req.user.username;
		const userProfilePic = req.user.profilePic; // Include user profile pic

		// Ensure the text field is not empty
		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		// Find the post by ID
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Construct the reply object with all needed fields
		const reply = { userId, username, userProfilePic, text };
		post.replies.push(reply);
		await post.save();

		// Notify the post owner
		const recipientSocketId = getRecipientSocketId(post.postedBy);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit("notification", {
				message: `${username} replied to your post!`,
				type: "reply",
				senderId: userId,
				postId,
			});
		}

		// Save the notification to the database
		const notification = new Notification({
			sender: userId,
			receiver: post.postedBy,
			type: "reply",
			message: `${username} replied to your post!`,
			post: postId,
		});
		await notification.save();

		// Send the reply as the response
		res.status(200).json(reply);
	} catch (err) {
		// Handle errors and send the error message
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 })
		.populate({
			path: 'replies.userId', 
			select: 'username profilePic', // Populate reply author details
		  })
		  .populate({
			path: 'likes',
			select: 'username profilePic', // Populate like author details
		});

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 })
		.populate({
			path: 'replies.userId', 
			select: 'username profilePic', // Populate reply author details
		  })
		  .populate({
			path: 'likes',
			select: 'username profilePic', // Populate like author details
		});

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};





const getTrendingPosts = async (req, res) => {
    try {
        // Find all posts, sort by the number of likes in descending order, and limit the results to the top 10
        const trendingPosts = await Post.find()
            .sort({ likes: -1 })
            .limit(6)
            .populate('postedBy', 'username profilePic'); // Populate username and profilePic from the postedBy field

        res.status(200).json(trendingPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getTrendingPosts:", err.message);
    }
};






const getAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 })
		.populate('postedBy', 'username profilePic')
		.populate({
			path: 'replies.userId', 
			select: 'username profilePic', // Populate reply author details
		  })
		  .populate({
			path: 'likes',
			select: 'username profilePic', // Populate like author details
		});
        res.status(200).json(allPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const toggleApproval = async (req, res) => {
	try {
	  const postId = req.params.id;
	  const post = await Post.findById(postId);
  
	  if (!post) {
		return res.status(404).json({ error: "Post not found" });
	  }
  
	  // Toggle the isApproved field
	  post.isApproved = !post.isApproved;
	  await post.save();
  
	  res.status(200).json({ message: `Post approval toggled successfully: ${post.isApproved}` });
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
  };


export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts ,getTrendingPosts,getAllPosts,toggleApproval};
