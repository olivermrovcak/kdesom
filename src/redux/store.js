import { configureStore } from '@reduxjs/toolkit'
import appStateReducer from './slices/AppState'
import gameStateReducer from './slices/GameState'
export default configureStore({
    reducer: {
        appState: appStateReducer,
        gameState: gameStateReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch