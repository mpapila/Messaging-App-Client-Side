import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setLoading } from '../redux/LoadingSlice';
import Loading from '../components/Loading';
import '../styles/login.css'
import ContactMailIcon from '@mui/icons-material/Forum';

function Login() {
    const apiUrl = import.meta.env.VITE_API_URL
    const demoToken = import.meta.env.VITE_DEMO_TOKEN
    const dispatch = useDispatch()
    const isLoading = useSelector((state: RootState) => state.loading.isLoading)
    const navigate = useNavigate()
    const [error, setError] = useState('')


    useEffect(() => {
        dispatch(setLoading(true))
        fetch(`${apiUrl}/health-check`)
            .then(response => response.json())
            .then(data => {
                // console.log('data', data)
                if (data.status == 'ok') {
                    dispatch(setLoading(false))
                }
            })
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(setLoading(true))
        const data = new FormData(e.currentTarget)
        const body = {
            username: data.get('username'),
            password: data.get('password')
        }

        const bodyString = JSON.stringify(body)
        const headers = {
            "Content-Type": "application/json"
        }
        const options = {
            body: bodyString,
            method: "POST",
            headers
        }
        const URL = `${apiUrl}/login`
        const response = await fetch(URL, options)
        const responsePayload = await response.json()
        // console.log('responsepayload', responsePayload)
        if (!response.ok) {
            dispatch(setLoading(false))
            setError(responsePayload.message)
            console.log('there in no user', responsePayload)
        }
        if (responsePayload.token) {
            localStorage.setItem("token", responsePayload.token)
            navigate('/')
        }
    }
    const handleDemoAccountClick = () => {
        localStorage.setItem("token", `${demoToken}`);
        navigate('/');
    };
    return (
        <>

            {isLoading && (<Loading />)}

            <Container maxWidth="sm" className="full-background" sx={{
                backgroundColor: '#202C33', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 0
            }}>
                <Box display='flex' flexDirection='row' alignItems='center' >
                    <ContactMailIcon color='success' sx={{ width: '60px', height: '60px' }} />
                    <Typography ml={3} fontSize='30px'>Messaging App</Typography>
                </Box>
                <Box sx={{ marginBottom: 8, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant='h5'>
                        Log In
                    </Typography>
                    {error && (
                        <>
                            <Typography component="h1" color='red' variant='body1'>
                                {error}
                            </Typography>
                        </>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} >
                        <TextField className="custom-textfield" margin='normal' required fullWidth id="username" label="Username" name='username' autoFocus />
                        <TextField className="custom-textfield" margin='normal' required fullWidth name='password' label='Password' type='password' id='password' />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
                            Log In
                        </Button>
                        <Button type="button" fullWidth variant="contained" sx={{ mb: 2 }} onClick={handleDemoAccountClick}>
                            Try a Demo Account
                        </Button>
                        <Button component={RouterLink} to="/register" variant="text" sx={{ textDecoration: 'underline', textTransform: 'none' }}>
                            Don't have an account? Sign Up
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{ position: 'absolute', bottom: 0, width: 'auto', backgroundColor: '#202C33', color: '#fff', textAlign: 'center', py: 2, }}
                >
                    <Typography variant="body2">
                        Mehmet Papila &copy; 2024
                    </Typography>
                </Box>
            </Container >
        </>
    )
}

export default Login
