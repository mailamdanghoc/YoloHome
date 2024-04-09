import { useState, useEffect } from "react";

/** Custom hook to check if app is being used on mobile or on pc
 *  * How it works: By binding a listener to window's innerWidth, it'll trigger a setState when width changes, which lead to change in returning result
 *  * Return: a State: boolean (true if is mobile)
 * 
 *  Credits to the internet
 */

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

