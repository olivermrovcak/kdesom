import { SparklesIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'

interface Props {
    getClue: () => string;
}

function AiButton({ getClue }: Props) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [clue, setClue] = useState('');

    async function handleClue() {
        setIsSpinning(true);
        let fetchedClue = await getClue();
        fetchedClue = fetchedClue.replace(/(\r\n|\n|\r)/gm, "");
        setClue('');
        for (let i = 0; i < fetchedClue.length; i++) {
            setClue((prev) => prev + fetchedClue[i]);
            await new Promise(resolve => setTimeout(resolve, 100)); 
        }
        setIsSpinning(false);
    }


    return (
        <div className="!z-[999] absolute right-10 bottom-14 cursor-pointer sm:bottom-5 sm:right-5 rounded-lg">
            <div onClick={handleClue} className={` ${isSpinning ? 'spin-active card' : 'card-border'} flex-col`}>
                <div className="flex flex-row justify-start ">
                    <SparklesIcon className="w-5 h-15 text-white mr-2"/>
                    <h1 className="font-bold text-white">{clue !== "" ? clue : "NÁPOVEDA ? "}</h1>
                </div>
                <div>
                    <p className="text-[8px] text-gray-300 mt-1">USING GEMINI FLASH 1.5</p>
                </div>
            </div>
        </div>
    );
}

export default AiButton;
