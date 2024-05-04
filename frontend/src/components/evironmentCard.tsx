import { ReactNode, useState } from 'react';
import axios from 'axios';
import TempIcon from './icons/tempIcon';
import HumidIcon from './icons/humidIcon';
import LightIcon from './icons/lightIcon';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import EditIcon from './icons/editIcon';
import Modal from 'react-modal'

const humidUrl = "http://localhost:3001/api/v1/devices/660ebbdbb55dfa6d3aa6ab9d"
const lightUrl = "http://localhost:3001/api/v1/devices/660ebc78b55dfa6d3aa6ab9f"

interface EnvCardProps {
    name: string;
    color: string;
    className: string;
    icon: string;
    curVal: number;
    limit: number;
    setLimit: (limit: number) => void;
}

const EnvCard = ({ name, color, className, icon, curVal, limit, setLimit} : EnvCardProps): ReactNode => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newLimit, setNewLimit] = useState(limit);
    const [isHumid, setIsHumid] = useState(false);

    const updateLimit = async (url : string, limit : number) => {
        try {
            const res = await axios.patch(url, {threshold: limit});
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = () => {
        if(isHumid) {
            updateLimit(humidUrl, newLimit);
        }
        else {
            updateLimit(lightUrl, newLimit);
        }
        setLimit(newLimit);
        closeModal();
    }

    const openModal = (type : string) => {
        if(type === "Humidity") {
            setIsHumid(true);
        }
        else {
            setIsHumid(false);
        }
        setModalIsOpen(true);
    }
    const closeModal = () => {
        setModalIsOpen(false);
    }

    const IconComponents : { [key: string]: any } = {
        temp: TempIcon,
        humid: HumidIcon,
        light: LightIcon,
    }
    const Icon = IconComponents[icon];
    const percentage = curVal / limit * 100;
    const unitStr = icon === "humid" ? "%" : " lux";

    return (
        <>
            <div className="bg-white w-2/5 rounded-2xl p-4 mt-4" >
                <div className="text-xl font-semibold">{name}</div>
                <div className="mt-2 flex items-center justify-around">
                    <Icon color={color} className={className}/>
                    <div className="w-14 h-14 flex items-center justify-center">
                        <CircularProgressbar strokeWidth={12} value={percentage} text={`${curVal}${unitStr}`} />
                    </div>
                </div>
                <div className="flex justify-end items-center mr-5">
                    <span className='text-sm'>Threshold: {limit}{unitStr}</span>
                    <EditIcon className="w-6 h-6 cursor-pointer" onClick={() => {openModal(name)}}/>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-5 py-8 w-1/3 border border-black border-solid rounded-lg" contentLabel="Edit Threshold">
                <div className="flex items-center justify-between">
                    <h2 className='text-lg font-bold'>Edit Threshold</h2>
                    <button className='text-sm' onClick={closeModal}>Close</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className='text-sm'>Threshold</label>
                        <input type="number" value={newLimit} onChange={(e) => setNewLimit(Number(e.target.value))} className='border border-gray-300 w-full p-2 rounded-lg mt-2'/>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-lg' type='submit' >Save</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default EnvCard;