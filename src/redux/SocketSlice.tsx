import { createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client"
const token = localStorage.getItem('token');
const apiUrl = import.meta.env.VITE_API_URL


interface SocketState {
    socket: Socket
}
const initialState: SocketState = {
    socket: io(`${apiUrl}`, { autoConnect: false, query: { token } })
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload
        }
    }
})

export const { setSocket } = socketSlice.actions
export default socketSlice.reducer