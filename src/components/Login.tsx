import {Button, Card, CardBody, CardHeader, Input, Typography} from '@material-tailwind/react'
import React from 'react'
import DifficultyTabs from './DifficultyTabs'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    return (
        <div className="login-bg w-screen h-screen bg-gray-50 dark:bg-gray-800 flex justify-center items-center">

            <div className="bg-white rounded-md w-[70%] h-[80%] flex flex-row overflow-hidden">
                {/*left side*/}
                <div className="bg-red-300 w-full p-5 flex justify-center items-center">
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action="#" method="POST" className="space-y-6">
                            <h1 className="text-center text-2xl font-bold">Rýchla hra</h1>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-900">
                                    Prezývka
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="nickname"
                                        name="nickname"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <DifficultyTabs/>

                            <div>
                                <button
                                    onClick={() => navigate('/game')}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Spustiť
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

                {/*right side*/}
                <div className="bg-blue-300 w-full">

                </div>

            </div>

        </div>
    )
}

export default Login
