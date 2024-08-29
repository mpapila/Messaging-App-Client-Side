import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react';

function Loading() {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ zIndex: '9999', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            {showMessage && (
                <Typography
                    variant="body2"
                    color="white"
                    sx={{ mb: 2, textAlign: 'center' }}
                >
                    Occasionally, long loading times may occur due to limitations with Free Tier Hosting. If you experience a delay, please wait a couple of minutes and then refresh the page. We appreciate your patience and understanding.
                </Typography>
            )}
            <CircularProgress />
        </Box>
    )
}

export default Loading