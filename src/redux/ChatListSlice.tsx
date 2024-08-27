import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatListState } from '../type'
import { reset } from './LogoutSlice';

const initialState: ChatListState = {
    showAddFriend: false,
}


const chatListSlice = createSlice({
    name: "chatList",
    initialState,
    reducers: {
        toggleShowAddFriend(state) {
            state.showAddFriend = !state.showAddFriend
        },
        setShowAddFriend(state, action: PayloadAction<boolean>) {
            state.showAddFriend = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(reset, () => initialState);
    },
});

export const { toggleShowAddFriend, setShowAddFriend } = chatListSlice.actions
export default chatListSlice.reducer