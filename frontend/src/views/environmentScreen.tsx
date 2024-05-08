import { ReactNode, useEffect, useState } from 'react';
import EnvCard from '../components/evironmentCard';
import useSocket from '../customizes/useSocket';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import LineChart from '../components/LineChart';
import EditIcon from '../components/icons/editIcon';
import ModalComponent from '../components/modal';

const data1 = [ 0 ];

const humidUrl = "http://localhost:3001/api/v1/devices/660ebbdbb55dfa6d3aa6ab9d"
const lightUrl = "http://localhost:3001/api/v1/devices/660ebc78b55dfa6d3aa6ab9f"
const tempUrl = "http://localhost:3001/api/v1/devices/660ebb49b55dfa6d3aa6ab9c"

const fetchThreshold = async (url : string) => {
    try {
        const res = await axios.get(url);
        return Number(res.data.threshold);
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

const curHumidLim = await fetchThreshold(humidUrl);
const curLightLim = await fetchThreshold(lightUrl);
const curTempLim = await fetchThreshold(tempUrl);

const Environment = (props: any): ReactNode => {
    const [light, setLight] = useState(0);
    const [humid, setHumid] = useState(0);
    const socket = useSocket;
    const [graphData, setGraphData] = useState(data1);
    const [humidLimit, setHumidLimit] = useState(curHumidLim);
    const [lightLimit, setLightLimit] = useState(curLightLim);
    const [tempLimit, setTempLimit] = useState(curTempLim);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const handleSetTitle = useOutletContext<(title: string) => void>();

    let temperature = 0;
    useEffect(() => {
        socket.on("light", (data: string) => {
            setLight(Number(data));
        });

        socket.on("humidity", (data: string) => {
            setHumid(Number(data));
        });

        socket.on("temperature", (data: string) => {
            temperature = Number(data);
        });

        const intervalId = setInterval(() => {
            setGraphData(prevData => {
                let tempData = [...prevData];
                if (tempData.length <= 7) {
                    tempData.push(temperature);
                }
                else {
                    tempData.shift();
                    tempData.push(temperature);
                }
                return tempData;
            });
        }, 5000);
    }, [socket]);
      
    useEffect(() => {
        handleSetTitle("Environment")
    },[]);

    const updateLimit = async (url : string, limit : number) => {
        try {
            const res = await axios.patch(url, {threshold: limit});
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const handleSubmit = () => {
        updateLimit(tempUrl, tempLimit);
        setTempLimit(tempLimit);
        closeModal();
    }

    return (
        <>
            <div className=" h-full w-full p-8" >
                <div className="flex items-center justify-between">
                    <span className='text-2xl font-bold'>Live tempurature chart</span>
                    <div className="flex items-center">
                        <span className='text-sm font-semibold'>Threshold: {tempLimit} C</span>
                        <EditIcon className="w-6 h-6 cursor-pointer" onClick={openModal}/>
                    </div>
                </div>
                <div className="w-900 h-80 mt-4">
                    <LineChart data={graphData} curLimit={tempLimit}/>
                </div>
                <span className='text-2xl font-bold'>Current environment information</span>
                <div className="mt-4 flex justify-around flex-wrap">
                    <EnvCard curVal={light} limit={lightLimit} setLimit={setLightLimit} name="Light" color="#00b3a7" className="w-14" icon="light"/>
                    <EnvCard curVal={humid} limit={humidLimit} setLimit={setHumidLimit} name="Humidity" color="#00b3a7" className="w-14" icon="humid"/>
                </div>
            </div>
            <ModalComponent isOpen={modalIsOpen} closeModal={closeModal} handleSubmit={handleSubmit} newLimit={tempLimit} setNewLimit={setTempLimit}/>
        </>
    )
}

export default Environment;