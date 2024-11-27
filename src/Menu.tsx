import React from 'react'
// @ts-ignore
import planet from './images/planet.png';
import {useNavigate} from "react-router-dom";
export default function Menu() {
    const navigate = useNavigate();
    function handleStart() {
        navigate('/dashboard')
    }

    return (
        <div className="bg-[#ECECEC] w-screen h-screen sm:p-[100px] p-[20px] landing-page">

            <header className="flex flex-row justify-start items-center space-x-2">
                <img className="object-contain  w-[70px] h-[70px]" src={planet} alt="logo-s"/>
                <h1 className="  text-[30px]" >KDESOM.SK</h1>
            </header>

            <main className="grid sm:grid-cols-2   grid-cols-1">
                <div className="flex flex-col space-y-5 sm:space-y-0 items-center sm:items-start justify-around">
                    <h1 className=" text-[90px]  sm:text-[187px]">KDE SOM ?</h1>
                    <p className="sm:text-[30px] text-[20px] max-w-[600px] text-center sm:-translate-y-[40px]">
                        Vitaj v našej geografickej hre o Slovensku! Táto hra
                        ti umožní objavovať a preskúmavať rôzne miesta
                        a zaujímavosti po celom Slovensku.

                    </p>

                    <div className="flex flex-col justify-start block sm:hidden">
                        <img className="object-contain w-[666px] " src={planet} alt="logo-s"/>
                    </div>

                    <button className="bg-[#77CC79] w-[260px] hover:-translate-y-2 transition-all ease-in-out duration-300 h-[70px] rounded-full shadow-custom">
                       <h1 onClick={ () => handleStart()} className="text-[34px] text-white ">ŠTART</h1>
                    </button>
                </div>

                <div className="flex flex-col justify-start hidden sm:block">
                    <img className="object-contain w-[666px] h-[666px]" src={planet} alt="logo-s"/>
                </div>

            </main>








        </div>
    )
}
