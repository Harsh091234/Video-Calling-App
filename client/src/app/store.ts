import { baseApi } from "@/services/api/baseApi"
import { configureStore } from "@reduxjs/toolkit"
import roomReducer from "../features/room/roomSlice"
import { peerApi } from "@/services/api/peerApi"
// ...

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [peerApi.reducerPath]: peerApi.reducer,
    room: roomReducer  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(peerApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
