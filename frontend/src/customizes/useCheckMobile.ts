import { useState, useEffect } from "react";

const useCheckMobile = (): boolean => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const handleWindowSizeChange = (): void => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 768);
}

export default useCheckMobile;

