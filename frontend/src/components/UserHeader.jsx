import React, { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Link,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Button,
  useToast,
  Input,
} from "@chakra-ui/react";
import { BsInstagram, BsPlus } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import themeAtom from "../atoms/themeAtom";


const UserHeader = ({ user }) => {
  const theme = useRecoilValue(themeAtom);
  const toast = useToast();
  const [complain,setComplain]=useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading,setLoading]=useState(false);
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  console.log(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/complain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author: currentUser._id,
          username: user.username,
          description,
          url,
        }),
      });

      if (response.ok) {
        toast({
          title: "Complain submitted.",
          status: "success",
          description: "Your complaint has been submitted successfully.",
          duration: 3000,
          isClosable: true,
        });
        setComplain(false);
        setTitle("");
        setUrl("");
        setDescription("");
      } else {
        const data = await response.json();
        toast({
          title: "Error.",
          status: "error",
          description: data.message,
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error.",
        status: "error",
        description: "An error occurred while submitting your complaint.",
        duration: 3000,
        isClosable: true,
      });
    }finally{
      setLoading(false)
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text fontSize={"xs"} bg={"gray.dark"} color={"white"} p={2} borderRadius={"full"}>
              {user.bio}
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic ? (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "lg",
              }}
              _hover={{
                cursor: "pointer",
                transition: "transform 0.2s",
				opacity:0.6
              }}
            />
          ) : (
            <Avatar
              name={user.name}
              src='https://bit.ly/broken-link'
              size={{
                base: "md",
                md: "xl",
              }}
              _hover={{
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            />
          )}
        </Box>
      </Flex>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to='/update'>
          <Button size={"sm"}    bg={theme}  color={'white'}  >Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}   bg={theme} color={'white'}      >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className='icon-container'>
            <BsInstagram size={24} cursor={"pointer"}   fontWeight={'bold'} />
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton  _hover={{color:'gray.500'}}  >
                <CgMoreO size={24} cursor={"pointer"}    />
              </MenuButton>
              <Portal>
                <MenuList bg={""}>
                  <MenuItem bg={""} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                  {
                    currentUser?._id !== user._id && (
                      <MenuItem  bg={""}   onClick={()=>setComplain(true)} >
                      Report {user?.username}
                      </MenuItem>
                    )
                  }
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      //for sending user complains
      
      {
        complain && (
          <Flex  flexDirection={'column'} w='full'  >
        <Flex  gap='2' >
        <Input  type="text"  placeholder="Issue Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input  type="text"  placeholder="provide url of user id  (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
        </Flex>
        <Input  type="text"  placeholder="Explain briefly" value={description} onChange={(e) => setDescription(e.target.value)} my='2' />
        <Button onClick={handleSubmit} isLoading={loading}>Send Complain</Button>
      </Flex>
        )
      }

      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb='3'
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;


