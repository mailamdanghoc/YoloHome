import { ReactNode } from 'react';
import EnvCard from './evironmentCard';

const Environment = (props: any): ReactNode => {
    return (
        <div className=" h-full w-full p-8" >
            <span className='text-2xl font-bold'>Environment infomation:</span>
            <div className="mt-4 flex justify-around flex-wrap">
                <EnvCard name="Tempurature" color="#00b3a7" className="w-14" icon="temp"/>
                <EnvCard name="Humidity" color="#00b3a7" className="w-14" icon="humid"/>
                <EnvCard name="Light" color="#00b3a7" className="w-14" icon="light"/>
            </div>
        </div>
    )
}

export default Environment;