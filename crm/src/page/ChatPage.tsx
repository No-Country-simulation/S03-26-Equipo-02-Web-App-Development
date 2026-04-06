import MessageTray from "@/components/chat/MessageTray";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatActions from "@/components/chat/ChatActions";


const ChatPage = () => {

  return (
    <div className="flex h-full">
      <MessageTray />

      <div className="w-239  bg-gray-50 border-r">
        <ChatWindow />
      </div>

      <div className="w-[320px] bg-gray-50">
          <ChatActions/>
      </div>
    </div>
  );
};

export default ChatPage;
