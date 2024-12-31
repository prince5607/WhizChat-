import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE ==="development" ?'http://localhost:5001/api': "/api",
    withCredentials :true,    //it will allow to send cookie with each request we send
});