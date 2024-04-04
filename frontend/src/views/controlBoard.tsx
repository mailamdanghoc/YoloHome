import { ReactNode, useState } from "react";
import { BsBrightnessHigh, BsBrightnessHighFill } from "react-icons/bs";
import { PiFan, PiFanFill } from "react-icons/pi";
import ControlBoardChart from "../components/controlBoardChart";

const ControlBoard = (props: any): ReactNode => {
    const [isLightOn, setLightStatus] = useState<boolean>(false);
    const [fanLevel, setFanLevel] = useState<number>(0);

    const handleLightOnChange = (): void => {
        setLightStatus(!isLightOn)
    }

    const handleFanOnChange = (event: React.FormEvent): void => {
        //target = 0:   fan's off
        //target != 0:  fan's on
        setFanLevel(Number((event.target as HTMLInputElement).value));
    }



    return (
        <div className=" h-full w-full p-3 border-l overscroll-auto border-gray-300" >
            <div className="h-full md:h-2/3 w-full flex flex-col md:flex-row">
                <div className="h-1/2 w-full md:h-full md:w-1/2 p-3">
                    <ControlBoardChart />
                </div>
                <div className="h-1/2 w-full md:h-full md:w-1/2 p-3">
                    <ControlBoardChart/>
                </div>
            </div>
            <div className="h-1/2 md:h-1/3 w-full flex">
                <div className="h-full w-1/3 md:w-1/2 p-3">
                    <div className="h-full w-full p-6 rounded-xl bg-white">
                        <div className="h-1/4 w-full flex">
                            <BsBrightnessHigh size={35} className={`${isLightOn ? "w-0" : "sm:w-fit w-0"} text-gray-300`} />
                            <BsBrightnessHighFill size={35} className={`${isLightOn ? "sm:w-fit w-0" : "w-0"} text-yellow-300`} />
                            <span className="sm:px-5 text-2xl font-bold text-gray-500">Light</span>
                        </div>
                        <div className="h-3/4 w-full flex items-center justify-center">
                            <label className="h-1/2 w-full inline-flex items-center justify-center md:justify-start cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" onClick={() => { handleLightOnChange() }} />
                                <div className="relative w-full h-full md:w-3/4 lg:w-3/5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[95%] after:w-[49%] after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="h-full w-2/3 md:w-1/2 p-3">
                    <div className="h-full w-full p-6 rounded-xl bg-white">
                        <div className="h-1/4 w-full flex ites">
                            <PiFan size={35} className={`${fanLevel != 0 ? "w-0" : "sm:w-fit w-0"} text-gray-300`} />
                            <PiFanFill size={35} className={`${fanLevel != 0 ? "sm:w-fit w-0" : "w-0"} text-blue-500`} />
                            <span className="sm:px-5 text-2xl font-bold text-gray-500">Fan</span>
                        </div>
                        <div className="h-3/4 sm:h-1/2 w-full flex items-center justify-center lg:justify-start">
                            <input type="range" min="0" max="3"
                                className="appearance-none bg-transparent h-1/2 w-full
                            [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-gray-700 
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[100%] [&::-webkit-slider-thumb]:w-1/4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-500"
                                onInput={(event: React.FormEvent) => { handleFanOnChange(event) }}
                            />
                        </div>
                        <div className="h-1/4 w-full hidden items-center sm:flex">
                            <span className={`w-1/4 text-center font-semibold text-xl ${fanLevel == 0 ? "text-cyan-400" : "text-gray-500"}`}>Off</span>
                            <span className={`w-1/4 text-center font-semibold text-xl ${fanLevel == 1 ? "text-cyan-400" : "text-gray-500"}`}>Low</span>
                            <span className={`w-1/4 text-center font-semibold text-xl ${fanLevel == 2 ? "text-cyan-400" : "text-gray-500"}`}>Medium</span>
                            <span className={`w-1/4 text-center font-semibold text-xl ${fanLevel == 3 ? "text-cyan-400" : "text-gray-500"}`}>High</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ControlBoard;