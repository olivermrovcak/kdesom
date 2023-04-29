import React from 'react'
// @ts-ignore
import planet from './images/planet.png';
import {useNavigate} from "react-router-dom";
export default function Menu() {
    const navigate = useNavigate();
    function handleStart() {
        navigate('/game')
    }

    return (
        <div className="bg-[#ECECEC] w-screen h-screen p-[100px] landing-page">

            <header className="flex flex-row justify-start items-center space-x-2">
                <img className="object-contain w-[70px] h-[70px]" src={planet} alt="logo-s"/>
                <h1 className="text-[30px]" >KDESOM.SK</h1>
            </header>

            <main className="grid grid-cols-2 ">
                <div className="flex flex-col justify-around">
                    <h1 className="text-[187px]">KDE SOM ?</h1>
                    <p className="text-[30px] max-w-[600px] -translate-y-[40px]">
                        Vitaj v našej geografickej hre o Slovensku! Táto hra
                        ti umožní objavovať a preskúmavať rôzne miesta
                        a zaujímavosti po celom Slovensku.

                    </p>
                    <button className="bg-[#77CC79] w-[260px] hover:-translate-y-2 transition-all ease-in-out duration-300 h-[70px] rounded-full shadow-custom">
                       <h1 onClick={ () => handleStart()} className="text-[34px] text-white ">ŠTART</h1>
                    </button>
                </div>

                <div className="flex flex-col justify-start">
                    <img className="object-contain w-[666px] h-[666px]" src={planet} alt="logo-s"/>
                </div>

            </main>








        </div>
    )
}
