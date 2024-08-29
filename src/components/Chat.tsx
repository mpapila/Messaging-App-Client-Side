import { Box, IconButton, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import PortraitIcon from '@mui/icons-material/Portrait';
import AddIcon from '@mui/icons-material/Add';
import { EachChatRoom } from "../type";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CloseIcon from '@mui/icons-material/Close';
import { setChatSelected } from "../redux/ChatRoomSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setShowChat, setShowChatList } from "../redux/DisplaySlice";
import { AlwaysScrollToBottom } from "../utils";




function Chat() {
    const apiUrl = import.meta.env.VITE_API_URL
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const token = localStorage.getItem('token');
    const [friendUsername, setFriendUsername] = useState()
    const [myUsername, setMyUsername] = useState()
    const [_userId, _setUserId] = useState<string>()
    const chatSelected = useSelector((state: RootState) => state.chatRoom.chatSelected)
    const chatRoom = useSelector((state: RootState) => state.chatRoom.chatRoomId)
    const [inputValue, setInputValue] = useState("");
    // const [socket, setSocket] = useState<Socket | null>(null);
    const socket = useSelector((state: RootState) => state.socket.socket)
    const messages = useSelector((state: RootState) => state.chatRoom.messages)
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
    const showChatList = useSelector((state: RootState) => state.display.showChatList)

    console.log('messages', messages)


    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetch(`${apiUrl}/exportCardInfo`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setMyUsername(data.myUsername)
                const chatRooms = data.myFriends

                const chat = chatRooms.find((friend: EachChatRoom) => friend.chatRoom === chatRoom)
                if (chat) {
                    if (chat.requester.username !== myUsername) {
                        setFriendUsername(chat.requester.username.charAt(0).toUpperCase() + chat.requester.username.slice(1))
                    } else if (chat.receiver.username !== myUsername) {
                        setFriendUsername(chat.receiver.username.charAt(0).toUpperCase() + chat.receiver.username.slice(1))
                    }
                }
            })
    }, [chatRoom])



    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim() !== "") {
            e.preventDefault();
            console.log('socket', socket)
            if (socket) {
                const messageInput = {
                    text: inputValue,
                    chatRoomId: chatRoom,
                }
                socket.emit('chat message', messageInput);
                setInputValue("");
            } else {
                console.error('Socket is not initialized');
                navigate('/login');
            }
        }
    };
    let displayStyle = 'block';
    let widthStyle = '100%';

    if (isMediumScreen) {
        widthStyle = '70%';
        displayStyle = 'flex';
    } else if (!isMediumScreen && showChatList) {
        displayStyle = 'none';
    } else if (!isMediumScreen && !showChatList) {
        displayStyle = 'flex';
    }




    return (

        <Box
            width={widthStyle}
            height='100vh'
            display={displayStyle}
            flexDirection='column' sx={{ backgroundColor: '#202C33', borderLeft: '5px solid #313D45' }}>
            {!chatSelected ? (
                <>
                    <Typography display='flex' alignItems='center' justifyContent='center' color='white' height='100vh'>Please Select a Person to Open the Chat</Typography>
                </>
            ) : (
                <>
                    <Box paddingX='5px' display='flex' alignItems='center' justifyContent='space-between'
                        sx={{
                            position: isMediumScreen ? 'static' : 'fixed',
                            backgroundColor: '#202C33'

                        }}>
                        <Box display='flex' flexDirection='row' alignItems='center'

                        >
                            {!isMediumScreen && (
                                <Box>
                                    <IconButton
                                        sx={{ color: 'white' }}
                                        onClick={() => {
                                            dispatch(setShowChat(false));
                                            dispatch(setShowChatList(true));
                                        }}
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Box>
                            )}
                            <Tooltip title="This is only for appearance" arrow enterTouchDelay={0} leaveTouchDelay={3000}>
                                <Box
                                    sx={{ display: 'inline-block', '&:hover': { cursor: 'pointer', }, }}>
                                    <PortraitIcon
                                        color="primary" sx={{ fontSize: '50px', '&:hover': { color: 'secondary.main', transform: 'scale(1.1)', }, transition: 'transform 0.2s ease-in-out', }} />
                                </Box>
                            </Tooltip>
                            <Typography color='white'>{friendUsername}</Typography>
                        </Box >

                        <Box
                        >
                            {isMediumScreen && (
                                <IconButton
                                    sx={{ color: 'white' }}
                                    onClick={() => { dispatch(setChatSelected(false)) }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                    <Box
                        overflow='scroll'
                        height='100vh'
                        sx={{
                            height: isMediumScreen ? 'calc(100vh - 56px)' : 'calc(100vh - 112px)', // Dynamically adjust height to account for input bar
                            backgroundImage: 'url("/football-field.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <Box
                            display='flex'
                            flexDirection='column'
                            justifyContent='space-between'
                            sx={{
                                // backgroundColor: 'white',
                                flexGrow: 1,
                            }}
                        >
                            <Box
                                display='flex'
                                flexDirection='column'
                                justifyContent='end'
                                sx={{
                                    height: '100%',
                                    width: '100%'
                                }}
                            >
                                {messages.map((msg, index) => {
                                    if (msg.chatRoom == chatRoom) {
                                        const formattedTime = new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            // Messages sent by the user ('ownmessages') are aligned to the right (flex-end), while messages received from others ('recipients') are aligned to the left (flex-start).
                                            <Box key={index} display='flex' flexDirection='column' alignItems={msg.type === 'ownmessages' ? 'flex-end' : 'flex-start'}>
                                                <Box
                                                    display='flex' flexDirection='column' justifyContent='flex-end' sx={{ maxWidth: '60%', borderRadius: '5px', color: msg.type === 'ownmessages' ? '#A42C3F' : '#8696A0', backgroundColor: msg.type === 'ownmessages' ? '#F8B73F' : '#202C33', padding: '5px', margin: '16px', position: 'relative' }}
                                                >
                                                    <Typography sx={{ overflowWrap: 'break-word' }}>  {msg.text}</Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            color: '#bc2727',
                                                            marginTop: 'auto',
                                                            alignSelf: 'flex-end'
                                                        }}
                                                    >
                                                        {formattedTime}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )
                                    }
                                    return null
                                })}
                                <AlwaysScrollToBottom />
                            </Box>
                        </Box>
                    </Box>
                    <Box display='flex' alignItems='center' sx={{
                        backgroundColor: '#202C33',
                        position: isMediumScreen ? 'static' : 'fixed', // Fixed for mobile screens
                        bottom: 0,
                        width: '100%',
                        padding: '8px 0',
                        zIndex: 1000, // Ensure it stays on top
                    }}>
                        <Tooltip title="This is only for appearance" arrow enterTouchDelay={0} leaveTouchDelay={3000} >
                            <Box
                                sx={{ display: 'inline-block', '&:hover': { cursor: 'pointer', }, }}>
                                <AddIcon
                                    fontSize='large' sx={{ color: '#8696A0', '&:hover': { color: 'secondary.main', transform: 'scale(1.1)', }, transition: 'transform 0.2s ease-in-out', }} />
                            </Box>
                        </Tooltip>
                        <TextField
                            multiline value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            inputProps={{ style: { paddingTop: '3px', paddingBottom: '3px', paddingLeft: '10px', borderRadius: "5px", color: 'white', backgroundColor: '#2A3942' } }}
                            sx={{
                                padding: '0', width: '90%', "& fieldset": { border: 'none' },
                            }}
                            InputLabelProps={{ shrink: false }} placeholder="Type a message" />
                    </Box>

                </>
            )}
        </Box>
    )
}

export default Chat
