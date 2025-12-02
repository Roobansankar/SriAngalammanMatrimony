// ChatPage.jsx - Real-time chat with Socket.io
import { ArrowLeft, MessageCircle, Send, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function ChatPage() {
  const { partnerId } = useParams(); // The person we're chatting with
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [canChat, setCanChat] = useState(true);
  const [chatCheckDone, setChatCheckDone] = useState(false);
  const [chatInterest, setChatInterest] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get logged user info - memoize to prevent re-creation
  const user = (() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  
  const myMatriId = user?.MatriID || user?.matid || "";

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversations list - only call once on mount
  const fetchConversations = useCallback(async () => {
    if (!myMatriId || conversationsLoaded) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/conversations?matriid=${encodeURIComponent(myMatriId)}`
      );
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
        setConversationsLoaded(true);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, [myMatriId, conversationsLoaded]);

  // Refresh conversations (for socket updates)
  const refreshConversations = useCallback(async () => {
    if (!myMatriId) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/conversations?matriid=${encodeURIComponent(myMatriId)}`
      );
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error("Failed to refresh conversations:", err);
    }
  }, [myMatriId]);

  // Fetch messages between logged user and partner
  const fetchMessages = useCallback(async () => {
    if (!myMatriId || !partnerId) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/messages?matriid=${encodeURIComponent(myMatriId)}&partner=${encodeURIComponent(partnerId)}`
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [myMatriId, partnerId]);

  // Fetch partner profile info
  const fetchPartnerProfile = useCallback(async () => {
    if (!partnerId) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/partner-profile?matriid=${encodeURIComponent(partnerId)}`
      );
      const data = await res.json();
      if (data.success) {
        setPartnerProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to fetch partner profile:", err);
    }
  }, [partnerId]);

  const checkCanChat = useCallback(async () => {
    if (!myMatriId || !partnerId) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/can-chat?matriid=${encodeURIComponent(myMatriId)}&partner=${encodeURIComponent(partnerId)}`
      );
      const data = await res.json();
      setCanChat(data.canChat === true);
      setChatInterest(data.chatInterest || null);
      setChatCheckDone(true);
    } catch (err) {
      console.error("Failed to check chat eligibility:", err);
      setCanChat(false);
      setChatInterest(null);
      setChatCheckDone(true);
    }
  }, [myMatriId, partnerId]);

  // Send chat request
  const sendChatRequest = async () => {
    if (!myMatriId || !partnerId || sendingRequest) return;
    
    setSendingRequest(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromMatriID: myMatriId,
          toMatriID: partnerId,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setChatInterest(data.chatInterest);
        alert(data.message || "Chat request sent!");
      }
    } catch (err) {
      console.error("Failed to send chat request:", err);
      alert("Failed to send chat request. Please try again.");
    } finally {
      setSendingRequest(false);
    }
  };

  // Respond to chat request (accept/reject)
  const respondToChatRequest = async (status) => {
    if (!chatInterest?.id) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/chat/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: chatInterest.id,
          status,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setChatInterest(data.chatInterest);
        // Dispatch event to update Header badge
        window.dispatchEvent(new CustomEvent("incoming_interest_update"));
        if (status === 'accepted') {
          setCanChat(true);
          fetchMessages();
        }
      }
    } catch (err) {
      console.error("Failed to respond to chat request:", err);
      alert("Failed to respond. Please try again.");
    }
  };

  // Send message
  const handleSend = async (e) => {
    e?.preventDefault();
    const text = newMessage.trim();
    if (!text || !myMatriId || !partnerId || sending) return;

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_matriid: myMatriId,
          to_matriid: partnerId,
          message: text,
        }),
      });
      
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Listen for incoming socket messages
  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const handleIncomingMessage = (payload) => {
      const msg = payload?.message;
      if (!msg) return;

      // Check if this message is for the current conversation
      const isRelevant =
        (msg.from_matriid === partnerId && msg.to_matriid === myMatriId) ||
        (msg.from_matriid === myMatriId && msg.to_matriid === partnerId);

      if (isRelevant) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setTimeout(scrollToBottom, 100);
      }

      // Refresh conversations list for badge updates
      refreshConversations();
    };

    // Handle chat request received (someone wants to chat with me)
    const handleChatRequestReceived = (payload) => {
      if (payload?.from_matriid === partnerId) {
        setChatInterest(payload.chatInterest);
      }
      // Could show a notification here
    };

    // Handle chat request response (my request was accepted/rejected)
    const handleChatRequestResponse = (payload) => {
      if (payload?.from_matriid === partnerId) {
        setChatInterest(payload.chatInterest);
        if (payload.status === 'accepted') {
          setCanChat(true);
          fetchMessages();
        }
      }
    };

    if (socket) {
      socket.on("chat_message", handleIncomingMessage);
      socket.on("chat_request_received", handleChatRequestReceived);
      socket.on("chat_request_response", handleChatRequestResponse);
    }

    return () => {
      if (socket) {
        socket.off("chat_message", handleIncomingMessage);
        socket.off("chat_request_received", handleChatRequestReceived);
        socket.off("chat_request_response", handleChatRequestResponse);
      }
    };
  }, [partnerId, myMatriId, refreshConversations, fetchMessages]);

  // Initial data fetch - run once on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (myMatriId && !conversationsLoaded) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch messages and partner profile when partnerId changes
  useEffect(() => {
    if (partnerId) {
      checkCanChat();
      fetchMessages();
      fetchPartnerProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when partner changes
  useEffect(() => {
    if (partnerId) {
      inputRef.current?.focus();
    }
  }, [partnerId]);

  // Format timestamp
  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" }) + 
           " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const fallbackImg = "https://sriangalammanmatrimony.com/photoprocess.php?image=images/nophoto.jpg&square=200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 pt-20 font-display">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex" style={{ height: "calc(100vh - 140px)" }}>
          
          {/* Sidebar - Conversations List */}
          <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-rose-500" />
                Messages
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start a chat from search results!</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <Link
                    key={conv.partner}
                    to={`/chat/${conv.partner}`}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-100 border-b border-gray-100 transition ${
                      partnerId === conv.partner ? "bg-rose-50 border-l-4 border-l-rose-500" : ""
                    }`}
                  >
                    <img
                      src={conv.profile?.PhotoURL || fallbackImg}
                      alt={conv.profile?.Name || conv.partner}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImg;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 truncate">
                          {conv.profile?.Name || conv.partner}
                        </span>
                        {conv.unread_count > 0 && (
                          <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.last_message || "No messages"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {!partnerId ? (
              /* No conversation selected */
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition md:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  {partnerProfile ? (
                    <>
                      <img
                        src={partnerProfile.PhotoURL || fallbackImg}
                        alt={partnerProfile.Name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackImg;
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {partnerProfile.Name || "Unknown"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {partnerProfile.City || partnerProfile.workinglocation || partnerProfile.Occupation || partnerId}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Loading...</h3>
                        <p className="text-xs text-gray-500">{partnerId}</p>
                      </div>
                    </>
                  )}

                  <Link
                    to={`/profile/view/${partnerId}`}
                    className="ml-auto text-sm text-rose-600 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                    </div>
                  ) : !canChat && chatCheckDone ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md">
                        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-8 h-8 text-amber-500" />
                        </div>
                        
                        {/* No chat interest exists yet */}
                        {!chatInterest && (
                          <>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Send Chat Request</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              To start chatting, you need to send a chat request first.
                              Once they accept, you can start messaging.
                            </p>
                            <button
                              onClick={sendChatRequest}
                              disabled={sendingRequest}
                              className="inline-block px-6 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition disabled:opacity-50"
                            >
                              {sendingRequest ? "Sending..." : "Send Chat Request"}
                            </button>
                          </>
                        )}
                        
                        {/* Chat request pending - I sent it */}
                        {chatInterest?.status === 'pending' && chatInterest.from_matriid === myMatriId && (
                          <>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chat Request Pending</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Your chat request has been sent. Waiting for {partnerProfile?.Name || partnerId} to accept.
                            </p>
                            <div className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm">
                              ⏳ Waiting for response...
                            </div>
                          </>
                        )}
                        
                        {/* Chat request pending - They sent it to me */}
                        {chatInterest?.status === 'pending' && chatInterest.to_matriid === myMatriId && (
                          <>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chat Request Received</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              {partnerProfile?.Name || partnerId} wants to chat with you!
                            </p>
                            <div className="flex gap-3 justify-center">
                              <button
                                onClick={() => respondToChatRequest('accepted')}
                                className="px-6 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => respondToChatRequest('rejected')}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-400 transition"
                              >
                                Decline
                              </button>
                            </div>
                          </>
                        )}
                        
                        {/* Chat request rejected */}
                        {chatInterest?.status === 'rejected' && (
                          <>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chat Request Declined</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              The chat request was declined.
                            </p>
                            <Link
                              to={`/profile/view/${partnerId}`}
                              className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition"
                            >
                              View Profile
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No messages yet. Say hello!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.from_matriid === myMatriId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              isMe
                                ? "bg-rose-500 text-white rounded-br-md"
                                : "bg-white text-gray-800 rounded-bl-md shadow"
                            }`}
                          >
                            <p className="break-words">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMe ? "text-rose-100" : "text-gray-400"
                              }`}
                            >
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {canChat ? (
                  <form
                    onSubmit={handleSend}
                    className="p-4 border-t border-gray-200 bg-white flex gap-3"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 border-t border-gray-200 bg-gray-100 text-center text-gray-500 text-sm">
                    Chat is disabled until interest is accepted
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
