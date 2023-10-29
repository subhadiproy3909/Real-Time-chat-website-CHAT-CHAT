import { VStack, FormControl, Input, InputGroup, FormLabel, InputRightElement, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {useHistory} from "react-router-dom";



const Login = ()=>{
    
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);

    const submitHandler = async () =>{
        if(!email || !password){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        try{
            const config = {
                header: {
                    "Content-type": "application/json"
                }
            };

            const { data } = await axios.post("/api/user/login", {email, password}, config);

            // const {getData} = await axios.get("/api/user", config);
            // console.log(getData);

            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            history.push("/chats")
        }
        catch(error){
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    return (
        <VStack>
            <FormControl id="log_email" isRequired>
                <FormLabel>Email ID: </FormLabel>
                <Input  placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)}/>
            </FormControl>
        
            <FormControl id="log_password" isRequired>
                <FormLabel>Password: </FormLabel>
                <InputGroup>
                    <Input type={show? 'text' : 'password'} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}/>
                    <InputRightElement>
                        <Button h='1.75rem' size={'sm'}  onClick={handleClick}>
                            {show ? 'Hide': "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <Button
                colorScheme="blue" width={"100%"} style={{marginTop: 15}} onClick={submitHandler}
            >
                Login
            </Button>

            <Button
                variant={"solid"} colorScheme="red" width={'100%'} onClick={() =>{
                    setEmail("guest@example.com");
                    setPassword("12345678");
                }}
            >
                Get Guest User Credentials
            </Button>

        </VStack>
    )
}

export default Login;