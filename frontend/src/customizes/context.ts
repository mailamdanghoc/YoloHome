import { createContext } from "react";

const titleContext = createContext("Home");
const userContext = createContext<{userId: string, token: string}>({userId: "", token: ""});

export {titleContext, userContext};