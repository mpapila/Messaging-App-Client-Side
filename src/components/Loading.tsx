import { Box, CircularProgress } from '@mui/material'

function Loading() {

    return (
        <Box sx={{ zIndex: '9999', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <CircularProgress />
        </Box>
    )
}

export default Loading