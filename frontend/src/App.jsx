import { Box, useDisclosure, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import AllUsers from "./pages/AllUsers";
import SearchPage from "./pages/SearchPage";
import Solutions from "./pages/Solutions";
import JarvisForm from "./pages/JarvisForm";
import Work from "./pages/Work";
import Mystaria from "./pages/Mystaria";
import MobileNav from "./components/MobileNav";
import NotificationsPage from "./pages/NotificationPage";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Event from "./pages/Event";

function App() {
	const { colorMode } = useColorMode();
	const { isOpen, onToggle } = useDisclosure();
	const user = useRecoilValue(userAtom);
	const { pathname } = useLocation();
	const isMobile = useBreakpointValue({ base: true, md: false });
	const [isVisible, setIsVisible] = useState(isOpen);

	useEffect(() => {
		// When isOpen changes, apply a 1-second delay before changing isVisible
		if (isOpen) {
			setIsVisible(true); // Show instantly when opened
		} else {
			// Apply a 1-second delay before hiding
			const timeoutId = setTimeout(() => setIsVisible(false), 1000);
			return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
		}
	}, [isOpen]);

	return (
		<>
			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						background: colorMode === 'dark' ? '#000' : '#fff',
						color: colorMode === 'dark' ? '#fff' : '#000',
						zIndex: '9999',
					},
				}}
			/>
			<Box position={"relative"} w='full' backgroundColor={pathname === '/jarvis' ? '#000' : 'inherit'} minH={'100vh'}>
				<Header onToggle={onToggle} />


				

				{user && isMobile && (
					<div className={`absolute z-50 transition-opacity duration-1000 ${!isOpen && !isVisible ? 'hidden' : ''}`}>
						<MobileNav isOpen={isOpen} onToggle={onToggle} />
					</div>
				)} {/* Conditional rendering of MobileNav */}
				<Box maxW={
					pathname === "/"
						? { base: "620px", md: "full" }
						: pathname === "/allusers" || pathname === "/solutions" || pathname === '/jarvis' || pathname === '/mystaria' || pathname==='/auth'
							? { base: "620px", md: "full" }
							: { base: "full", md: "700px" }
				}
				px={
					pathname === "/" || pathname === "/settings" ?
					'10px' : ''
				}
				mx={'auto'}
				>
					<Routes>
						<Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
						<Route path='/notification' element={user ? <NotificationsPage /> : <Navigate to='/auth' />} />
						<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
						<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />
						<Route
							path='/:username'
							element={
								user ? (
									<>
										<UserPage />
										<CreatePost />
									</>
								) : (
									<UserPage />
								)
							}
						/>
						<Route path='/:username/post/:pid' element={<PostPage />} />
						<Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
						<Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
						<Route path='/allusers' element={user ? <AllUsers /> : <Navigate to={"/auth"} />} />
						<Route path='/search' element={user ? <SearchPage /> : <Navigate to={"/auth"} />} />
						<Route path='/solutions' element={user ? <Solutions /> : <Navigate to={"/auth"} />} />
						<Route path='/events' element={user ? <Event /> : <Navigate to={"/auth"} />} />
						<Route path='/jvform' element={user ? <JarvisForm /> : <Navigate to={"/auth"} />} />
						<Route path='/jarvis' element={user ? <Work /> : <Navigate to={"/auth"} />} />
						<Route path='/mystaria' element={user ? <Mystaria /> : <Navigate to={"/auth"} />} />
					</Routes>
				</Box>
			</Box>
		</>
	);
}

export default App;
