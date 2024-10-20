import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
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

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();
	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (data.error) {
				showToast(data.error,"Error","error")
				return;
			}
			localStorage.removeItem("user-threads");
			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast(error, error, "error");
		} finally {
			setLoading(false);
		}
	};
	return (
		<Flex align={"center"} justify={"center"} w={'full'}>
	<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={3}>
		<Box
			rounded={"lg"}
			bg={useColorModeValue("white", "rgba(0, 0, 40, 0.2)")}
			boxShadow={"lg"}
			py={8}
			px={3} // Adjust this for better spacing
			w={"full"} // Use full width
		>
			<Text  fontSize={{base:'2xl',md:'4xl'}}  mb={{base:2,md:0}}   >Login to your account</Text>
			<Stack spacing={4}>
				<FormControl isRequired>
					<FormLabel>Username</FormLabel>
					<Input
						type='text'
						value={inputs.username}
						onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
						placeholder="Enter your username"
					/>
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup>
						<Input
							type={showPassword ? "text" : "password"}
							placeholder={'Enter your password'}
							value={inputs.password}
							onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
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
						loadingText='Logging in'
						size='lg'
						bg={useColorModeValue("gray.600", "gray.700")}
						color={"white"}
						_hover={{
							bg: useColorModeValue("gray.700", "gray.800"),
						}}
						onClick={handleLogin}
						isLoading={loading}
					>
						Login
					</Button>
				</Stack>
				<Stack pt={6}>
					<Text align={"center"}>
						Don&apos;t have an account?{" "}
						<Link color={"blue.400"} onClick={() => setAuthScreen("signup")}>
							Sign up
						</Link>
					</Text>
				</Stack>
			</Stack>
		</Box>
	</Stack>
</Flex>

	);
}
