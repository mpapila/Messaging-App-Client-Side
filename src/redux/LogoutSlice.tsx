import { createSlice } from "@reduxjs/toolkit";

interface userLogoutState {
}

const initialState: userLogoutState = {
}

const userLogoutSlice = createSlice({
    name: 'logout',
    initialState,
    reducers: {
        reset: () => initialState,
    },
})


export const { reset } = userLogoutSlice.actions
export default userLogoutSlice.reducer