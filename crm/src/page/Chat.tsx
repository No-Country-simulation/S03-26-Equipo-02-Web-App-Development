import MessageTray from "@/components/MessageTray";
import ChatWindow from "@/components/ChatWindow";


const Chat = () => {

  return (
    <div className="flex h-full">
      <MessageTray />

      <div className="w-239  bg-gray-50 border-r">
        <ChatWindow />
      </div>

      <div className="w-[320px] bg-gray-50">
        <h1>hola</h1>
      </div>
    </div>
  );
};

export default Chat;
