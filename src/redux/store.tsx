import { configureStore } from "@reduxjs/toolkit";
import chatListReducer from './ChatListSlice'
import chatRoomReducer from './ChatRoomSlice'
import loadingReducer from "./LoadingSlice";
import LogoutReducer from "./LogoutSlice";
import DisplayReducer from "./DisplaySlice";
import SocketReducer from "./SocketSlice";


export const defaultMiddlewareConfig = {
    serializableCheck: {
        ignoredPaths: ["filters.startDate", "filters.endDate"],
    }
};

export const store = configureStore({
    reducer: {
        chatList: chatListReducer,
        chatRoom: chatRoomReducer,
        loading: loadingReducer,
        userLogout: LogoutReducer,
        display: DisplayReducer,
        socket: SocketReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;