import { Box, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleShowAddFriend } from '../redux/ChatListSlice';
import { User } from '../type';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../redux/LoadingSlice';

function AddFriend() {
    const apiUrl = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('token');
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useSelector((state: RootState) => state.chatList.showAddFriend)
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [pendingId, setPendingId] = useState<User[]>([])
    const isLoading = useSelector((state: RootState) => state.loading.isLoading)



    useEffect(() => {
        dispatch(setLoading(true))
        fetch(`${apiUrl}/addUserList`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setAllUsers(data.users)
                setPendingId(data.pendingUsers)
                console.log('users', data)
                dispatch(setLoading(false))
            })
    }, []);
    console.log('allusers', allUsers)

    // console.log('pendingids', pendingId)

    const handleAddFriend = async (user: User) => {
        dispatch(setLoading(true))
        const userString = JSON.stringify(user)
        const headers = {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
        }
        const options = {
            body: userString,
            method: "POST",
            headers,
        }
        const URL = `${apiUrl}/addFriend`
        const response = await fetch(URL, options)
        const responsePayload = await response.json()
        console.log('response', responsePayload)
        console.log('user info', user)


        if (response.ok) {
            if (responsePayload.additionalData) {
                navigate(0)
            }
            fetch(`${apiUrl}/addUserList`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    // Update the state with the new data
                    setAllUsers(data.users);
                    setPendingId(data.pendingUsers);
                    console.log('Updated users and pending requests', data);
                })
                .finally(() => {
                    dispatch(setLoading(false));
                });
        }


    };
    const handleClose = () => {
        dispatch(toggleShowAddFriend());
    };
    return (
        <>
            <Box sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: '9999'
            }}>


                <IconButton
                    sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <List sx={{ bgcolor: 'background.paper', width: '300px', mt: 2 }}>
                    {allUsers.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No users available" />
                        </ListItem>
                    ) : (
                        allUsers.map((user) => {
                            const isPending = pendingId.some(pendingUser => pendingUser.receiverId === user.id);

                            return (
                                <ListItem key={user.id}>
                                    <ListItemText
                                        primary={
                                            user.username === 'admin'
                                                ? <strong style={{ marginRight: '200px', color: 'red' }}>{user.username.charAt(0).toUpperCase() + user.username.slice(1)} (Auto Accept)</strong>
                                                : user.username.charAt(0).toUpperCase() + user.username.slice(1)
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Button variant="contained" color="primary" onClick={() => handleAddFriend(user)} disabled={isPending}>
                                            {isPending ? 'Pending' : 'Add Friend'}
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })
                    )}
                </List>
            </Box>
        </>
    )
}

export default AddFriend
