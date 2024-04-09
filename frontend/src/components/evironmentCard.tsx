import { ReactNode } from 'react';
import TempIcon from './icons/tempIcon';
import HumidIcon from './icons/humidIcon';
import LightIcon from './icons/lightIcon';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface EnvCardProps {
    name: string;
    color: string;
    className: string;
    icon: string;
    curVal: number;
    limit: number;
}

const EnvCard = ({ name, color, className, icon, curVal, limit} : EnvCardProps): ReactNode => {
    const IconComponents : { [key: string]: any } = {
        temp: TempIcon,
        humid: HumidIcon,
        light: LightIcon,
    }
    const Icon = IconComponents[icon];
    const percentage = curVal / limit * 100;
    const unitStr = icon === "humid" ? "%" : " lux";

    return (
        <div className="bg-white w-2/5 rounded-2xl p-4 mt-4" >
            <div className="text-xl font-semibold">{name}</div>
            <div className="mt-2 flex items-center justify-around">
                <Icon color={color} className={className}/>
                <div className="w-14 h-14">
                    <CircularProgressbar strokeWidth={12} value={percentage} text={`${curVal}${unitStr}`} />
                </div>
            </div>
        </div>
    )
}

export default EnvCard;