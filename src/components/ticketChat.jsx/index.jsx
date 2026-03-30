import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../../services/socket';
import arrowImg from "../../assets/icons/arrow.png";
import { Paperclip, Send, ChevronDown } from 'lucide-react';
import { getAdminId, getTicket, getMessages, getLoggedInUser, updateTicketStatus, createMessages } from '../../services/chat/index.js';
import { openNotification } from "../../network/notification";

const ChatWindow = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [ticketData, setTicketData] = useState(null);
    const [typingUser, setTypingUser] = useState(null);
    const [connected, setConnected] = useState(socket.connected);
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messageKeysRef = useRef(new Set());
    const adminId = getAdminId();
    const currentUser = getLoggedInUser();
    const currentUserId = currentUser?.id;

    const messageKey = (m) => {
        const sender = m.senderId || m.sender?.id || "";
        const time = new Date(m.createdAt || m.createdAt || "").toISOString();
        return `${m.id || ""}||${sender}||${m.content || ""}||${time}`;
    };

    const addMessageIfNew = (messageToAdd) => {
        setChatHistory(prev => {
            const key = messageKey(messageToAdd);
            if (messageKeysRef.current.has(key)) return prev;
            messageKeysRef.current.add(key);
            return [...prev, messageToAdd];
        });
    };

    // Auto scroll on new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, typingUser]);

    useEffect(() => {
        if (!ticketId) return;

        // Connect socket with fresh token (only if not already connected)
        if (!socket.connected) {
            socket.connect();
        }

        // Fetch ticket details + message history via HTTP
        const loadInitialData = async () => {
            try {
                const ticketRes = await getTicket(ticketId);
                if (ticketRes.data.success) setTicketData(ticketRes.data.data);
            } catch (err) {
                console.error("Ticket fetch failed:", err.message);
            }
            try {
                const msgRes = await getMessages(ticketId);
                console.log("Messages response:", msgRes);
                const msgs = msgRes?.data?.data || msgRes?.data || [];
                if (Array.isArray(msgs)) {
                    messageKeysRef.current.clear();
                    const unique = [];
                    msgs.forEach((m) => {
                        const key = messageKey(m);
                        if (!messageKeysRef.current.has(key)) {
                            messageKeysRef.current.add(key);
                            unique.push(m);
                        }
                    });
                    setChatHistory(unique);
                } else console.warn("Unexpected messages format:", msgs);
            } catch (err) {
                console.error("HTTP message history failed:", err.message);
            }
        };
        loadInitialData();

        // Socket event listeners
        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        const onJoined = ({ ticketId: tid, memberCount }) => {
            console.log(`Joined ticket room: ${tid}, members: ${memberCount}`);
            // Request message history after joining
            socket.emit("get_ticket_messages", ticketId);
        };

        const onHistory = ({ messages }) => {
            if (messages?.length > 0) {
                messageKeysRef.current.clear();
                const uniqueMessages = [];
                messages.forEach((m) => {
                    const key = messageKey(m);
                    if (!messageKeysRef.current.has(key)) {
                        messageKeysRef.current.add(key);
                        uniqueMessages.push(m);
                    }
                });
                setChatHistory(uniqueMessages);
            }
        };

        const onNewMessage = (msg) => {
            addMessageIfNew(msg);
        };

        const onTyping = ({ userName, userType }) => {
            setTypingUser(userName || userType || "Someone");
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2500);
        };

        const onError = ({ message: errMsg }) => {
            console.error("Socket ticket error:", errMsg);
            openNotification("error", errMsg || "Socket error");
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("joined_ticket_room", onJoined);
        socket.on("ticket_messages_history", onHistory);
        socket.on("receive_ticket_message", onNewMessage);
        socket.on("user_typing_ticket", onTyping);
        socket.on("ticket_error", onError);

        // Join the ticket room
        socket.emit("join_ticket", ticketId);

        return () => {
            socket.emit("leave_ticket", ticketId);
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("joined_ticket_room", onJoined);
            socket.off("ticket_messages_history", onHistory);
            socket.off("receive_ticket_message", onNewMessage);
            socket.off("user_typing_ticket", onTyping);
            socket.off("ticket_error", onError);
            clearTimeout(typingTimeoutRef.current);
        };
    }, [ticketId]);

    const sendMessage = async () => {
        if (!message.trim() || !currentUserId) return;
        const content = message.trim();
        const tempId = `temp-${Date.now()}`;
        const tempMsg = {
            id: tempId,
            ticketId,
            content,
            senderId: currentUserId,
            senderName: currentUser?.name,
            senderType: "admin",
            isAdmin: true,
            createdAt: new Date().toISOString(),
        };
        setChatHistory(prev => [...prev, tempMsg]);
        setMessage("");

        try {
            const res = await createMessages({
                ticketId,
                senderId: currentUserId,
                content,
                isAdminMessage: true,
            });
            if (res.data.success) {
                const serverMsg = res.data.data;
                setChatHistory(prev => {
                    const withoutTemp = prev.filter(m => m.id !== tempId);
                    if (withoutTemp.some(m => m.id === serverMsg.id)) return withoutTemp;
                    const key = messageKey(serverMsg);
                    if (!messageKeysRef.current.has(key)) {
                        messageKeysRef.current.add(key);
                    }
                    return [...withoutTemp, serverMsg];
                });
                // Socket se emit karo taake dusre users ko real-time mile
                socket.emit("send_ticket_message", { ticketId, content });
            } else {
                setChatHistory(prev => prev.filter(m => m.id !== tempId));
                openNotification("error", "Message send failed");
            }
        } catch (err) {
            console.error("Send failed:", err);
            setChatHistory(prev => prev.filter(m => m.id !== tempId));
            openNotification("error", "Message send failed");
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing_ticket", { ticketId });
    };

    const handleResolve = async () => {
        try {
            const res = await updateTicketStatus(ticketId, "Closed");
            if (res.data.success) {
                setTicketData(prev => ({ ...prev, status: "Closed" }));
                openNotification("success", "Resolved", "Ticket has been closed successfully!");
                socket.emit("ticket_status_changed", { ticketId, status: "Closed" });
            }
        } catch (err) {
            console.error("Failed to resolve ticket:", err);
            openNotification("error", "Could not update status");
        }
    };

    return (
        <div className="min-h-screen p-5 font-sans">
            {/* Navigation */}
            <div className="flex items-center gap-2 mb-4 cursor-pointer group" onClick={() => navigate(-1)}>
                <img src={arrowImg} alt="back" className="w-4 h-4" />
                <span className="text-[#7C8DB5] font-bold text-xs">Back</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-[22px] font-semibold text-[#1F2937]">
                    Ticket View - #{ticketId?.substring(0, 7).toUpperCase()}
                </h1>
                <span className="bg-[#93E9A4] text-[#107326] px-4 py-1 rounded-[10px] text-[12px] font-bold">
                    {ticketData?.status || "Loading..."}
                </span>
                {/* Connection indicator */}
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-400'}`} title={connected ? 'Connected' : 'Disconnected'} />
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-[#F1F5F9] p-6 h-[calc(100vh-140px)] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-black font-bold text-[12px] uppercase tracking-wider">
                            Ticket ID <span className='text-blue'>#{ticketId?.substring(0, 7)}</span>
                        </p>
                        <h2 className="text-[24px] font-semibold text-[#1F2937]">
                            {ticketData?.subject || "Fetching subject..."}
                        </h2>
                    </div>
                    <button
                        onClick={handleResolve}
                        disabled={ticketData?.status === "Closed"}
                        className="px-5 py-2 border-[1.5px] border-blue text-blue font-bold rounded-3xl text-[12px] hover:bg-blue hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Mark as Resolved
                    </button>
                </div>

                <div className="flex gap-4 flex-1 min-h-0">
                    {/* LEFT: Chat */}
                    <div className="flex-[1.5] border border-[#F1F5F9] rounded-[24px] overflow-hidden flex flex-col bg-white min-h-0">
                        <div className="p-4 border-b border-[#F8FAFC] flex items-center gap-3 bg-white">
                            <img src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10 rounded-full object-cover" alt="admin" />
                            <div>
                                <h4 className="font-semibold text-[#1F2937] text-md">Admin Portal</h4>
                                <p className="text-[#7C8DB5] text-[10px] font-bold uppercase tracking-widest">
                                    ID#{adminId?.substring(0, 6)}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="p-4 overflow-y-auto space-y-4 bg-white custom-scrollbar flex-1 min-h-0">
                            {chatHistory.length === 0 && (
                                <div className="flex justify-center items-center h-full text-[#9CA3AF] text-sm">
                                    No messages yet
                                </div>
                            )}
                            {chatHistory.map((msg, index) => {
                                const isMe = msg.senderId === currentUserId || msg.sender?.id === currentUserId;
                                return (
                                    <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[65%]`}>
                                        <div className={`px-3 py-2 rounded-[12px] w-fit min-w-[120px] shadow-sm ${
                                            isMe
                                                ? 'bg-blue text-white rounded-tr-none'
                                                : 'bg-[#F8FAFC] text-[#4B5563] rounded-tl-none border border-[#F1F5F9]'
                                        }`}>
                                            <p className={`text-[13px] leading-tight font-medium ${isMe ? 'text-white' : 'text-[#4B5563]'}`}>
                                                {msg.content}
                                            </p>
                                            <div className={`flex justify-end items-center gap-1 mt-1 text-[8px] font-bold opacity-80 ${isMe ? 'text-blue-100' : 'text-[#9CA3AF]'}`}>
                                                <span>
                                                    {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                                        hour: '2-digit', minute: '2-digit', hour12: true
                                                    })}
                                                </span>
                                                {isMe && <span>✓✓</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing indicator */}
                            {typingUser && (
                                <div className="flex items-start max-w-[65%]">
                                    <div className="px-3 py-2 rounded-[12px] bg-[#F8FAFC] border border-[#F1F5F9] text-[#9CA3AF] text-[11px] italic">
                                        {typingUser} is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-[#F8FAFC]">
                            <div className="flex items-center gap-3 bg-[#F8FAFC] p-1.5 pl-4 rounded-full border border-[#F1F5F9]">
                                <Paperclip className="text-black cursor-pointer" size={18} />
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-black text-[13px] font-medium py-1.5"
                                    placeholder="Type a message here ..."
                                    value={message}
                                    onChange={handleTyping}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button onClick={sendMessage} className="bg-blue p-2.5 rounded-full text-white">
                                    <Send size={16} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Ticket Details */}
                    <div className="flex-1">
                        <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold text-[#1F2937]">Ticket Details</h3>
                                <ChevronDown className="text-blue" size={16} />
                            </div>
                            <hr className="mb-4" />
                            <div className="space-y-4">
                                <DetailRow label="Created on" value={ticketData?.createdAt ? new Date(ticketData.createdAt).toLocaleDateString('en-GB') : "---"} />
                                <DetailRow label="Status" value={ticketData?.status || "---"} />
                                <DetailRow label="Department" value={ticketData?.department || "General Support"} />
                                <DetailRow
                                    label="Last Updated"
                                    value={ticketData?.updatedAt
                                        ? new Date(ticketData.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                        : "---"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-[#F8FAFC] pb-2 last:border-0">
        <span className="text-[#7C8DB5] font-bold text-[11px] uppercase tracking-tight">{label}</span>
        <span className="text-[#1F2937] font-bold text-[12px]">{value}</span>
    </div>
);

export default ChatWindow;

