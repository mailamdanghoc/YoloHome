import { ReactElement } from "react";

const text = "Yolo Home"
const color = "bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400"

const Logo = (): ReactElement => {
    return (
        <div className={`inline-block 
        text-transparent bg-clip-text ${color}
        text-2xl font-bold
        `}>
            {text}
        </div>
    )
}

export default Logo;