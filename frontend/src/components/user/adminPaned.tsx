import { ReactElement, useState, useCallback } from "react";
import { FaPlus, FaPowerOff, FaTrashAlt } from "react-icons/fa";
import SignUpPopup from "./signUpPopup";
import { KeyedMutator } from "swr";
import { TriggerWithArgs } from "swr/mutation";

interface adminProps {
    data: any,
    mutate: KeyedMutator<any>,
    createTrigger: TriggerWithArgs<void, any, any, any>,
    updateTrigger: TriggerWithArgs<void, any, any, any>,
    deleteTrigger: TriggerWithArgs<void, any, any, any>
}

const AdminPanel = (props : adminProps): ReactElement => {
    const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

    const {data, mutate, createTrigger, updateTrigger, deleteTrigger} = props;

    const handlePopupOpen = useCallback(() => {
        setPopupOpen(!isPopupOpen);
    }, [isPopupOpen])

    const handleUpdateButton = useCallback(async (id: string, status: string) => {
        const expectedData = (data as Array<{
            id: string
            username: string,
            fullname: string,
            type: string,
            status: string}>).map(d => d.id === id ? {...d, status: status} : d);
        await updateTrigger({status: status, id: id});
        mutate(expectedData, {
            optimisticData: expectedData,
            rollbackOnError: true
        });
    }, [data]);

    const handleDeleteButton = useCallback(async (id: string) => {
        const expectedData = (data as Array<{
            id: string
            username: string,
            fullname: string,
            type: string,
            status: string}>).filter(d => d.id != id);
        await deleteTrigger({id: id});
        mutate(expectedData, {
            optimisticData: expectedData,
            rollbackOnError: true
        });
    }, [data])

    
    return (
        <div className="w-full h-1/2 mt-5 px-3 py-3">
            {isPopupOpen ? <SignUpPopup handlePopupOpen={handlePopupOpen}  trigger={createTrigger}/> : null};
            <div className="w-full flex justify-between items-center p-x-3 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500">
                <span className="mx-6 text-xl text-white font-bold">Manage Account</span>
                <button className="flex items-center mx-2 px-2 py-2 rounded-lg bg-green-500 text-white focus:inline-green-500"
                onClick={() => {handlePopupOpen()}}>
                    <span className="mr-2 font-bold">Add Account</span>
                    <FaPlus size={20}/>
                </button>
            </div>
            <div> 
                <table className="w-full h-full">
                    <thead>
                        <tr className="text-left h-10 bg-gray-300">
                            <th className="pl-1 sm:pl-6 text-lg font-semibold text-gray-500">User Name</th>
                            <th className="pl-1 sm:pl-6 text-lg font-semibold text-gray-500">Full Name</th>
                            <th className="pl-1 sm:pl-6 text-lg font-semibold text-gray-500">Status</th>
                            <th className="pl-1 sm:pl-6 text-lg font-semibold text-gray-500">Action</th>
                        </tr>
                    </thead> 
                    <tbody className="overflow-auto">
                    {
                        data ?
                        (data as Array<{
                            id: string
                            username: string,
                            fullname: string,
                            type: string,
                            status: string
                        }>).map((user, index): ReactElement | null => {
                            return user.type != "ADMIN" ? 
                            <tr className="text-left bg-white border border-gray-300 border-t-0" key={index}>
                                <td className="pl-1 sm:pl-6 truncate">{user.username}</td>
                                <td className="pl-1 sm:pl-6 truncate">{user.fullname}</td>
                                <td className={`pl-1 sm:pl-6 ${user.status === "ACTIVE" ? "text-green-500" : "text-gray-500"} font-semibold`}>
                                    {user.status === "ACTIVE" ? "Active" : "Inactive"}
                                </td>
                                <td className="flex flex-col sm:flex-row"> 
                                    <button className={`ml-1 sm:ml-6 mr-2 my-2 p-2 rounded-md ${user.status === "ACTIVE" ? "bg-green-500 text-gray-500 focus:outline-green-500" : "bg-gray-500 text-white focus:outline-gray-500"}`}
                                    onClick={() => {handleUpdateButton(user.id, user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}}
                                    >
                                        <FaPowerOff size={20}/>
                                    </button>
                                    <button className={`ml-1 sm:ml-0 mr-2 my-2 p-2 rounded-md bg-red-500 focus:outline-red-500 text-white`}
                                    onClick={() => {handleDeleteButton(user.id)}}>
                                        <FaTrashAlt size={20}/>
                                    </button>
                                </td>
                            </tr>
                            : null;
                        })
                        : null
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminPanel;