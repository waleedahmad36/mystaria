import {
	Button,
	Flex,
	IconButton,
	HStack,
	Input,
	useColorMode,
	useDisclosure,
	Tooltip,
	Box,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Badge,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { FiLogOut } from "react-icons/fi";
import { BsFillMoonFill, BsFillSunFill, BsBellFill } from "react-icons/bs";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { useState, useEffect } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { IoNotifications } from "react-icons/io5";
import { useSocket } from "../context/SocketContext"; // Import the useSocket hook
import themeAtom from "../atoms/themeAtom";

const Header = ({ onToggle }) => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const navigate = useNavigate();
	const { isOpen } = useDisclosure();
	const [isScrolled, setIsScrolled] = useState(false);
	const [notifications, setNotifications] = useState([]); // Store notifications
	const [unreadCount, setUnreadCount] = useState(0); // Unread notifications count
	const [loading, setLoading] = useState(true);
	const { socket } = useSocket(); // Get socket from useSocket
	const theme = useRecoilValue(themeAtom)
	const setTheme = useSetRecoilState(themeAtom);


	const handleTheme = ()=>{
		if(theme==='#9333EA'){
			setTheme('#FF0016')
		}else{
			setTheme('#9333EA')
		}
	}

	// Scroll effect for the sticky header
	const handleScroll = () => {
		setIsScrolled(window.scrollY > 0);
	};

	// Fetch notifications from the server on mount
	useEffect(() => {
		const fetchNotifications = async () => {
			if (!user) return;

			try {
				const response = await fetch(`/api/notifications?userId=${user._id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				});

				if (!response.ok) throw new Error("Network response was not ok");

				const data = await response.json();
				setNotifications(data);
				// console.log('notifications length is',notifications.length)
				setUnreadCount(data.length); // Count unread notifications
			} catch (error) {
				console.error("Error fetching notifications:", error);
			} finally {
				setLoading(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		fetchNotifications();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [user]);

	// Real-time notification updates via socket
	useEffect(() => {
		if (socket) {
			socket.on("notification", (notification) => {
				setNotifications((prev) => [...prev, notification]);
				setUnreadCount((prevCount) => prevCount + 1); // Increment unread count
			});
		}

		return () => {
			if (socket) socket.off("notification");
		};
	}, [socket]);

	// Handle notification click
	const handleNotificationClick = () => {
		navigate("/notification");
	};

	return (
		<Flex
			justifyContent="space-between"
			alignItems="center"
			// mb={8}
			px={4}
			py={4}
			boxShadow={isScrolled ? "md" : "none"}
			position="sticky"
			top={0}
			zIndex={1000}
			backgroundColor={isScrolled ? (colorMode === "dark" ? "#000" : "gray.100") : "transparent"}
			color={isScrolled ? (colorMode === "dark" ? "white" : "gray.800") : "white"}
			transition="background-color 0.3s ease, color 0.3s ease"
		>
			{/* Left side: Logo or home button */}
			{user && (
				<RouterLink to="/">
					<img src={theme === '#9333EA' ? 'm logo 12.png' : 'm.png'} alt="" className="w-10 h-10" />
				</RouterLink>
			)}

			{/* Center: Search bar and icons */}
			<HStack spacing={6} alignItems="center" flex={1} justifyContent="center">
				{/* Search bar */}
				{user && (
					<Box position="relative">
						<Input
							placeholder="Search..."
							size="md"
							w={"20vw"}
							borderRadius="md"
							onFocus={() => navigate("/search")}
							cursor={'pointer'}
							value={'Search...'}
							textColor={useColorModeValue('gray.900','gray.300')}
						/>
					</Box>
				)}

				{/* Notifications */}
				{user && (
	<Menu>
		<MenuButton as={Box} position="relative" cursor={'pointer'}  onClick={handleNotificationClick} >
			<Tooltip label="Notifications" placement="bottom" hasArrow  >
				<IconButton
					icon={<BsBellFill   />}
					aria-label="Notifications"
					size="md"
					variant="ghost"
					isRound
					_hover={{ backgroundColor: colorMode === "dark" ? "gray.700" : "gray.100" }}
				/>
			</Tooltip>

			{/* Display unread count if there are unread notifications */}
			{unreadCount > 0 && (
				<Badge
					colorScheme="red"
					borderRadius="full"
					position="absolute"
					top="-1"
					right="-1"
					fontSize="0.8em"
				>
					{unreadCount}
				</Badge>
			)}
		</MenuButton>

		
	</Menu>
)}

			</HStack>

			{/* Right side: Logout or Hamburger Menu for small screens */}
			<HStack spacing={6} alignItems="center">
				<Tooltip label="Toggle Theme" placement="bottom" hasArrow    background={theme} color={'white'}  >
					<IconButton
						onClick={toggleColorMode}
						icon={colorMode === "dark" ? <BsFillSunFill /> : <BsFillMoonFill />}
						aria-label="Toggle theme"
						size="md"
						variant="ghost"
						_hover={{ backgroundColor: colorMode === "dark" ? "gray.700" : "gray.100" }}
						isRound
					/>
				</Tooltip>


				{user && (
					<Box  display={{ base: "none", md: "inline-flex" }}  >
						<Tooltip label="color scheme" placement="bottom" hasArrow    background={theme} color={'white'}  >
					<IconButton
						onClick={handleTheme}
						icon={<Box w={5} h={5} bg={theme} rounded={'full'}  ></Box>}
						aria-label="Toggle theme"
						size="md"
						variant="ghost"
						_hover={{ backgroundColor: colorMode === "dark" ? "gray.700" : "gray.100" }}
						isRound
					/>
				</Tooltip>
					</Box>
				)}



				{/* For small screens, show the Hamburger Menu */}
				{user && (
					<IconButton
						icon={<HamburgerIcon   color={theme} />}
						aria-label="Menu"
						size="md"
						variant="ghost"
						display={{ base: "inline-flex", md: "none" }}
						onClick={onToggle}
					/>
				)}

				{/* Show Logout button only on larger screens with Tooltip */}
				{user && (
					<Box  as="span"   display={{ base: "none", md: "inline-flex" }}  >
					<Tooltip label="Logout" placement="bottom" hasArrow  background={theme} color={'white'}       >
						<span>
							<Button
								size="md"
								bg={theme}
								color={'white'}
								onClick={logout}
								leftIcon={<FiLogOut />}
								display={{ base: "none", md: "inline-flex" }}
							>
								Logout
							</Button>
						</span>
					</Tooltip>
					</Box>
				)}
			</HStack>
		</Flex>
	);
};

export default Header;
