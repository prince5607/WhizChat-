import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from "socket.io-client";

const BACKEND_URL = import.meta.env.MODE ==="development"?"http://localhost:5001" : "/";

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers : [],
    socket : null,
    
  
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
  
        set({ authUser: res.data });
        get().connectSocket();

      } catch (error) {
        console.log("Error in checkAuth:", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },
  
    signup: async (data) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("Account created successfully");
        
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isSigningUp: false });
      }
    },

    login: async(data) =>{
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged In successfully");
            get().connectSocket();                    //as soon as we log in , socket connection will  be establish
        } catch (error) {
            toast.error(error.response.data.message);

        }finally{
            set({isLoggingIn:false});
        }
    },

    logout: async() =>{
        try {
            await axiosInstance.get("/auth/logout");
            set({authUser :null});
            toast.success("Logged Out Successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
        
    },

    updateProfile: async(data) =>{
      set({isUpdatingProfile : true});
      try {
        const res = await axiosInstance.put("/auth/update-profile",data);
        set({authUser : res.data});
        toast.success("Profile is Updated");
      } catch (error) {
        toast.error(error.response.data.message);
      }finally{
        set({isUpdatingProfile:false});
      }
    },

    connectSocket: ()=>{
      const { authUser} = get();
      if(!authUser || get().socket?.connected) return;
      const socket = io(BACKEND_URL,{
        query:{
          userId : authUser.id,
        }
      });
      socket.connect();
      set({socket : socket});

      socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers : userIds});
      });
    },

    disconnectSocket: ()=>{
      if(get().socket?.connected) get().socket.disconnect();
    }


}));


