import { useState, useCallback, useRef, ReactElement } from "react";
import { MdModeEdit } from "react-icons/md";

const UserPanel = (): ReactElement<any, any> => {
    const [isEditing, setEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>("John Doe");
    const [email, setEmail] = useState<string>("john.doe@email.com");
    const [password, setPassword] = useState<string>("");
    const [isPasswordMatch, setPasswordMatch] = useState<boolean | null>(null);
    const [isSettingNewPassword, setSettinngNewPassword] =  useState<boolean>(false);

    const nameRef = useRef<HTMLInputElement>(null),
            emailRef = useRef<HTMLInputElement>(null),
            passRef = useRef<HTMLInputElement>(null),
            confirmPassRef = useRef<HTMLInputElement>(null);

    console.log(">>> call rerender");

    const handleFormOpen = useCallback((): void => {
        setEditing(true);
    },[])

    const handleFormClose = useCallback((): void => {
        setEditing(false);
        setPasswordMatch(null);
        setSettinngNewPassword(false);
        setName("");
        setEmail("");
        setPassword("");
        if(nameRef.current) nameRef.current.value = "";
        if(emailRef.current) emailRef.current.value = "";
        if(passRef.current) passRef.current.value = "";
        if(confirmPassRef.current) confirmPassRef.current.value = "";
    },[])

    const handleChangePassword = useCallback((event: React.FormEvent): void => {
        const newPassword = (event.target as HTMLInputElement).value;
        setPassword(newPassword);
        setPasswordMatch(null);
        setSettinngNewPassword(true);
    }, [])

    const handleConfirmPassword = useCallback((event: React.FormEvent): void => {
        const newConfirmPassword = (event.target as HTMLInputElement).value;
        if (newConfirmPassword == password) setPasswordMatch(true);
        else setPasswordMatch(false);
    }, [password])
  
    return (
        <div className="h-fit w-full px-3 py-6 ">
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col justify-center items-center">
                    <div className="h-40 w-40 rounded-full my-2 bg-black"></div>
                    <div className="h-10 w-20 rounded-lg border bg-sky-200 flex justify-center items-center hover:border-2 hover:border-gray-300">change</div>
                </div>
                <div className="w-full flex flex-col items-end">
                    <div className="h-8 w-8 rounded-lg flex justify-center items-center float-right bg-sky-300"
                    onClick={() => {handleFormOpen()}} >
                        <MdModeEdit size={20} className={`${isEditing ? "text-blue-500" : "text-white hover:text-blue-500 cursor-pointer"}`}/>
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
                            className="w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border border-gray-300" placeholder={name}
                            ref={nameRef}
                            />
                        </div>
                        <div className="w-full my-3">
                            <div className="w-1/2 ml-8 text-lg">Email:</div>
                            <input type="text"
                            className="w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border border-gray-300" placeholder={email}
                            ref={emailRef}
                            />
                        </div>
                        <div className="w-full my-3">
                            <div className="w-1/2 ml-8 text-lg">Password:</div>
                            <input type="password"
                            className="w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border border-gray-300"
                            onChange={(event) => {handleChangePassword(event)}} ref={passRef}/>
                        </div>
                        <div className={`w-full my-3 ${isSettingNewPassword ? "block" : "hidden"}`}>
                            <div className="w-1/2 ml-8 text-lg">Confirm Password:</div>
                            <input type="password"
                            className={`w-4/5 pl-3 ml-8 md:w-1/2 lg:w-2/5 rounded-lg bg-white text-lg border focus:outline-none ${isPasswordMatch != null ? (isPasswordMatch ? "border-green-600" : "border-red-600" ): "border-gray-300"}`} 
                            onChange={(event) => {handleConfirmPassword(event)}} ref={confirmPassRef}/>
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