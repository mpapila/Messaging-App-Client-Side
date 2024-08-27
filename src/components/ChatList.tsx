import { Box, Button, Card, Grid, IconButton, InputAdornment, List, ListItem, ListItemSecondaryAction, ListItemText, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material"
import PortraitIcon from '@mui/icons-material/Portrait';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddFriend from "./AddFriend";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleShowAddFriend } from "../redux/ChatListSlice";
import { useEffect, useState } from "react";
import { eachCard, User } from "../type";
import { setChatRoomId, setChatSelected, setNewMessages, removeChatRoomIdforNewMessage } from "../redux/ChatRoomSlice";
import PriorityHighIcon from '@mui/icons-material/Error';
import { setLoading } from "../redux/LoadingSlice";
import Loading from "./Loading";
import { reset } from "../redux/LogoutSlice";
import { setShowChat, setShowChatList } from "../redux/DisplaySlice";

function ChatList() {
    const apiUrl = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('token');
    const [notification, setNotification] = useState(true)
    const [notificationBar, setNotificationBar] = useState<boolean>()
    const [pendingUsers, setPendingUsers] = useState<User[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [myId, setMyId] = useState()
    const [myName, setMyName] = useState()
    const [eachCard, setEachCard] = useState<eachCard[]>([])
    const newMessages = useSelector((state: RootState) => state.chatRoom.newMessages)
    const messages = useSelector((state: RootState) => state.chatRoom.messages)
    const isLoading = useSelector((state: RootState) => state.loading.isLoading)
    const showChatList = useSelector((state: RootState) => state.display.showChatList)
    const ChatRoomIdforNewMessage = useSelector((state: RootState) => state.chatRoom.chatRoomIdforNewMessage)
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
    // console.log('eachCard', eachCard)

    const dispatch = useDispatch()
    const showAddFriend = useSelector((state: RootState) => state.chatList.showAddFriend)
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(reset());
        localStorage.removeItem('token');
        navigate('/login')
    }
    const handleShowAddFriend = () => {
        dispatch(toggleShowAddFriend())
    }
    const handleShowNotificationBar = () => {
        console.log('check pending', pendingUsers)
        console.log('all users', allUsers)
        console.log('notificationBar', notificationBar)
        console.log('notification', notification)
        setNotificationBar(!notificationBar)
    }

    useEffect(() => {
        dispatch(setLoading(true))
        fetch(`${apiUrl}/acceptPendingList`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setAllUsers(data.users)
                setPendingUsers(data.pendingUsers)
                setNotification(data.pendingUsers.length > 0);
                setMyId(data.myId)
                // console.log('my name', data)
            })
        fetch(`${apiUrl}/exportCardInfo`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const capitalizedUsername = data.myUsername.charAt(0).toUpperCase() + data.myUsername.slice(1);
                setMyName(capitalizedUsername)
                setEachCard(data.result)
                dispatch(setLoading(false))
            })
    }, [])
    const acceptFriend = async (user: User) => {
        // console.log('button object', user)
        const requesterId = Array.isArray(myId) ? myId[0] : myId;
        const payload = {
            requesterId,
            receiverId: user.id,
            status: "accepted"
        }
        const userString = JSON.stringify(payload)
        const headers = {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
        }

        const options = {
            body: userString,
            method: "POST",
            headers,
        }
        // console.log('payload', payload)
        const URL = `${apiUrl}/acceptFriend`
        const response = await fetch(URL, options)
        const responsePayload = await response.json()
        // console.log('responsePayload', responsePayload.updateFriend)
        if (responsePayload.updateFriend) {
            // console.log('you accepted')
            navigate(0)
        }
    }


    let displayStyle = 'block';
    let widthStyle = '100%';

    if (isMediumScreen) {
        widthStyle = '30%';
    } else if (!isMediumScreen && showChatList) {
        displayStyle = 'block';
    } else if (!isMediumScreen && !showChatList) {
        displayStyle = 'none';
    }

    return (
        <>
            {isLoading && (<Loading />)}
            {showAddFriend && (<AddFriend />)}
            <Box
                width={widthStyle}
                display={displayStyle}
                sx={{
                    height: '100vh', backgroundColor: '#202C33'
                }}>
                <Box paddingX='5px' display='flex' alignItems='center' justifyContent='space-between' sx={{ backgroundColor: '#202C33' }}>
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <Tooltip title="This is only for appearance" arrow enterTouchDelay={0} leaveTouchDelay={3000}>
                            <Box
                                sx={{ display: 'inline-block', '&:hover': { cursor: 'pointer', }, }}>
                                <PortraitIcon
                                    color="primary" sx={{ fontSize: '50px', '&:hover': { color: 'secondary.main', transform: 'scale(1.1)', }, transition: 'transform 0.2s ease-in-out', }} />
                            </Box>
                        </Tooltip>
                        <Typography ml={1} justifySelf='start' color='white'>{myName}</Typography>
                    </Box>
                    <Box display='flex' alignItems='center'>

                        {notification ?
                            (<IconButton onClick={handleShowNotificationBar}>
                                <NotificationsActiveIcon sx={{ fontSize: '25px', color: 'red', }} />
                            </IconButton>)
                            :
                            (
                                <NotificationsOffIcon sx={{ fontSize: '25px', color: 'grey', }} />
                            )
                        }

                        {notificationBar && (
                            <Box
                                mt={30}
                                sx={{ position: 'absolute', width: '200px', backgroundColor: '#111B21', color: 'white', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', }}
                            >
                                <List
                                    sx={{
                                        padding: 0, margin: 0, '& .MuiListItem-root': {
                                            padding: '8px 16px', '& .MuiListItemIcon-root': { display: 'none', },
                                        },
                                    }}
                                >
                                    {allUsers
                                        .filter(user =>
                                            pendingUsers.some(pendingUser =>
                                                pendingUser.requesterId === user.id || pendingUser.receiverId === user.id
                                            )
                                        )
                                        .map((user) => (
                                            <ListItem key={user.id} sx={{ padding: '8px 16px' }}>
                                                <ListItemText primary={
                                                    user.username.charAt(0).toUpperCase() + user.username.slice(1)
                                                } />
                                                <ListItemSecondaryAction>
                                                    <Button variant="contained" color="primary" onClick={() => acceptFriend(user)}>
                                                        Accept
                                                    </Button>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                </List>
                            </Box>
                        )}

                        <IconButton onClick={handleShowAddFriend}>
                            <PersonAddIcon sx={{ fontSize: '25px', color: 'white', }} />
                        </IconButton>
                        <IconButton onClick={handleLogout} sx={{ alignSelf: 'center' }}>
                            <LogoutIcon sx={{ fontSize: '25px', color: 'white', }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box>
                    <Box sx={{ backgroundColor: '#111B21' }}>
                        <TextField multiline inputProps={{ style: { color: 'white' } }} sx={{ width: '100%', "& fieldset": { border: 'none' }, }}
                            InputLabelProps={{ shrink: false }} id="input-with-icon-adornment" placeholder="Search"
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"> <SearchIcon sx={{ color: 'white' }} /></InputAdornment>)
                            }} />
                    </Box>
                    <Box height='100%'>
                        <Grid sx={{ backgroundColor: '#111B21' }}>
                            <Grid
                                maxHeight='88vh'
                                overflow='scroll' sx={{ backgroundColor: '#111B21' }}>
                                {/* <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card>
                                <Card
                                    sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                        backgroundColor: '#111B21',
                                        '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                    }}>
                                    <PortraitIcon color="primary" sx={{ fontSize: '60px', marginRight: '8px' }} />
                                    <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                            <Typography>ghjkghjkhjg</Typography>
                                            <Typography >{'No messages'}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                            <Typography >
                                                jkghkghjk
                                            </Typography>

                                        </Box>
                                    </Box>
                                </Card> */}

                                {eachCard.length > 0 ? (
                                    eachCard.map((chat, index) => {
                                        const isNewMessage = newMessages && ChatRoomIdforNewMessage.includes(chat.chatRoomId)
                                        const chatMessages = messages.filter(message => message.chatRoom === chat.chatRoomId)
                                        const sortedMessages = chatMessages.sort((a, b) => a.date > b.date ? 1 : -1)
                                        const latestMessage = sortedMessages[sortedMessages.length - 1]
                                        const latestDisplay = latestMessage && (
                                            <>
                                                <Typography >
                                                    {latestMessage.text.length == 0
                                                        ? "Click to send Messages"
                                                        : latestMessage.text.length > 100
                                                            ? `${latestMessage.text.substring(0, 10)}...`
                                                            : latestMessage.text}
                                                </Typography>
                                                <Typography mr='6px' sx={{ fontSize: '1px', color: 'green', display: isNewMessage ? 'display' : 'none' }}><PriorityHighIcon /></Typography>
                                            </>
                                        )
                                        return (
                                            <Card
                                                key={index}
                                                onClick={() => {
                                                    dispatch(setNewMessages(false))
                                                    dispatch(setChatSelected(false))
                                                    dispatch(setChatRoomId(chat.chatRoomId));
                                                    dispatch(setChatSelected(true))
                                                    dispatch(setShowChat(true));
                                                    dispatch(setShowChatList(false));
                                                    // console.log('clicked for each chat room', chat.chatRoomId)

                                                    dispatch(removeChatRoomIdforNewMessage(chat.chatRoomId));
                                                }}
                                                sx={{
                                                    display: 'flex', flexDirection: 'row', alignItems: 'center', height: '72px', width: '100%',
                                                    backgroundColor: '#111B21',
                                                    '&:hover': { backgroundColor: '#202C33', cursor: 'pointer' }
                                                }}>
                                                <Tooltip title="This is only for appearance" arrow >
                                                    <Box
                                                        sx={{ display: 'inline-block', '&:hover': { cursor: 'pointer', }, }}>
                                                        <PortraitIcon
                                                            color="primary" sx={{ fontSize: '50px', '&:hover': { color: 'secondary.main', transform: 'scale(1.1)', }, transition: 'transform 0.2s ease-in-out', }} />
                                                    </Box>
                                                </Tooltip>
                                                <Box m={1} sx={{ color: 'white', width: '100%', borderBottom: '1px solid #222D34' }}>
                                                    <Box display="flex" flexDirection='row' justifyContent='space-between'>
                                                        <Typography>
                                                            {chat.friendName.charAt(0).toUpperCase() + chat.friendName.slice(1)}
                                                        </Typography>
                                                        <Typography sx={{ color: isNewMessage ? 'green' : 'white' }}>
                                                            {chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString() : 'No messages'}
                                                        </Typography>
                                                    </Box>
                                                    <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center">
                                                        {latestDisplay}
                                                        {/* <Typography >
                                                            {chat.latestMessage.length > 100 ? `${chat.latestMessage.substring(0, 10)}...` : chat.latestMessage}
                                                        </Typography>
                                                        <Typography mr='6px' sx={{ fontSize: '1px', color: 'green', display: isNewMessage ? 'display' : 'none' }}><PriorityHighIcon />
                                                        </Typography> */}
                                                    </Box>
                                                </Box>
                                            </Card>
                                        )
                                    })
                                ) : (
                                    <Typography color="white">No chats available</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box >
        </>
    )
}

export default ChatList
