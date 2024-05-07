import { useState, useCallback, ReactElement, ChangeEvent, useContext } from "react";
import { MdModeEdit, MdOutlinePhone, MdOutlineEmail,  } from "react-icons/md";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import formError from "../../utils/formError";
import { useNavigate } from "react-router-dom";
import { TriggerWithArgs } from "swr/mutation";


interface userProps {
    data: any,
    editTrigger: TriggerWithArgs<void, any, any, any>,
    passwordTrigger: TriggerWithArgs<void, any, any, any>,
    pError: any
}

const UserPanel = (props: userProps): ReactElement => {
    const [action, setAction] = useState<string>("infoShow");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [editError, setEditError] = useState<formError>((new formError())
                                                            .addError("email", ["Invalid email format"])
                                                            .addError("phone", ["Invalid phone number format"])
                                                        );
    const [passwordError, setPasswordError] = useState<formError>((new formError())
                                                            .addError("matchPassword", ["Password does not match the confirmation password", "match", "New password is required"]) //match is not error
                                                            .addError("currentPassword", ["Current password does not match", "match"])
                                                        );
    const navigate = useNavigate();                                                    

    const {data, editTrigger, passwordTrigger, pError} = props;

    const resetState = useCallback((): void => {
        setName("");
        setEmail("");
        setPhone("");
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
        setEditError(editError.clear());
        setPasswordError(passwordError.clear())
    }, [])

    // three buttons, the "cancel" one's only used for closing, other two are used for opening and closing
    const handleEditButton = useCallback((): void => {
        resetState();
        if(action == "infoEdit") {
            setAction("infoShow");
        } 
        else {
            setAction("infoEdit");
        }
    }, [action])

    const handlePasswordButton = useCallback((): void => {
        resetState();
        if(action == "passwordEdit") {
            setAction("infoShow");
        }
        else {
            setAction("passwordEdit");
        }
    }, [action])

    const handleCancelButton = useCallback((): void => {
        resetState();
        setAction("infoShow");
    }, [])

    // change data for submitting
    const handleNameOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setName(value);
    }, [])

    const handleEmailOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setEmail(value);
         // simple regex for email 
        if (value == "") setEditError(editError.setErrorStatus("email", 0));
        else setEditError(editError.setErrorStatus("email", value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? 0 : 1));
        
    }, [editError])

    const handlePhoneOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setPhone(value);
        // validate phone number
        if (value == "") setEditError(editError.setErrorStatus("phone", 0));
        else setEditError(editError.setErrorStatus("phone", isNaN(Number(value)) ? 1 : 0));
    }, [editError])

    const handleOldPasswordOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setOldPassword(value);
    }, [])

    const handlePasswordOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setPassword(value);
        if (confirmPassword.length != 0) setPasswordError(passwordError.setError("matchPassword", value === confirmPassword ? "match" : "Password does not match the confirmation password"));
        else {
            if (value == "") setPasswordError(passwordError.setErrorStatus("matchPassword", 0));
        }
    }, [passwordError, confirmPassword])

    const handleConfirmPasswordOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setConfirmPassword(value);
        if (value == "") setPasswordError(passwordError.setErrorStatus("matchPassword", password.length == 0 ? 0 : 1));
        else setPasswordError(passwordError.setError("matchPassword", password === value ? "match" : "Password does not match the confirmation password"));
    }, [passwordError, password])

    const handleEditOnSubmit = useCallback(() => {
        const data = {
            fullname: name == "" ? undefined : name,
            email: email == "" ? undefined : email,
            phone: phone == "" ? undefined : phone
        };
        //validate if error => abort, else send data => server
        if (editError.currentExist()) return;
        else {
            editTrigger(data);
            resetState();
            setAction("infoShow");
        } 
    }, [name, email, phone, editError])

    const handlePasswordOnSubmit = useCallback(() => {
        setPasswordError(passwordError.setErrorStatus("currentPassword", 0));
        if (password.length == 0) {
            setPasswordError(passwordError.setErrorStatus("matchPassword", 3));
            return;
        }
        if (passwordError.currentExist()) return;
        const data = {
            oldPassword: oldPassword,
            newPassword: password
        };
        passwordTrigger(data);
        if(pError) {
            setPasswordError(passwordError.setErrorStatus("currentPassword", 1));
            return;
        }
        else {
            resetState();
            setAction("infoShow");
        }   
    }, [oldPassword, password, passwordError])

    const handleLogOut = useCallback(() => {
        localStorage.setItem("token", "");
        localStorage.setItem("userId", "");
        navigate("/signin");
    }, [])

    return (
        <div className="h-fit w-full px-3 py-6 ">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="h-40 w-40 md:h-52 md:w-52 lg:h-60 lg:w-60 flex justify-center items-center rounded-full my-2 bg-white border border-gray-100">
                        <FaUserAlt className="object-fill text-gray-500" size={100}></FaUserAlt>
                    </div>
                </div>
                <div className="w-full md:w-2/3 flex flex-col mt-3 md:mt-0 md:ml-3 items-end shadow-md rounded-lg">
                    <div className="h-fit w-full flex justify-between p-x-3 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500">
                        <div className="mx-6 text-xl font-bold text-white">
                            { action == "passwordEdit" ? "Change Password" : (action == "infoEdit" ? "Edit Profile" : "Personal Profile")}
                        </div>
                        <div className="flex justify-end">
                            <div className="h-8 w-8 rounded-lg flex justify-center items-center bg-sky-300"
                            onClick={() => {handleEditButton()}} >
                                <MdModeEdit size={25} className={`${action == "infoEdit" ? "text-gray-800" : "text-white hover:text-gray-800"} cursor-pointer`}/>
                            </div>
                            <div className="h-8 w-8 rounded-lg flex justify-center items-center mx-2 bg-sky-300"
                            onClick={() => {handlePasswordButton()}} >
                                <FaLock size={25} className={`${action == "passwordEdit" ? "text-gray-800" : "text-white hover:text-gray-800"} cursor-pointer`}/>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`h-full w-full p-3 bg-white ${action == "infoShow" ? "block" : "hidden"}`}>
                        <div className="w-full flex my-3">
                            <FaUserAlt className="ml-3 text-gray-500" size={25}/>
                            <div className="w-20 ml-6 text-lg font-semibold text-gray-500">Name:</div>
                            <div className= "flex-1 text-lg truncate">{data ? data.fullname : ""}</div>
                        </div>
                        <div className="w-full flex my-3">
                            <MdOutlineEmail className="ml-3 text-gray-500" size={25}/>
                            <div className="w-20 ml-6 text-lg font-semibold text-gray-500">Email:</div>
                            <div className="flex-1 text-lg truncate">{data ? data.email : ""}</div>
                        </div>
                        <div className="w-full flex my-3">
                            <MdOutlinePhone className="ml-3 text-gray-500" size={25}/>
                            <div className="w-20 ml-6 text-lg font-semibold text-gray-500">Contact:</div>
                            <div className="flex-1 text-lg truncate">{data ? data.phone : ""}</div>
                        </div>
                        <div className= "flex justify-start my-3">
                            <button className="h-fit w-fit p-2 ml-3 rounded-lg bg-gray-300 text-lg font-semibold text-gray-500 focus:outline-gray-500"
                            onClick={() => {handleLogOut()}}>
                                Log out
                            </button>
                        </div>
                    </div> 
                    <div className={`h-fit w-full p-3 bg-white ${action == "infoEdit" ? "block" : "hidden"}`}>
                        <div className="w-full my-3 px-6">
                            <div className="w-full flex text-lg font-semibold text-gray-500">
                                <FaUserAlt size={25}/>
                                <span className="ml-3">Name:</span>
                            </div>
                            <input type="text"
                            className="w-full lg:w-2/3 px-3 rounded-md bg-white text-lg border border-gray-300 focus:outline-gray-500" placeholder={data ? data.fullname : ""}
                            value={name} onChange={(e: ChangeEvent) => {handleNameOnChange(e)}}
                            />
                        </div>
                        <div className="w-full my-3 px-6">
                            <div className="w-full flex text-lg font-semibold text-gray-500">
                                <MdOutlineEmail size={25}/>
                                <span className="ml-3">Email:</span>
                            </div>
                            <input type="text"
                            className={`w-full lg:w-2/3 px-3 rounded-md bg-white text-lg border ${editError.isExist("email") ? "border-red-500 focus:outline-red-500" : "border-gray-300 focus:outline-gray-500"} `} 
                            placeholder={data ? data.email : ""}
                            value={email} onChange={(e: ChangeEvent) => {handleEmailOnChange(e)}}
                            />
                        </div>
                        <div className="w-full my-3 px-6">
                            <div className="w-full flex text-lg font-semibold text-gray-500">
                                <MdOutlinePhone size={25}/>
                                <span className="ml-3">Phone:</span>
                            </div>
                            <input type="text"
                            className={`w-full lg:w-2/3 px-3 rounded-md bg-white text-lg border ${editError.isExist("phone") ? "border-red-500 focus:outline-red-500" : "border-gray-300 focus:outline-gray-500"}`}
                            placeholder={data ? data.phone : ""}
                            value={phone} onChange={(e: ChangeEvent) => {handlePhoneOnChange(e)}}
                            />
                        </div>
                        <div className={`flex px-6 my-2 ${editError.currentExist() ? "text-red-500" : "text-transparent"}`}>
                            <IoClose size={25}/>
                            <span>{editError.toString(editError.currentExist() ? editError.currentExist()! : "")}</span>
                        </div>
                        <div className= "flex justify-start">
                            <button className="h-fit w-fit p-2 ml-6 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-300 text-lg font-semibold text-white focus:outline-sky-500"
                            onClick={() => {handleEditOnSubmit()}}>
                                Confirm
                            </button>
                            <button className="h-fit w-fit p-2 ml-2 rounded-lg bg-gray-300 text-lg font-semibold text-gray-500 focus:outline-gray-500"
                            onClick={() => {handleCancelButton()}} >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className={`h-fit w-full p-3 bg-white ${action == "passwordEdit" ? "block" : "hidden"}`}>
                        <div className="w-full my-3 px-6">
                            <div className="w-full flex text-lg font-semibold text-gray-500">
                                <span>Old Password:</span>
                            </div>
                            <input type="password"
                            className={`w-full lg:w-1/2 px-3 rounded-md bg-white text-lg border 
                            ${passwordError.isExist("currentPassword") && passwordError.toString("currentPassword") != "match" ? "border-red-500 focus:outline-red-500" : "border-gray-300 focus:outline-gray-500"}`}
                            value={oldPassword} onChange={(e: ChangeEvent) => {handleOldPasswordOnChange(e)}}
                            />
                        </div>
                        <div className="w-full my-3 px-6">
                            <div className="w-full flex text-lg font-semibold text-gray-500">
                                <span>New Password:</span>
                            </div>
                            <input type="password"
                            className="w-full lg:w-1/2 px-3 rounded-md bg-white text-lg border border-gray-300 focus:outline-gray-500"
                            value={password} onChange={(e: ChangeEvent) => {handlePasswordOnChange(e)}}
                            />
                        </div>
                        <div className="w-full my-3 px-6">
                            <div className="w-full flex text-lg font-semibold text-gray-500">
                                <span>Confirm Password:</span>
                            </div>
                            <input type="password"
                            className={`w-full lg:w-1/2 px-3 rounded-md bg-white text-lg border 
                            ${passwordError.isExist("matchPassword") ? (passwordError.toString("matchPassword") === "match" ? "border-green-500 focus:outline-green-500" : "border-red-500 focus:outline-red-500") : "border-gray-300 focus:outline-gray-500"}`}
                            value={confirmPassword} onChange={(e: ChangeEvent) => {handleConfirmPasswordOnChange(e)}}
                            />
                        </div>
                        <div className={`flex px-6 my-2 ${passwordError.currentExist() ? "text-red-500" : "text-transparent"}`}>
                            <IoClose size={25}/>
                            <span>{passwordError.toString(passwordError.currentExist() ? passwordError.currentExist()! : "")}</span>
                        </div>
                        <div className= "flex justify-start">
                            <button className="h-fit w-fit p-2 ml-6 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-300 text-lg font-semibold text-white focus:outline-sky-500"
                            onClick={() => {handlePasswordOnSubmit()}} >
                                Confirm
                            </button>
                            <button className="h-fit w-fit p-2 ml-2 rounded-lg bg-gray-300 text-lg font-semibold text-gray-500 focus:outline-gray-500"
                            onClick={() => {handleCancelButton()}} >
                                Cancel
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPanel;