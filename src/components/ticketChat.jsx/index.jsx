import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../../services/socket'; 
import arrowImg from "../../assets/icons/arrow.png";
import { Paperclip, Send, ChevronDown } from 'lucide-react';
import { createMessages, getAdminId, getMessages, getTicket, getLoggedInUser } from '../../services/chat/index.js';
import { updateTicketStatus } from '../../services/chat/index.js';
import { openNotification } from "../../network/notification";

const ChatWindow = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams(); 
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [ticketData, setTicketData] = useState(null); 
    const scrollRef = useRef(null); 
    const adminId = getAdminId();

    const currentUser = getLoggedInUser();
    const currentUserId = currentUser?.id;

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Fetch Chat History
                const chatRes = await getMessages(ticketId);
                if (chatRes.data.success) {
                    setChatHistory(chatRes.data.data);
                }

                // 2. Fetch Ticket Subject & Details
                const ticketRes = await getTicket(ticketId);
                if (ticketRes.data.success) {
                    setTicketData(ticketRes.data.data);
                }
            } catch (err) {
                console.error("Initialization failed:", err.message);
            }
        };

        if (ticketId) {
            loadInitialData();
            
            // Socket setup
            socket.emit("join_ticket", ticketId);
            socket.on("receive_message", (newMessage) => {
                setChatHistory((prev) => {
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });
            });
        }

        return () => {
            socket.off("receive_message");
        };
    }, [ticketId]);

    const sendMessage = async () => {
        if (!message.trim() || !currentUserId) return;
        try {
            const payload = {
                ticketId: ticketId,
                senderId: currentUserId, 
                content: message,
                isAdminMessage: currentUser?.userType === 'admin'
            };
            const res = await createMessages(payload);
            if (res.data.success) {
                setChatHistory((prev) => {
                    if (prev.find(m => m.id === res.data.data.id)) return prev;
                    return [...prev, res.data.data];
                });
                setMessage(""); 
            }
        } catch (error) {
            alert("Can't send message");
        }        
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
                alert("Could not update status");
            }
        };

    return (
        <div className="min-h-screen p-5 font-sans">
            {/* Navigation */}
            <div className="flex items-center gap-2 mb-4 cursor-pointer group" onClick={() => navigate(-1)}>
                <img src={arrowImg} alt="back" className="w-4 h-4" />
                <span className="text-[#7C8DB5] font-bold text-xs">Back</span>
            </div>

            {/* Header - Dynamic Ticket ID & Status */}
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-[22px] font-semibold text-[#1F2937]">Ticket View - #{ticketId?.substring(0, 7).toUpperCase()}</h1>
                <span className="bg-[#93E9A4] text-[#107326] px-4 py-1 rounded-[10px] text-[12px] font-bold">
                    {ticketData?.status || "Loading..."}
                </span>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-[#F1F5F9] p-6">
                
                {/* Ticket Title Area - Dynamic Subject */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-black font-bold text-[12px] uppercase tracking-wider">Ticket ID <span className='text-blue'>#{ticketId?.substring(0, 7)}</span></p>
                        <h2 className="text-[24px] font-semibold text-[#1F2937]">
                            {ticketData?.subject || "Fetching subject..."}
                        </h2>
                    </div>
                    <button
                        onClick={handleResolve}
                        disabled={ticketData?.status === "Closed"}
                        className="px-5 py-2 border-[1.5px] border-blue text-blue font-bold rounded-3xl text-[12px] hover:bg-blue hover:text-white transition-all">
                        Mark as Resolved
                    </button>
                </div>

                <div className="flex gap-4">
                    {/* LEFT: Chat Section */}
                    <div className="flex-[1.5] border border-[#F1F5F9] rounded-[24px] overflow-hidden flex flex-col bg-white">
                        <div className="p-4 border-b border-[#F8FAFC] flex items-center gap-3 bg-white">
                            <img src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10 rounded-full object-cover" alt="admin" />
                            <div>
                                <h4 className="font-semibold text-[#1F2937] text-md">Admin Portal</h4>
                                <p className="text-[#7C8DB5] text-[10px] font-bold uppercase tracking-widest">ID#{adminId?.substring(0,6)}</p>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-4 h-[400px] overflow-y-auto space-y-4 bg-white custom-scrollbar">
                            {chatHistory.map((msg, index) => {
                             const isMe = msg.senderId === currentUserId || msg.sender?.id === currentUserId;
                            //  console.log(msg)
                             console.log("CHECKING_STORAGE:", JSON.parse(localStorage.getItem("persist:root") || "{}"));

                                return (
                                    <div key={index} className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[65%]`}>
                                        {/* <span className="text-[10px] font-bold mb-1 text-[#7C8DB5] uppercase tracking-wider px-1">
                                            {isMe ? "You" : (msg.isAdminMessage === true ? "admin" : (ticketData?.customerName || "customer"))}
                                        </span> */}

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
                            <div ref={scrollRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-white border-t border-[#F8FAFC]">
                            <div className="flex items-center gap-3 bg-[#F8FAFC] p-1.5 pl-4 rounded-full border border-[#F1F5F9]">
                                <Paperclip className="text-black cursor-pointer" size={18} />
                                <input 
                                    type="text" 
                                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-black text-[13px] font-medium py-1.5"
                                    placeholder="Type a message here ..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button onClick={sendMessage} className="bg-blue p-2.5 rounded-full text-white">
                                    <Send size={16} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Sidebar - Dynamic Details */}
                    <div className="flex-1">
                        <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold text-[#1F2937]">Ticket Details</h3>
                                <ChevronDown className="text-blue" size={16} />
                            </div> <hr className="mb-4" />

                            <div className="space-y-4">
                                <DetailRow 
                                    label="Created on" 
                                    value={ticketData?.createdAt ? new Date(ticketData.createdAt).toLocaleDateString('en-GB') : "---"} 
                                />
                                <DetailRow label="Status" value={ticketData?.status || "---"}  />
                                <DetailRow label="Department" value={ticketData?.department || "General Support"} />
                                <DetailRow 
                                    label="Last Updated" 
                                    value={ticketData?.updatedAt 
                                        ? new Date(ticketData.updatedAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit', 
                                            minute: '2-digit', 
                                            hour12: true 
                                        }) 
                                        : "---"
                                    } 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ label, value, color = "text-[#1F2937]" }) => (
    <div className="flex justify-between items-center border-b border-[#F8FAFC] pb-2 last:border-0">
        <span className="text-[#7C8DB5] font-bold text-[11px] uppercase tracking-tight">{label}</span>
        <span className={`${color} font-bold text-[12px]`}>{value}</span>
    </div>
);

export default ChatWindow;