import { Box } from "@chakra-ui/react"
import {CloseIcon} from "@chakra-ui/icons";


const UserBadgeItem = ({user, handleAccessUser}) =>{

    return (
        <Box px={2} py={1} borderRadius={"lg"} m={1} mb={2} fontSize={11} color={"white"} bg={"purple"}
            cursor={"pointer"} onClick={handleAccessUser}
        >
            {user.name}
            <CloseIcon pl={1} ml={2} />
        </Box>
    )
}

export default UserBadgeItem;