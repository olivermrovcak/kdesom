import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";


interface Props {
    closeDialog: () => void,
    showDialog?: boolean,
}

export default function GameResultDialog({showDialog, closeDialog}: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(showDialog ?? false);

    function handleClose(event: object, reason: string) {
        if (reason && reason === "backdropClick" && "escapeKeyDown") {
            return;
        }
        closeDialog();
        setIsOpen(false);
    }

    useEffect(() => {
        setIsOpen(showDialog ?? false);
    }, [showDialog]);

    return (
        <Dialog open={isOpen} onClose={handleClose} size="md" fullWidth maxWidth={false} disableEscapeKeyDown
                className="Dialog-Container bg-white bg-opacity-20 backdrop-blur-xl p-1">
            <DialogHeader className="bg-blue-400  rounded-t-md w-full pb-0">
                <h1 className="text-center text-2xl font-bold text-black">KONIEC</h1>
            </DialogHeader>
            <DialogBody className="bg-blue-400">

            </DialogBody>
            <DialogFooter className="bg-blue-400 rounded-b-md flex justify-center">
                <Button className="w-52" >GG</Button>
            </DialogFooter>
        </Dialog>
    );
}
