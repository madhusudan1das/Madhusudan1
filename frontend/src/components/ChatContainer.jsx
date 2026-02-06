import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Trash2, CheckSquare, X } from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // SELECTION MODE STATES
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);

  useEffect(() => {
    // clear selection when changing user
    setIsSelectionMode(false);
    setSelectedMessageIds([]);
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  const toggleMessageSelection = (messageId) => {
    if (selectedMessageIds.includes(messageId)) {
      setSelectedMessageIds(prev => prev.filter(id => id !== messageId));
    } else {
      setSelectedMessageIds(prev => [...prev, messageId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (confirm("Are you sure you want to delete selected messages?")) {
      await deleteMessages(selectedMessageIds);
      setIsSelectionMode(false);
      setSelectedMessageIds([]);
    }
  };

  const handleSelectAll = () => {
    const myMessageIds = messages
      .filter(msg => msg.senderId === authUser._id)
      .map(msg => msg._id);

    if (selectedMessageIds.length === myMessageIds.length && myMessageIds.length > 0) {
      setSelectedMessageIds([]);
    } else {
      setSelectedMessageIds(myMessageIds);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />

      {/* Selection Mode Header overlay */}
      {isSelectionMode && (
        <div className="bg-base-200 px-6 py-2 flex items-center justify-between border-b border-base-300">
          <span className="text-sm font-medium">{selectedMessageIds.length} Selected</span>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleSelectAll}
            >
              <CheckSquare size={18} /> Select All
            </button>
            <button
              className="btn btn-ghost btn-sm text-error"
              onClick={handleDeleteSelected}
              disabled={selectedMessageIds.length === 0}
            >
              <Trash2 size={18} /> Delete
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedMessageIds([]);
              }}
            >
              <X size={18} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 px-2 md:px-6 overflow-y-auto overflow-x-hidden py-4 md:py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                <div
                  className={`chat-bubble relative flex flex-col group ${msg.senderId === authUser._id
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                    } ${isSelectionMode && "cursor-pointer hover:opacity-80"} ${selectedMessageIds.includes(msg._id) ? "ring-2 ring-error" : ""
                    }`}
                  onClick={() => {
                    if (isSelectionMode && msg.senderId === authUser._id) {
                      toggleMessageSelection(msg._id);
                    }
                  }}
                >
                  {/* Select Checkbox (only in selection mode and if sender is me) */}
                  {isSelectionMode && msg.senderId === authUser._id && (
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-error"
                        checked={selectedMessageIds.includes(msg._id)}
                        readOnly
                      />
                    </div>
                  )}

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {msg.text && <p className="break-words">{msg.text}</p>}

                  {/* Actions (only if NOT in selection mode and sender is me) */}
                  {!isSelectionMode && msg.senderId === authUser._id && (
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      {/* Delete Single */}
                      <button
                        className="btn btn-circle btn-xs btn-ghost text-error"
                        title="Delete"
                        onClick={() => {
                          if (confirm("Delete this message?")) {
                            deleteMessages([msg._id]);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                      {/* Enter Selection Mode */}
                      <button
                        className="btn btn-circle btn-xs btn-ghost text-info"
                        title="Select Multiple"
                        onClick={() => {
                          setIsSelectionMode(true);
                          setSelectedMessageIds([msg._id]);
                        }}
                      >
                        <CheckSquare size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
