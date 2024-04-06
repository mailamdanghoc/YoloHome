import { ReactElement, useEffect, useState } from "react";

const text = "Yolo Home"
const color = "bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400"

interface logoProps {
    size?: number
}

const Logo = (props: logoProps): ReactElement => {
    const [textSize, setTextSize] = useState<string>("");
    const {size} = props;
    
    useEffect(() => {
        if(!size || size === 0) setTextSize("text-xl");
        else {
            switch (size) {
                case 1:
                    setTextSize("text-2xl");
                    break;
                case 2:
                    setTextSize("text-4xl");
                    break;
                case 3:
                    setTextSize("text-6xl");
                    break;
                case 4:
                    setTextSize("text-8xl");
                    break;
                case 5:
                    setTextSize("text-9xl");
                    break;
                default:
                    setTextSize("text-xl");
                    break;
            }
        }
    }, [])

    return (
        <div className={`inline-block 
        text-transparent bg-clip-text ${color}
        ${textSize} font-bold
        `}>
            {text}
        </div>
    )
}

export default Logo;