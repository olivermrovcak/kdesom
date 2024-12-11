import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Progress,
} from "@material-tailwind/react";
import {calculateCenter} from "../utils/utils";
import {GamemodeEnum} from "../utils/GamemodeEnum";
import guessLogo from '../images/guess-logo.png';


interface Props {
    closeDialog: () => void,
    showDialog?: boolean,
}

let map: google.maps.Map;

export default function LeaderBoardDialog({
                                          showDialog,
                                          closeDialog,

                                      }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(showDialog ?? false);

    function handleClose(event: object, reason: string) {
        if (reason && reason === "backdropClick" && "escapeKeyDown") {
            return;
        }
        closeDialog();
        setIsOpen(false);
    }


    return (
        <Dialog open={isOpen} onClose={handleClose} size={"xxl"} disableEscapeKeyDown
                className="bg-white bg-opacity-20 backdrop-blur-xl !w-screen !h-screen m-0 p-0 !absolute !left-0 !overflow-hidden">
            <DialogBody className="relative w-full h-full !overflow-hidden flex justify-center items-end">
               <div className="w-10">
gg
               </div>
            </DialogBody>
        </Dialog>
    );
}
