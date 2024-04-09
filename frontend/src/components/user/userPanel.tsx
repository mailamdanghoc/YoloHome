import { ReactNode, useState, useEffect } from "react";

const UserPanel = (): ReactNode => {
    const [isEditing, setEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>("John Doe");
    const [email, setEmail] = useState<string>("john.doe@email.com");
    const [password, setPassword] = useState<string>("");
    const [isSettingNewPassword, setSettinngNewPassword] =  useState<boolean>(false);




    const handleFormOpen = (): void => {
        setEditing(true);
    }

    const handleFormClose = (): void => {
        setEditing(false);
    }

    const handleChangePassword = (event: React.FormEvent): void => {
        const newPassword = (event.target as HTMLInputElement).value;
        setPassword(newPassword);
        setSettinngNewPassword(true);
    }
  
    return (
        <div className="h-fit w-full px-3 py-6 ">
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col justify-center items-center">
                    <div className="h-40 w-40 rounded-full my-2 bg-black"></div>
                    <div className="h-10 w-20 rounded-lg border bg-sky-200 flex justify-center items-center hover:border-2 hover:border-gray-300">change</div>
                </div>
                <div className="w-full flex flex-col items-end">
                    <div className="h-8 w-8 rounded-lg float-right bg-sky-300"
                    onClick={() => {handleFormOpen()}} >
                        o
                    </div>
                    <div className={`h-fit w-full p-3 bg-white ${isEditing ? "hidden" : "block"}`}>
                        <div className="w-full flex my-3">
                            <div className="w-1/5 lg:w-[13%] ml-8 bg-sky-600 text-lg">Name:</div>
                            <div className="w-1/2 pl-3 md:ml-0 text-lg">John Doe</div>
                        </div>
                        <div className="w-full flex my-3">
                            <div className="w-1/5 lg:w-[13%] ml-8 bg-sky-600 text-lg">Email:</div>
                            <div className="w-1/2 pl-3 md:ml-0 text-lg">John.Doe@gmail.com</div>
                        </div>
                        <div className="w-full flex my-3">
                            <div className="w-1/5 lg:w-[13%] ml-8 bg-sky-600 text-lg">Password:</div>
                            <div className="w-1/2 pl-3 md:ml-0 text-lg">*******</div>
                        </div>
                    </div> 
                    <div className={`h-fit w-full p-3 bg-white ${isEditing ? "block" : "hidden"}`}>
                        <div className="w-full my-3">
                            <div className="w-1/2 ml-8 text-lg">Name:</div>
                            <input type="text"
                            className="w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border border-gray-300" placeholder={name}/>
                        </div>
                        <div className="w-full my-3">
                            <div className="w-1/2 ml-8 text-lg">Email:</div>
                            <input type="text"
                            className="w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border border-gray-300" placeholder={email}/>
                        </div>
                        <div className="w-full my-3">
                            <div className="w-1/2 ml-8 text-lg">Password:</div>
                            <input type="password"
                            className="w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border border-gray-300"
                            onChange={(event) => {handleChangePassword(event)}} />
                        </div>
                        <div className={`w-full my-3 ${isSettingNewPassword ? "block" : "hidden"}`}>
                            <div className="w-1/2 ml-8 text-lg">Confirm Password:</div>
                            <input type="password"
                            className="w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border border-gray-300" />
                        </div>   
                        <div className= "float-end flex">
                            <div className="h-fit w-fit p-2 mr-2 rounded-lg bg-blue-500">Submit</div>
                            <div className="h-fit w-fit p-2 mr-2 rounded-lg bg-gray-500"
                            onClick={() => {handleFormClose()}} >
                            Cancel
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPanel;