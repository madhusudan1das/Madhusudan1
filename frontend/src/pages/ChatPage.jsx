import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[calc(100vh-8rem)]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE: Show on mobile if NO user selected, or always on desktop */}
        <div className={`w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col border-r border-slate-700/50 
          ${selectedUser ? "hidden md:flex" : "flex"}`}>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE: Show on mobile if user selected, or always on desktop */}
        <div className={`flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm 
          ${!selectedUser ? "hidden md:flex" : "flex"}`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
