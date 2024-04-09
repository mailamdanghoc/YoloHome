import { ReactNode, useEffect, useState } from 'react';
import EnvCard from '../components/evironmentCard';
import BarChart from '../components/BarChart';
import useSocket from '../customizes/useSocket';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import LineChart from '../components/LineChart';

const data1 = [
    { "name": "1/3/2003", "value": 10 },
    { "name": "2/3/3", "value": 12 },
    { "name": "03/03", "value": 15 },
    { "name": "4/3/3", "value": 19 },
    { "name": "5/3/3", "value": 24 },
    { "name": "6/3/3", "value": 13 },
    { "name": "7/3/3", "value": 8 },
]

const Environment = (props: any): ReactNode => {
    const [light, setLight] = useState(0);
    const [humid, setHumid] = useState(0);
    const socket = useSocket;
    const [graphData, setGraphData] = useState(data1);
    const handleSetTitle = useOutletContext<(title: string) => void>();

    useEffect(() => {
        socket.on("light", (data: string) => {
            setLight(Number(data));
        });

        socket.on("humidity", (data: string) => {
            setHumid(Number(data));
        });

        // const intervalId = setInterval(() => {
        //     axios.get('/')
        //         .then(response => {
        //             // Update your state here
        //             setGraphData(prevData => [...prevData, { name: new Date().toLocaleDateString(), value: response.data }]);
        //         })
        //         .catch(error => {
        //             console.error('There was an error!', error);
        //         });
        // }, 60000);
    }, [socket]);
      
    useEffect(() => {
        handleSetTitle("Environment")
    },[]);

    return (
        <div className=" h-full w-full p-8" >
            <span className='text-2xl font-bold'>Live tempurature chart</span>
            <div className="w-900 h-80 mt-4">
                {/* <BarChart width={900} height={300} barColor="fill-sky-500" textStyle="text-sm font-semibold text-indigo-800"
                margin={{top: 30, bottom: 30, right: 20, left: 20}} data={data1}  
                /> */}
                <LineChart data={data1} />
            </div>
            <span className='text-2xl font-bold'>Current environment information</span>
            <div className="mt-4 flex justify-around flex-wrap">
                <EnvCard curVal={light} limit={100} name="Light" color="#00b3a7" className="w-14" icon="light"/>
                <EnvCard curVal={humid} limit={100} name="Humidity" color="#00b3a7" className="w-14" icon="humid"/>
            </div>
        </div>
    )
}

export default Environment;