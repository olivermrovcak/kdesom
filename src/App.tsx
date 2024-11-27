import React from 'react'
import Header from './components/layout/Header'
import {increment} from './redux/slices/AppState'
import {useAppDispatch, useAppSelector } from './hooks/hooks'
import { Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

function App() {
    const isGameActive = useAppSelector((state) => state.gameState.gameActive)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    function add() {
        dispatch(increment())
    }

    function startGame() {
        console.log('Game started')
        if (isGameActive) {
            console.log('Game already active')
        }
        navigate('/game')


    }

    return (
        <section className="w-screen h-screen flex flex-col">
            <Header/>
            <main className="main flex flex-row w-full h-full p-5">
                <nav className="card-glass w-[15%] h-full rounded-2xl border border-red-500 p-5">
                    <ul>
                        <li className="p-3 rounded-md hover:bg-white transition-all cursor-pointer">Home</li>
                        <li>About</li>
                        <li>Contact</li>
                    </ul>
                </nav>

                <section className=" card-glass dash-bg h-full w-full  p-5 rounded-xl ml-5 shadow-2xl">
                    <section className="my-auto">
                        s
                    </section>

                    <div className="flex flex-row justify-center items-center">

                    </div>
                </section>
            </main>
        </section>
    )
}

export default App
