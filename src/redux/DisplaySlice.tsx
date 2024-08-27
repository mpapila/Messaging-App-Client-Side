import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DisplayState } from '../type'




const initialState: DisplayState = {
    showChat: false,
    showChatList: true,
}

const displaySlice = createSlice({
    name: "display",
    initialState,
    reducers: {
        setShowChat: (state, action: PayloadAction<boolean>) => {
            state.showChat = action.payload
        },
        setShowChatList: (state, action: PayloadAction<boolean>) => {
            state.showChatList = action.payload
        }
    }
})

export const { setShowChat, setShowChatList } = displaySlice.actions
export default displaySlice.reducer