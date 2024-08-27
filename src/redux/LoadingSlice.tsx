import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoadingState } from '../type'
import { reset } from './LogoutSlice'

const initialState: LoadingState = {
    isLoading: false,
}


const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state: LoadingState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(reset, () => initialState);
    },
})


export const { setLoading } = loadingSlice.actions
export default loadingSlice.reducer