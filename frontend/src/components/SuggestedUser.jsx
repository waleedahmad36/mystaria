import { Avatar, Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useEffect } from "react";
import themeAtom from "../atoms/themeAtom";
import { useRecoilValue } from "recoil";

const SuggestedUser = ({ user }) => {
    const theme = useRecoilValue(themeAtom);
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
    const buttonBg = useColorModeValue("gray.800", "gray.200");
    const buttonColor = useColorModeValue("white", "gray.800");
    const buttonHoverBg = useColorModeValue("gray.700", "gray.300");

    return (
        <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
            {/* left side */}
            <Flex gap={2} as={Link} to={`${user.username}`}>
                <Avatar src={user.profilePic} name={user.name} />
                <Box>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {user.username}
                    </Text>
                    <Text color={"gray.light"} fontSize={"sm"}>
                        {user.name}
                    </Text>
                </Box>
            </Flex>
           
            <Button
                size={"sm"}
                color={theme}
           
                bg={'none'}
                _hover={{
                    color: buttonHoverBg,
                }}
                onClick={handleFollowUnfollow}
                isLoading={updating}
                px={6} 
                py={2}
                boxShadow="md" 
            >
                {following ? "Following" : "Follow"}
            </Button>
        </Flex>
    );
};

export default SuggestedUser;
