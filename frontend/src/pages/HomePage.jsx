// import { Box, Flex,  useColorMode, useColorModeValue } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import Post from "../components/Post";
// import { useRecoilState, useRecoilValue } from "recoil";
// import postsAtom from "../atoms/postsAtom";
// import SuggestedUsers from "../components/SuggestedUsers";
// import Sidebar from "../components/Sidebar";
// import MidSuggestions from "../components/MidSuggestions";
// import StatusBar from "../components/StatusBar";
// import themeAtom from "../atoms/themeAtom";
// import Loader from "../components/Loader";

// const HomePage = () => {
//   const theme = useRecoilValue(themeAtom);
//   const { colorMode } = useColorMode(); // Get the current color mode
//   const [posts, setPosts] = useRecoilState(postsAtom);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("foryou"); // State to track the active tab
//   const showToast = useShowToast();



//   // Fetch all posts (For You)
//   const getFeedPosts = async () => {
//     setLoading(true);
//     setPosts([]);
//     try {
//       const res = await fetch("/api/posts/feed");
//       const data = await res.json();
//       if (data.error) {
//         console.log("error in feed post", data.error);
//         return;
//       }
//       setPosts(data);
//     } catch (error) {
//       console.log('error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch posts from followed users (Following)
//   const getAllPosts = async () => {
//     setLoading(true);
//     setPosts([]);
//     try {
//       const res = await fetch("/api/posts"); // Call the route for following posts
//       const data = await res.json();
//       if (data.error) {
//         console.log("error in following posts", data.error);
//         return;
//       }
//       setPosts(data);
//     } catch (error) {
//       console.log('error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch posts based on the active tab (For You by default)
//   useEffect(() => {
//     if (activeTab === "foryou") {
//       getAllPosts();
//     } else if (activeTab === "following") {
//       getFeedPosts();
//     }
//   }, [activeTab, showToast, setPosts]);

//   // Determine the background and text color based on color mode
//   const bgColor = colorMode === "dark" ? "gray.900" : "gray.100";
//   const activeTabBgColor = theme;
//   const textColor = colorMode === "dark" ? "white" : "black";



//   return (
//     <Flex     >
//       {/* Sidebar Section */}
//       <Box
//         display={{ base: "none", lg: "block" }}
//         flex={20}
//         position="sticky"
//         top="15vh" // Adjusted sticky position
//       >
//         <Sidebar />
//       </Box>

//       {/* Main Content Section (Posts and Suggested Users) */}
//       <Flex  alignItems={"flex-start"} justifyContent={'space-evenly'} flex={{md:80}}   >
//         <Box flex={50}    maxW={{md:'45vw'}}  >
          

//           <div   className=" max-w-[full]  md:max-w-[45vw] mx-auto  " >
//           <StatusBar/>
//           </div>

//           <Box
//             w="95%"
//             mx="auto"
//             h="10"
//             bg={bgColor}
//             display="flex"
//             shadow="lg"
//             alignItems="center"
//             my={{
//               base:'3',
//               md:'5'
//             }}
//             mt={10}
//             zIndex="50"
//             rounded="lg"
//             overflow="hidden"
//           >
//             <Box
//               w="50%"
//               cursor="pointer"
//               h="10"
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               bg={activeTab === "foryou" ? activeTabBgColor : bgColor}
//               color={activeTab === "foryou" ? 'white' : useColorModeValue('gray.dark','white')}
//               onClick={() => setActiveTab("foryou")}
//             >
//               For You
//             </Box>
//             <Box
//               w="50%"
//               cursor="pointer"
//               h="10"
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               bg={activeTab === "following" ? activeTabBgColor : bgColor}
//               color={activeTab === "following" ? 'white' : textColor}
//               onClick={() => setActiveTab("following")}
//             >
//               Following
//             </Box>
//           </Box>

//           {/* Iterate through posts and insert MidSuggestions after every 7 posts */}
//           {!loading && posts.length === 0 && <h1  className="text-center"  >Follow some users to see the feed</h1>}

//           {loading && (
//             <Flex justify="center">
//               <Loader/>
//             </Flex>
//           )}
//           <Box    >
//           {posts?.map((post, i) => (
//     <Box key={post._id}>
//       {/* Render the post */}
//       <Post post={post} postedBy={post.postedBy} activeTab={activeTab} />

//       {/* Insert <MidSuggestions /> after every 7 posts */}
//       {((i + 1) % 7 === 0) && (
//         <div className="max-w-[90vw] md:max-w-[45vw]  md:mx-auto ">
//           <MidSuggestions />
//         </div>
//       )}
//     </Box>
  
// ))}

// </Box>

//         </Box>

//         <Box
//           flex={20}
//           display={{
//             base: "none",
//             lg: "block",
//           }}
//           position="sticky"
//           top="15vh" // Adjusted sticky position
//           maxW={'22vw'} 
//         >
//           <SuggestedUsers />
//         </Box>
//       </Flex>
//     </Flex>
//   );
// };

// export default HomePage;



import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import Sidebar from "../components/Sidebar";
import MidSuggestions from "../components/MidSuggestions";
import StatusBar from "../components/StatusBar";
import themeAtom from "../atoms/themeAtom";
import Loader from "../components/Loader";

const HomePage = () => {
  const theme = useRecoilValue(themeAtom);
  const { colorMode } = useColorMode();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("foryou");
  const showToast = useShowToast();

  const getFeedPosts = async () => {
    setLoading(true);
    setPosts([]);
    try {
      const res = await fetch("/api/posts/feed");
      const data = await res.json();
      if (data.error) {
        console.log("error in feed post", data.error);
        return;
      }
      setPosts(data);
    } catch (error) {
      console.log("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllPosts = async () => {
    setLoading(true);
    setPosts([]);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.error) {
        console.log("error in following posts", data.error);
        return;
      }
      setPosts(data);
    } catch (error) {
      console.log("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "foryou") {
      getAllPosts();
    } else if (activeTab === "following") {
      getFeedPosts();
    }
  }, [activeTab, showToast, setPosts]);

  const bgColor = colorMode === "dark" ? "gray.900" : "gray.100";
  const activeTabBgColor = theme;
  const textColor = colorMode === "dark" ? "white" : "black";

  return (
    <Flex>
      {/* Sidebar Section */}
      <Box
        display={{ base: "none", lg: "block" }}
        flex={20}
        position="sticky"
        top="15vh"
      >
        <Sidebar />
      </Box>

      {/* Main Content Section (Posts and Suggested Users) */}
      <Flex
        alignItems={"flex-start"}
        justifyContent={"space-evenly"}
        flex={{ md: 80 }}
        width="100%"
      >
        <Box flex={50} maxW={{ md: "45vw", base: "90vw" }} mx="auto">
          <div className="max-w-[full] md:max-w-[45vw] mx-auto">
            <StatusBar />
          </div>

          <Box
            w="95%"
            mx="auto"
            h="10"
            bg={bgColor}
            display="flex"
            shadow="lg"
            alignItems="center"
            my={{ base: "3", md: "5" }}
            mt={10}
            zIndex="50"
            rounded="lg"
            overflow="hidden"
          >
            <Box
              w="50%"
              cursor="pointer"
              h="10"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={activeTab === "foryou" ? activeTabBgColor : bgColor}
              color={activeTab === "foryou" ? "white" : useColorModeValue("gray.dark", "white")}
              onClick={() => setActiveTab("foryou")}
            >
              For You
            </Box>
            <Box
              w="50%"
              cursor="pointer"
              h="10"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={activeTab === "following" ? activeTabBgColor : bgColor}
              color={activeTab === "following" ? "white" : textColor}
              onClick={() => setActiveTab("following")}
            >
              Following
            </Box>
          </Box>

          {/* Iterate through posts and insert MidSuggestions after every 7 posts */}
          {!loading && posts.length === 0 && (
            <h1 className="text-center">Follow some users to see the feed</h1>
          )}

          {loading && (
            <Flex justify="center">
              <Loader />
            </Flex>
          )}

          <Box>
            {posts?.map((post, i) => (
              <Box key={post._id}>
                {/* Render the post */}
                <Post post={post} postedBy={post.postedBy} activeTab={activeTab} />

                {/* Insert <MidSuggestions /> after every 7 posts */}
                {(i + 1) % 7 === 0 && (
                  <div className="max-w-[90vw] md:max-w-[45vw] md:mx-auto">
                    <MidSuggestions />
                  </div>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          flex={20}
          display={{ base: "none", lg: "block" }}
          position="sticky"
          top="15vh"
          maxW={"22vw"}
        >
          <SuggestedUsers />
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;

