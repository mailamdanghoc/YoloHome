import { ReactNode } from 'react';
import TempIcon from './icons/tempIcon';
import HumidIcon from './icons/humidIcon';
import LightIcon from './icons/lightIcon';

interface EnvCardProps {
    name: string;
    color: string;
    className: string;
    icon: string;
}

const EnvCard = ({ name, color, className, icon} : EnvCardProps): ReactNode => {
    const IconComponents : { [key: string]: any } = {
        temp: TempIcon,
        humid: HumidIcon,
        light: LightIcon,
    }
    const Icon = IconComponents[icon];

    return (
        <div className="bg-white w-2/5 rounded-2xl p-4 mt-4" >
            <div className="text-xl font-semibold">{name}</div>
            <div className="mt-2 flex items-center justify-around">
                <Icon color={color} className={className}/>
                <div className="bg-slate-400 w-14 h-14 rounded-full flex items-center justify-center">
                    <span>22C</span>
                </div>
            </div>
        </div>
    )
}

export default EnvCard;