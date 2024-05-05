import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

// Server's routes
const adminURL: string = "http://localhost:3001/api/v1/accounts";

const useAdminFetch = (token: string) => {
    // declare fetcher
    const userFetcher = async (param: {
        url: string,
        token: string
    }) => {
        const res = await axios.get(param.url, {
            headers: {
                Authorization: "bearer " + param.token
            }
        })
        .then(res => {return res.data})
        .catch(error => {
            console.log(error);
        })
        return res;
    }

    const createUser = async (param: {
        url: string,
        token: string
    }, {arg} : {
        arg: {
            username: string,
            fullname?: string,
            email?: string,
            phone?: string
        }
    }) => {
        const res = await axios.post(param.url, arg, {
            headers: {
                Authorization: "bearer " + param.token
            }
        })
        .then(res => {
            console.log(">>> run res");
            mutate();
        })
        .catch(error => {
            console.log(error);
        })
    }

    const setUserStatus = async (param: {
        url: string,
        token: string
    }, {arg} : {arg: {
        status: string,
        id: string
    }}) => {
        const res = await axios.patch(param.url + `/${arg.id}/status`, {status: arg.status}, {
            headers: {
                Authorization: "bearer " + param.token
            }
        })
        .then(res => {
        })
        .catch(error => {
            console.log(error);
        })
    }

    const deleteUser = async (param: {
        url: string,
        token: string
    }, {arg} : {arg: {
        id: string
    }}) => {
        const res = await axios.delete(param.url + `/${arg.id}`, {
            headers: {
                Authorization: "bearer " + param.token 
            }
        })
        .then(res => {})
        .catch(error => {
            console.log(error);
        })
    }

    // call swr
    const {data, mutate, error, isLoading} = useSWR({url: adminURL, token: token}, userFetcher, {
        keepPreviousData: true
    });

    const {trigger: createTrigger} = useSWRMutation({url: adminURL, token: token}, createUser);

    const {trigger: updateTrigger} = useSWRMutation({url: adminURL, token: token}, setUserStatus);

    const {trigger: deleteTrigger} = useSWRMutation({url: adminURL, token: token}, deleteUser);

    return {data, mutate, createTrigger, updateTrigger, deleteTrigger, error, isLoading};
}

export {useAdminFetch};