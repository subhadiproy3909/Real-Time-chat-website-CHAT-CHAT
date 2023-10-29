import { FormControl, Input, useDisclosure } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Box} from '@chakra-ui/react'
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";


import { ChatState } from "../../context/chatProvider";
import UserListItem from '../userDetails/UserListItem';
import UserBadgeItem from "../userDetails/UserBadgeItem";


const GroupChatModal = ({ children }) => {

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const {user, chats, setChats} = ChatState();

    

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query){
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const {data} = await axios.get(`/api/users?search=${search}`, config);
            setSearchResult(data);
            setLoading(false);
        } catch (err) {
            
        }
    };

    const handleSelectedUser = (selectedUser) =>{
        if(selectedUsers.includes(selectedUser)){
            toast({
                title: "User already add",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, selectedUser]);
    }

    const handleDelete = (removeUser) =>{
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== removeUser._id)
        )
    }

    const handleSubmit = async () =>{
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-type": "application/json",
                }
            }

            const {data} = await axios.post('/api/chat/group', 
            {
                users: JSON.stringify(selectedUsers.map(u => u._id)), 
                name: groupChatName}, 
            config
            );

            setChats([data, ...chats]);
            setLoading(false);
            onClose();
            toast({
                title: "New Group has Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            
        }
    }

    return (
        <>
            <span onClick={onOpen}> {children} </span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={"25px"} fontFamily={"Work sans"} display={"flex"} justifyContent={"center"}>
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
                        <FormControl>
                            <Input placeholder="Chat Name" mb={3} onChange={(e) => {setGroupChatName(e.target.value); /*console.log(e.target.value)*/}} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Search Contacts" mb={1} onChange={(e) => {handleSearch(e.target.value); /*console.log(e.target.value)*/}} />
                        </FormControl>

                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
                        {
                            selectedUsers.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleAccessUser={() => handleDelete(u)} />
                            ))
                        }
                        </Box>

                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            searchResult.slice(0,4).map(user => (
                                <UserListItem key={user._id} user={user} handleAccessUser={() => handleSelectedUser(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue'  onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal;