import {createSlice} from "@reduxjs/toolkit"


export interface roomState {
  users: string[];
}


const initialState: roomState = {
    users: []
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        userJoined: (state, action) => {
            state.users.push(action.payload.emailId);
        }
    }
})

export const {userJoined} = roomSlice.actions;
export default roomSlice.reducer;