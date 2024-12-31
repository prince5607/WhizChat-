import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X} from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ()=>{

    const[text ,setText] = useState("");
    const[previewImg , setPreviewImg] = useState(null);
    
    const fileInputRef  = useRef(null);

    const{sendMessage} = useChatStore();

    const handleImgChange = (e) => {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(file);
    };

    const removeImg = ()=>{
      setPreviewImg(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }


    const handleSendMessage = async(e)=>{
        e.preventDefault();
        if(!text.trim() && !previewImg) return;

        try {
            await sendMessage({
                text : text.trim(),
                image : previewImg
            });

            //clear form
            setText("");
            setPreviewImg(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error("Failed to send message :",error);
        }
    };



    return(
        <div className="p-4 w-full">
        {previewImg && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={previewImg}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImg}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
  
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImgChange}
            />
  
            <button
              type="button"
              className={`hidden sm:flex btn btn-circle
                       ${previewImg ? "text-emerald-500" : "text-zinc-400"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={!text.trim() && !previewImg}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
      );
}

export default MessageInput;