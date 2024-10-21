import { useRecoilValue, useSetRecoilState } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text, theme, useColorMode } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";

const AuthPage = () => {
	const showToast = useShowToast();
	const authScreenState = useRecoilValue(authScreenAtom);
	const [loading,setLoading] = useState(false)
	const [authentic,setAuthentic] = useState(false);
	const [code,setCode]=useState('');
	const [userCode,setUserCode]=useState('');
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const colorMode = useColorMode();


	const getCode = async ()=>{
		try {
			const res = await fetch('/api/code');
			const data = await res.json();
			setCode(data[0].text);
			console.log('code is',code)
		} catch (error) {
			console.log(error);
		}
	}

	const handleVerify = ()=>{
		setLoading(true);
		if(code === userCode){
			setAuthentic(true);
			showToast("you can register now","success","success")
		}else{
			showToast("invalid code","error","error")
		}
		setLoading(false)
	}
	// yklLS4FVNf

	useEffect(()=>{
		getCode();
	},[])
	return <>
	<div  className="md:flex md:justify-around " >
		<div className=""  > 
	{authScreenState === "login" ? <LoginCard /> : authentic ? <SignupCard />  : (
		<>
		<Box  minW={'40vw'}  mt={{base:'20',md:'2'}}    px={3}   >
			<Text   fontSize={'x-large'}   >Welcome to   <span  className={`text-[${theme}]`}  >Mystaria</span> </Text>
			<Input  placeholder="Give membership Code"  mt={4}  onChange={(e)=>setUserCode(e.target.value)}   />

			<Flex  justifyContent={'flex-end'} mt={4} >
			<Button  colorScheme="gray"  onClick={handleVerify} isLoading={loading}  >Verify</Button>
			</Flex>

			<Text  mt={10}  >Already have an account ? <Button bg={'none'}  onClick={()=>setAuthScreen("login")}  >Login</Button></Text>
		</Box>
		</>
	)  }

</div>
	<img src='m.png' alt=""  className="h-[80vh] max-w-[50vw] hidden lg:block"  />
	</div>
	</>;
};

export default AuthPage;
