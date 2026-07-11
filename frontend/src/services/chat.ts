import { api } from "./api";

export const sendMessage = async (message:string) => {
    const {data}=await api.post("/chat",{
        message
    });

    return data;
};