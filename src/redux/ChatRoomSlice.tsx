import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatRoomState, Message } from '../type';
import { reset } from './LogoutSlice';


const initialState: ChatRoomState = {
  chatSelected: false,
  chatRoomId: null,
  chatRoomIdsWithNewMessages: [],
  // chatRoomIdforNewMessage: [],
  messages: [],
}

const chatRoomSlice = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      date: new Date(action.payload.date).toISOString()
      state.messages.push(action.payload);
    },
    addChatRoomIdWithNewMessages: (state: ChatRoomState, action: PayloadAction<string>) => {
      state.chatRoomIdsWithNewMessages.push(action.payload);
    },
    removeChatRoomIdWithNewMessages: (state: ChatRoomState, action: PayloadAction<string>) => {
      state.chatRoomIdsWithNewMessages = state.chatRoomIdsWithNewMessages.filter(id => id !== action.payload)
    },
    // setChatRoomIdforNewMessage: (state: ChatRoomState, action: PayloadAction<string | null>) => {
    //   state.chatRoomIdforNewMessage.push(action.payload);
    // },
    // removeChatRoomIdforNewMessage: (state: ChatRoomState, action: PayloadAction<string | null>) => {
    //   state.chatRoomIdforNewMessage.filter(id => id !== action.payload)
    // },
    // setNewMessages: (state: ChatRoomState, action: PayloadAction<boolean>) => {
    //   state.chatRoomIdsWithNewMessages = action.payload
    // },
    setChatRoomId: (state: ChatRoomState, action: PayloadAction<string | null>) => {
      state.chatRoomId = action.payload;
    },
    setChatSelected: (state: ChatRoomState, action: PayloadAction<boolean>) => {
      state.chatSelected = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(reset, () => initialState);
  },
})

export const { setChatRoomId, setChatSelected, addChatRoomIdWithNewMessages, removeChatRoomIdWithNewMessages, setMessages, addMessage } = chatRoomSlice.actions
export default chatRoomSlice.reducer