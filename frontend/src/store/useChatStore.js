import{create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
    messages: [],

    users: [],

    selectedUser : null,    //to get the chat with selected user on right side

    isUsersLoading: false,  //to get all logged in users list on left side

    isMessagesLoading : false,

    getUsers : async()=>{
        set({isUsersLoading : true});
        try {
            const res  = await axiosInstance.get("/message/users");
            set({users :res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading : false});
        }
    },

    getAllMessages : async(userId)=>{
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages : res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading : false});
        }
    },

    sendMessage : async(MessageInputData)=>{
        const{selectedUser , messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,MessageInputData);
            console.log(MessageInputData);
            set({messages : [...messages , res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    setSelectedUser : (selectedUser)=> set({selectedUser}),

    subscribeToMessages : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

       

        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = selectedUser._id === newMessage.senderId;
            if(!isMessageSentFromSelectedUser) return;
            set({messages : [...get().messages, newMessage]});
        });
    },

    unsubscribeToMessages : ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }

}));