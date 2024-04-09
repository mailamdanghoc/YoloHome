import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

// Server's routes
const activateLink: string = "";
const deactivateLink: string = "";
const deleteLink: string = "";

const useAdmin = () => {
    // declare fetcher

    // call swr
    const  activateTrigger = useSWRMutation(activateLink, async (url: string, {arg}: {arg: string}) => {
        await axios.post(url, {
            
        }).then(
            //mutate here
        )
    }).trigger;
}

export {useAdmin};