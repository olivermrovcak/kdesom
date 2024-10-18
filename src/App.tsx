import React from 'react'
import Header from './components/layout/Header'

function App() {
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

                <section className="dash-bg h-full w-full border border-red-500 rounded-xl ml-5">

                </section>
            </main>
        </section>
    )
}

export default App
