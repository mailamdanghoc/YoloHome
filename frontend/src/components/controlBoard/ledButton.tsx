import { ReactNode, useEffect, useRef, useState } from "react";
import { BsBrightnessHigh, BsBrightnessHighFill } from "react-icons/bs";
import axios, { AxiosPromise, AxiosResponse } from "axios";
import useFetchReValidate from "../../customizes/useFetchData";
import useSWR from "swr";

const ledOnUrl = "http://localhost:3001/api/v1/led/turnon";
const ledOffUrl = "http://localhost:3001/api/v1/led/turnoff";
const ledNewest = "http://localhost:3001/api/v1/led/newest"



const LedButton = (): ReactNode => {
    const [isLightOn, setLightStatus] = useState<boolean>(false);
    const buttonRef = useRef(null);

    const fetcher = async (url: string): AxiosPromise<any> => {
        return await axios.get(url).then((res: AxiosResponse) => {
            console.log("call GET from " + url);
            return res.data;
        })
    } 
    
    const {data, error, isLoading} = useSWR(ledNewest, fetcher, {refreshInterval: 1000});
    if(isLoading) console.log(data);

    /** Handle Led's changing events:
     *  If Led's state is "On", send a POST request to ledOffURL, then set its state to "Off"
     *  If Led's state is "Off", send a POST request to ledOnURL, then set its state to "On"
     */
    const handleLightOnChange = async (): Promise<void> => {
    /*
        await axios.post(isLightOn ? ledOffUrl : ledOnUrl)
                .then((res: AxiosResponse) => setLightStatus(!isLightOn));
        return;
    */
    };



    return (
        <div className="h-full w-full p-6 rounded-xl bg-white">
            <div className="h-1/4 w-full flex">
                <BsBrightnessHigh size={35} className={`${isLightOn ? "w-0" : "sm:w-fit w-0"} text-gray-300`} />
                <BsBrightnessHighFill size={35} className={`${isLightOn ? "sm:w-fit w-0" : "w-0"} text-yellow-300`} />
                <span className="sm:px-5 text-2xl font-bold text-gray-500">Light</span>
            </div>
            <div className="h-3/4 w-full flex items-center justify-center">
                <label className="h-1/2 w-full inline-flex items-center justify-center md:justify-start cursor-pointer">
                    <input type="checkbox" value="" className={`sr-only peer `} onClick={() => { handleLightOnChange() }}  ref={buttonRef}/>
                    <div className="relative w-full h-full md:w-3/4 lg:w-3/5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[95%] after:w-[49%] after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </div>
        </div>
    );
}

export default LedButton;