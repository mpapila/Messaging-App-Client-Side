import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setLoading } from '../redux/LoadingSlice';
import '../styles/login.css'
import ContactMailIcon from '@mui/icons-material/Forum';
import { useState } from 'react';

function Register() {
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL
    const dispatch = useDispatch()
    const isLoading = useSelector((state: RootState) => state.loading.isLoading)
    const [error, setError] = useState('')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(setLoading(true))
        const data = new FormData(e.currentTarget);
        const body = {
            username: data.get('username'),
            password: data.get('password'),
            email: data.get('email')
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
        const URL = `${apiUrl}/register`

        const response = await fetch(URL, options)
        const responsePayload = await response.json()
        console.log('response payload', responsePayload)
        if (!response.ok) {
            setError(responsePayload.error)
        }
        if (response.ok) {
            dispatch(setLoading(false))
            navigate('/')
        }
    }
    return (
        <>
            <Container maxWidth="sm" className="full-background" sx={{
                backgroundColor: '#202C33', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 0
            }}>
                <Box display='flex' flexDirection='row' alignItems='center' >
                    <ContactMailIcon color='success' sx={{ width: '60px', height: '60px' }} />
                    <Typography ml={3} fontSize='30px'>Messaging App</Typography>
                </Box>
                <Box sx={{ marginBottom: 8, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    {error && (
                        <>
                            <Typography component="h1" color='red' variant='body1'>
                                {error}
                            </Typography>
                        </>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

                        <TextField
                            className="custom-textfield"
                            margin='normal'
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                        />
                        <TextField
                            className="custom-textfield"
                            margin='normal'
                            required
                            fullWidth
                            id="email"
                            type='email'
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            className="custom-textfield"
                            margin='normal'
                            required
                            fullWidth
                            type='password'
                            id="password"
                            label="Password"
                            name="password"
                            autoComplete="password"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign Up
                        </Button>
                        <Button component={RouterLink} to="/login" variant="text" sx={{ textDecoration: 'underline', textTransform: 'none' }}>
                            Already have an account? Sign in
                        </Button>
                    </Box>

                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: 'auto',
                        backgroundColor: '#202C33',
                        color: '#fff',
                        textAlign: 'center',
                        py: 2,
                    }}
                >
                    <Typography variant="body2">
                        Mehmet Papila &copy; 2024
                    </Typography>
                </Box>
            </Container>
        </>
    )
}

export default Register
