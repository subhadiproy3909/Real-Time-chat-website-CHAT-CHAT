import { VStack, FormControl, Input, InputGroup, FormLabel, InputRightElement, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";


const Signup = () =>{

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setComfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();


    const handleClick = () => setShow(!show);

    const postDetails = (pics) =>{
        setLoading(true);

        if(pics === undefined){
            toast({
                title: "Please add an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chit-chat");
            data.append("cloud_name", "subhadip");
            fetch("https://api.cloudinary.com/v1_1/subhadip/image/upload",{
                method: "post", body: data
            }).then((res) => res.json())
              .then(data => {
                setPic(data.url.toString());
                // console.log(data.url.toString());
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
        }
        else{
            toast({
                title: "Please add an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    const submitHandler = async () =>{
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
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

        if(password !== confirmPassword){
            toast({
                title: "Invalid input",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        try{
            const config = {
                header: {
                    "Content-type": "application/json"
                }
            };

            const { data } = await axios.post("/api/user/signup", {name, email, password, pic}, config);

            toast({
                title: "Registration Successful",
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
            <FormControl id="first-name" isRequired>
                <FormLabel>Name: </FormLabel>
                <Input  placeholder="Enter your Name" onChange={(e) => setName(e.target.value)}/>
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email ID: </FormLabel>
                <Input  placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)}/>
            </FormControl>
        
            <FormControl id="password" isRequired>
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
            
            <FormControl id="cpassword" isRequired>
                <FormLabel>Confirm Password: </FormLabel>
                <InputGroup size={'md'}>
                    <Input type={show? 'text' : 'password'} placeholder="Comfirm password" onChange={(e) => setComfirmpassword(e.target.value)}/>
                </InputGroup>
            </FormControl>

            <FormControl id="pic">
                <FormLabel>Upload profile image: </FormLabel>
                <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])}/>
            </FormControl>

            <Button
                colorScheme="blue" width={"100%"} style={{marginTop: 15}} onClick={submitHandler} isLoading={loading}
            >
                Sign Up
            </Button>

        </VStack>
    )
}

export default Signup;