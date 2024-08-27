import { Box } from "@mui/material";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";


function Home() {


    return (
        <Box display='flex' flexDirection='row'>
            <ChatList />
            <Chat />
        </Box >
    )
}

export default Home
