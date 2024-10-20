import { Box, VStack, Icon, Text,  useColorModeValue, Button } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineSettings, MdPersonSearch } from "react-icons/md";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import themeAtom from "../atoms/themeAtom";
import { BsPerson } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";

const MotionBox = motion(Box);

const MobileNav = ({ isOpen, onToggle }) => {
  const bgColor = useColorModeValue("gray.100", "#000");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBgColor = useColorModeValue("gray.300", "gray.700");
  const user = useRecoilValue(userAtom);
  const theme = useRecoilValue(themeAtom);
  const logout = useLogout();

  return (
    <MotionBox
      w={"100vw"}
      h="100vh"
      bg={bgColor}
      color={textColor}
      py={8}
      px={4}
      position="sticky"
      top="15vh"
      transition="all 0.3s ease"
      boxShadow="lg"
      initial={{ x: -600 }}
      animate={{ x: isOpen ? 0 : -600 }}
      exit={{ x: -600 }}
    >
      <VStack spacing={4} align="stretch">
        <RouterLink to="/"  onClick={onToggle}   >
          <Box display="flex" alignItems="center" justifyContent="flex-start" h="50px" px={4}
            _hover={{ bg: hoverBgColor, borderRadius: "md" }} transition="background-color 0.3s ease">
            <Icon as={AiFillHome} boxSize={6}  color={theme}  />
            <Text ml={4} fontWeight="bold">Home</Text>
          </Box>
        </RouterLink>

        <RouterLink to="/allusers"   onClick={onToggle}  >
          <Box display="flex" alignItems="center" justifyContent="flex-start" h="50px" px={4}
            _hover={{ bg: hoverBgColor, borderRadius: "md" }} transition="background-color 0.3s ease">
            <Icon as={MdPersonSearch} boxSize={6}   color={theme} />
            <Text ml={4} fontWeight="bold">Community</Text>
          </Box>
        </RouterLink>

        <RouterLink to={`/chat`}  onClick={onToggle}  >
          <Box display="flex" alignItems="center" justifyContent="flex-start" h="50px" px={4}
            _hover={{ bg: hoverBgColor, borderRadius: "md" }} transition="background-color 0.3s ease">
            <Icon as={HiOutlineChatAlt2} boxSize={6} color={theme}  />
            <Text ml={4} fontWeight="bold">Chat</Text>
          </Box>
        </RouterLink>

        <RouterLink to={`/${user.username}`} onClick={onToggle}  >
          <Box display="flex" alignItems="center" justifyContent="flex-start" h="50px" px={4}
            _hover={{ bg: hoverBgColor, borderRadius: "md" }} transition="background-color 0.3s ease">
            <Icon as={BsPerson} boxSize={6}  color={theme}  />
            <Text ml={4} fontWeight="bold">Profile</Text>
          </Box>
        </RouterLink>

        <RouterLink to="/events" onClick={onToggle}  >
          <Box display="flex" alignItems="center" justifyContent="flex-start" h="50px" px={4}
            _hover={{ bg: hoverBgColor, borderRadius: "md" }} transition="background-color 0.3s ease">
            <Icon as={MdOutlineSettings} boxSize={6}    color={theme}  />
            <Text ml={4} fontWeight="bold">Events</Text>
          </Box>
        </RouterLink>

        <RouterLink to="/settings"  onClick={onToggle}  >
          <Box display="flex" alignItems="center" justifyContent="flex-start" h="50px" px={4}
            _hover={{ bg: hoverBgColor, borderRadius: "md" }} transition="background-color 0.3s ease">
            <Icon as={MdOutlineSettings} boxSize={6}    color={theme}  />
            <Text ml={4} fontWeight="bold">Settings</Text>
          </Box>
        </RouterLink>

       <Button
								size="md"
								bg={theme}
								color={'white'}
								onClick={logout}
								leftIcon={<FiLogOut />}
							>
								Logout
							</Button>
      </VStack>
    </MotionBox>
  );
};

export default MobileNav;
