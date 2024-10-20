import { Box, VStack, Icon, Text, useColorMode, useColorModeValue, Button } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineSettings, MdPersonSearch, MdOutlineDashboardCustomize, MdEvent } from "react-icons/md";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { Link as RouterLink } from "react-router-dom";
import CoverImage from "./CoverImage";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { CgProfile } from "react-icons/cg";
import themeAtom from "../atoms/themeAtom";

const Sidebar = () => {

	const user = useRecoilValue(userAtom);
	const theme = useRecoilValue(themeAtom);

	// Use Chakra UI's color mode hook
	const { colorMode } = useColorMode();
	const bgColor = useColorModeValue("gray.100", "#000"); // Light or dark background
	const textColor = useColorModeValue("gray.800", "white"); // Adjust text color
	const hoverBgColor = useColorModeValue("gray.300", "gray.700"); // Hover effect color

	return (
		<>
		<Box
			w={{ base: "full", md: "250px" }}
			h="100vh"
			bg={bgColor} // Background color depending on the theme
			color={textColor} // Text color based on theme
			pb={8}
			px={4}
			position="sticky"
			top="15vh"
			transition="all 0.3s ease"
			boxShadow="lg" // Constant box shadow for the sidebar
		>

<CoverImage/>
			
			<VStack spacing={1} align="stretch"   mt={5}  > {/* Use align="stretch" for full-width items */}
				{/* Sidebar Items */}


				<RouterLink to="/">
					<Box 
						display="flex" 
						alignItems="center" 
						justifyContent="flex-start" // Aligns items to start
						h="50px" // Set a fixed height for uniformity
						px={4} // Horizontal padding
						_hover={{ bg: hoverBgColor, borderRadius: "md" }} // Hover effect
						transition="background-color 0.3s ease" // Smooth hover transition
					>
						<Icon as={AiFillHome} boxSize={5}  color={theme} />
						<Text ml={4} fontWeight="bold">Home</Text>
					</Box>
				</RouterLink>


				<RouterLink to={`/${user.username}`}>
					<Box 
						display="flex" 
						alignItems="center" 
						justifyContent="flex-start" 
						h="50px" 
						px={4} 
						_hover={{ bg: hoverBgColor, borderRadius: "md" }} 
						transition="background-color 0.3s ease"
					>
						<Icon as={CgProfile} boxSize={5}   color={theme} />
						<Text ml={4} fontWeight="bold">Profile</Text>
					</Box>
				</RouterLink>


				<RouterLink to="/allusers">
					<Box 
						display="flex" 
						alignItems="center" 
						justifyContent="flex-start" 
						h="50px" 
						px={4} 
						_hover={{ bg: hoverBgColor, borderRadius: "md" }} 
						transition="background-color 0.3s ease"
					>
						<Icon as={MdPersonSearch} boxSize={5}   color={theme} />
						<Text ml={4} fontWeight="bold">Community</Text>
					</Box>
				</RouterLink>


				<RouterLink to="/chat">
					<Box 
						display="flex" 
						alignItems="center" 
						justifyContent="flex-start" 
						h="50px" 
						px={4} 
						_hover={{ bg: hoverBgColor, borderRadius: "md" }} 
						transition="background-color 0.3s ease"
					>
						<Icon as={HiOutlineChatAlt2} boxSize={5}   color={theme} />
						<Text ml={4} fontWeight="bold">Chat</Text>
					</Box>
				</RouterLink>


				<RouterLink to="/events">
					<Box 
						display="flex" 
						alignItems="center" 
						justifyContent="flex-start" 
						h="50px" 
						px={4} 
						_hover={{ bg: hoverBgColor, borderRadius: "md" }} 
						transition="background-color 0.3s ease"
					>
						<Icon as={MdEvent} boxSize={5}  color={theme}  />
						<Text ml={4} fontWeight="bold">Events</Text>
					</Box>
				</RouterLink>

				<RouterLink to="/settings">
					<Box 
						display="flex" 
						alignItems="center" 
						justifyContent="flex-start" 
						h="50px" 
						px={4} 
						_hover={{ bg: hoverBgColor, borderRadius: "md" }} 
						transition="background-color 0.3s ease"
					>
						<Icon as={MdOutlineSettings} boxSize={5}  color={theme}  />
						<Text ml={4} fontWeight="bold">Settings</Text>
					</Box>
				</RouterLink>


				

				
			</VStack>
		</Box>
		</>
	);
};

export default Sidebar;
