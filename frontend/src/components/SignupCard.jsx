import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Text,
	useColorModeValue,
	Link,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useSetRecoilState } from "recoil";
  import authScreenAtom from "../atoms/authAtom";
  import useShowToast from "../hooks/useShowToast";
  import userAtom from "../atoms/userAtom";
  
  export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
	  name: "",
	  username: "",
	  email: "",
	  password: "",
	});
  
	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);
  

const validateInputs = () => {
	const { name, username, email, password } = inputs;
  
	// Check for minimum length
	if (name.length < 3) {
	  showToast("Invalid name", "Full name must be at least 3 characters long.", "error");
	  return false;
	}
	if (username.length < 3) {
	  showToast("Invalid username", "Username must be at least 3 characters long.", "error");
	  return false;
	}
	if (password.length < 3) {
	  showToast("Password too short", "Password must be at least 3 characters long.", "error");
	  return false;
	}
  
	const namePattern = /^[A-Za-z]{3}/;
	const usernamePattern = /^[A-Za-z]{3}/;
  
	if (!namePattern.test(name)) {
	  showToast(
		"Fake name",
		"Full name must start with at least three letters (A-Z or a-z).",
		"error"
	  );
	  return false;
	}
  
	if (!usernamePattern.test(username)) {
	  showToast(
		"Fake username",
		"Username must start with at least three letters (A-Z or a-z).",
		"error"
	  );
	  return false;
	}
  

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const emailStartPattern = /^[A-Za-z]/; 
  
	if (!emailPattern.test(email)) {
	  showToast("Invalid email", "Please enter a valid email address.", "error");
	  return false;
	}
  
	if (!emailStartPattern.test(email)) {
	  showToast("Fake email", "Email cannot start with a number.", "error");
	  return false;
	}
  
	return true;
  };
  
  
  
	const handleSignup = async () => {
	  if (!validateInputs()) {
		return; 
	  }
  
	  try {
		const res = await fetch("/api/users/signup", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(inputs),
		});
		const data = await res.json();
  
		if (data.error) {
		  showToast(data.error, data.error, "error");
		  return;
		}
		localStorage.removeItem("user-threads");
		localStorage.setItem("user-threads", JSON.stringify(data));
		setUser(data);
	  } catch (error) {
		showToast(error, error, "error");
	  }
	};
  
	return (
	  <Flex align={"center"} justify={"center"}>
		<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={{base:'4',md:6}}>
		 
		  <Box rounded={"lg"} bg={useColorModeValue("white", "rgba(0, 0, 40, 0.2)")} boxShadow={"lg"} py={8}
		  px={{base:2,md:8}}   >
			<Stack spacing={4}>
			  <HStack>
				<Box>
				  <FormControl isRequired>
					<FormLabel>Full name</FormLabel>
					<Input
					  type="text"
					  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
					  value={inputs.name}
					  placeholder="Enter name"
					/>
				  </FormControl>
				</Box>
				<Box>
				  <FormControl isRequired>
					<FormLabel>Username</FormLabel>
					<Input
					  type="text"
					  onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
					  value={inputs.username}
					  placeholder="Enter username"
					/>
				  </FormControl>
				</Box>
			  </HStack>
			  <FormControl isRequired>
				<FormLabel>Email address</FormLabel>
				<Input
				  type="email"
				  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				  value={inputs.email}
				  placeholder="Enter valid email"
				/>
			  </FormControl>
			  <FormControl isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
				  <Input
					type={showPassword ? "text" : "password"}
					onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
					value={inputs.password}
					placeholder="Enter password"
				  />
				  <InputRightElement h={"full"}>
					<Button
					  variant={"ghost"}
					  onClick={() => setShowPassword((showPassword) => !showPassword)}
					>
					  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</Button>
				  </InputRightElement>
				</InputGroup>
			  </FormControl>
			  <Stack spacing={10} pt={2}>
				<Button
				  loadingText="Submitting"
				  size="lg"
				  bg={useColorModeValue("gray.600", "gray.700")}
				  color={"white"}
				  _hover={{
					bg: useColorModeValue("gray.700", "gray.800"),
				  }}
				  onClick={handleSignup}
				>
				  Sign up
				</Button>
			  </Stack>
			  <Stack pt={6}>
				<Text align={"center"}>
				  Already a user?{" "}
				  <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
					Login
				  </Link>
				</Text>
			  </Stack>
			</Stack>
		  </Box>
		</Stack>
	  </Flex>
	);
  }
  