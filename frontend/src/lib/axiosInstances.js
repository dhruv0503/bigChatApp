import axios from "axios";

const authInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER}/api`,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

const formInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER}/api`,
    headers: {
        "Content-Type": "multipart/form-data"
    },
    withCredentials : true
});

export {
    authInstance,
    formInstance
}