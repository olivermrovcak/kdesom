import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface GameState {
    playerPoints: number,
    gameActive: boolean,
}

const initialState: GameState = {
    playerPoints: 0,
    gameActive: false,
}

export const gameState = createSlice({
    name: 'gameState',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setGameActive: (state, action: PayloadAction<boolean>) => {
            state.gameActive = action.payload
        },
        setPlayerPoints: (state, action: PayloadAction<number>) => {
            state.playerPoints = action.payload
        }

    },
})

export const { setPlayerPoints,setGameActive } = gameState.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value

export default gameState.reducer