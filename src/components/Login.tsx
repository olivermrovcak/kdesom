import {Button, Card, CardBody, CardHeader, Input, Typography} from '@material-tailwind/react'
import React, { useEffect } from 'react'
import DifficultyTabs from './DifficultyTabs'
import {useNavigate} from 'react-router-dom'
import {Checkbox} from '@mui/material'
import logo from '../images/guess-logo.png';
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import {app} from '../firebase/firebaseConfig'

function Login() {

    const apps  = app;

    const navigate = useNavigate()

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(apps);

        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                navigate('/game')
                // ...
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential)
            // ...
        });
    }

    useEffect(() => {
        const element = document.querySelector('.topo-bg');
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener("mousemove", (event) => {
            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;

            targetX = (clientX / innerWidth) * 50; // Horizontal movement range
            targetY = (clientY / innerHeight) * 50; // Vertical movement range
        });

        function smoothMove() {
            currentX += (targetX - currentX) * 0.01; // Smooth horizontal movement
            currentY += (targetY - currentY) * 0.001; // Smooth vertical movement

            element.style.backgroundPosition = `${currentX}% ${currentY}%`;
            requestAnimationFrame(smoothMove);
        }

        smoothMove();
    }, []);

    return (
        <section className=" App topo-bg flex justify-center items-center w-screen h-screen relative">
            <div className=" rounded-md bg-white border border-gray-200 shadow-2xl grid grid-rows-1 lg:grid-cols-2 max-w-[95%] md:max-w-[60%] lg:max-w-[86%] xl:max-w-[860px]  ">
                <div className="hidden lg:block flex flex-col justify-start items-center p-3 ">
                    <div className="w-full h-full border rounded-md flex flex-col items-start p-2 ">
                        <p className="font-black text-blue-500 text-[100px] leading-[8rem]">KDE</p>
                        <p className="font-black text-blue-500 text-[100px] leading-[6rem] pl-7">SOM?</p>

                        <p className="font-bold text-sm text-center pt-10 mb-auto">
                            KdeSom je interaktívna hra, ktorá testuje vaše geografické znalosti.
                            Cieľom je určiť polohu na mape na základe Google Street View obrázkov.
                        </p>

                        <p className=" font-normal text-[10px] text-center text-gray-500 ">
                            Vážený hráč,

                            Naša hra využíva službu Google Street View, ktorá je spoplatnená.
                            Náklady za používanie však hradíme my.
                            Pre zaistenie spravodlivého a bezpečného hrania vás
                            žiadame o prihlásenie pred začiatkom hry. Ďakujeme a užite si hru!
                        </p>
                    </div>
                </div>
                <Card className="p-5 flex-col items-center" color="transparent" shadow={false}>
                    <Typography variant="h4" color="blue-gray" className="text-center">
                        Prihlásiť sa
                    </Typography>
                    <div className="w-full flex justify-center mt-3">
                      <LockClosedIcon className="w-8 text-blue-700"/>
                    </div>

                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Email
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Heslo
                            </Typography>
                            <Input
                                type="password"
                                size="lg"
                                placeholder="********"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                        </div>

                        <Button className="mt-6" fullWidth color="blue">
                            Prihlásiť sa
                        </Button>
                        <div className="py-4 flex flex-row justify-center items-center">
                            <div className="h-[1px] w-full border border-gray-300 "></div>
                            <p className="bg-white px-3">alebo</p>
                            <div className="h-[1px] w-full border border-gray-300"></div>
                        </div>

                        <Button
                            variant="outlined"
                            color="blue-gray"
                            className="flex items-center justify-center gap-3 w-full"
                            onClick={googleSignIn}
                        >
                            <img src="https://docs.material-tailwind.com/icons/google.svg" alt="metamask"
                                 className="h-4 w-4"/>
                            Google login
                        </Button>
                        <Typography color="gray" className="mt-4 text-center font-normal">
                            Ešte nemáš účet? {" "}
                            <a href="#" className="font-medium text-gray-900">
                                Zaregistrovať sa
                            </a>
                        </Typography>
                    </form>
                    <div className="lg:hidden  w-full ">
                        <div className="h-[1px] w-full border border-gray-300 mb-2 "></div>
                        <p className="font-normal text-[10px] text-center text-gray-500 ">
                            Vážený hráč,

                            Naša hra využíva službu Google Street View, ktorá je spoplatnená.
                            Náklady za používanie však hradíme my.
                            Pre zaistenie spravodlivého a bezpečného hrania vás
                            žiadame o prihlásenie pred začiatkom hry. Ďakujeme a užite si hru!
                        </p>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default Login
