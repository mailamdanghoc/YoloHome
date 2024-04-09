import { useState, useEffect, useLayoutEffect } from "react";

/** Custom hook to detect size change of a reference (ex: a div tag)
 *  * How it works: Gets the reference, then binds a resize listener, which will then updates the state when resizing is detected
 *  * Params: targetRef: React.RefObject 
 *  * Return: a State: {width: number, height: number}
 * 
 *  Pretty useful for Responsiveness
 *  Credits to the internet 
 */

const useDimensions = (targetRef: React.RefObject<HTMLDivElement>) => {
    const getDimensions = (): {width: number, height: number} => {
        return {
            width: targetRef.current ? targetRef.current.offsetWidth : 0,
            height: targetRef.current ? targetRef.current.offsetHeight : 0
        };
    };

    const [dimensions, setDimensions] = useState<{width: number, height: number}>(getDimensions);

    const handleResize = (): void => {
        setDimensions(getDimensions());
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useLayoutEffect(() => {
        handleResize();
    }, []);

    return dimensions;
}

export default useDimensions;