import {
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Card,
    Typography,
} from "@material-tailwind/react";

import svkImage from '../images/slovakia.png';
import worldImage from '../images/worldwide.png';
import { GamemodeEnum } from "../utils/GamemodeEnum";

interface Props {
    changeGamemode: (gamemode: GamemodeEnum) => void
}

export default function MenuList({changeGamemode}:Props) {

    function handleChangeGamemode(gamemode: GamemodeEnum) {
        changeGamemode(gamemode);
    }

    return (
        <Card className="w-full bg-transparent shadow-none">
            <List>
                <ListItem onClick={()=> handleChangeGamemode(GamemodeEnum.SVK_EASY)} className="shadow-lg">
                    <ListItemPrefix>
                        <img src={svkImage} alt="Slovakia" className="w-10 h-10" />
                    </ListItemPrefix>
                    <div>
                        <Typography variant="small" color="gray" className="font-normal">
                          Slovensko
                        </Typography>
                    </div>
                </ListItem>
                <ListItem onClick={()=> handleChangeGamemode(GamemodeEnum.WORLD)} className="shadow-lg">
                    <ListItemPrefix>
                        <img src={worldImage} alt="Slovakia" className="w-10 h-10" />
                    </ListItemPrefix>
                    <div>
                        <Typography variant="small" color="gray" className="font-normal">
                           Svet
                        </Typography>
                    </div>
                </ListItem>
            </List>
        </Card>
    );
}