import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../../services/socket';
import { ArrowLeft, Send, ChevronDown, ChevronUp, Paperclip, X, FileText, Image } from 'lucide-react';
import { getTicket, getMessages, getLoggedInUser, updateTicketStatus } from '../../services/chat/index.js';
import { uploadSingleMedia } from '../../services/uploads/index.js';
import { openNotification } from "../../network/notification";

const parseAttachments = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return String(raw).replace(/[{}"]/g, "").split(",").map(s => s.trim()).filter(Boolean);
};

const ChatWindow = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [ticketData, setTicketData] = useState(null);
    const [typingUser, setTypingUser] = useState(null);
    const [connected, setConnected] = useState(socket.connected);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [attachment, setAttachment] = useState(null);       // { file, preview, url }
    const [uploading, setUploading] = useState(false);
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messageKeysRef = useRef(new Set());
    const fileInputRef = useRef(null);
    const currentUser = getLoggedInUser();
    const currentUserId = currentUser?.id;

    const messageKey = (m) => {
        const sender = m.senderId || m.sender?.id || "";
        const time = new Date(m.createdAt || "").toISOString();
        return `${m.id || ""}||${sender}||${m.content || ""}||${time}`;
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, typingUser]);

    useEffect(() => {
        if (!ticketId) return;
        if (!socket.connected) socket.connect();

        const loadInitialData = async () => {
            try {
                const ticketRes = await getTicket(ticketId);
                if (ticketRes.data.success) setTicketData(ticketRes.data.data);
            } catch (err) {
                console.error("Ticket fetch failed:", err.message);
            }
            try {
                const msgRes = await getMessages(ticketId);
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
                }
            } catch (err) {
                console.error("HTTP message history failed:", err.message);
            }
        };

        loadInitialData();

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);
        const onJoined = () => socket.emit("get_ticket_messages", ticketId);
        const onHistory = ({ messages }) => {
            if (messages?.length > 0) {
                messageKeysRef.current.clear();
                const unique = [];
                messages.forEach((m) => {
                    const key = messageKey(m);
                    if (!messageKeysRef.current.has(key)) {
                        messageKeysRef.current.add(key);
                        unique.push(m);
                    }
                });
                setChatHistory(unique);
            }
        };
        const onNewMessage = (msg) => {
            setChatHistory(prev => {
                // Temp message replace karo — content match se
                const tempIndex = prev.findIndex(m =>
                    String(m.id).startsWith("temp-") &&
                    m.content?.trim() === (msg.content || "").trim()
                );
                if (tempIndex !== -1) {
                    const updated = [...prev];
                    updated[tempIndex] = {
                        ...msg,
                        attachments: msg.attachments?.length ? msg.attachments : prev[tempIndex].attachments,
                    };
                    messageKeysRef.current.add(messageKey(msg));
                    return updated;
                }
                // Duplicate check
                const key = messageKey(msg);
                if (messageKeysRef.current.has(key)) return prev;
                messageKeysRef.current.add(key);
                return [...prev, msg];
            });
        };
        const onTyping = ({ userName, userType }) => {
            setTypingUser(userName || userType || "Someone");
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2500);
        };
        const onError = ({ message: errMsg }) => {
            console.error("Socket ticket error:", errMsg);
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("joined_ticket_room", onJoined);
        socket.on("ticket_messages_history", onHistory);
        socket.on("receive_ticket_message", onNewMessage);
        socket.on("user_typing_ticket", onTyping);
        socket.on("ticket_error", onError);
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

    // File select handler � upload immediately, store URL
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            openNotification("error", "File size must be under 10MB");
            return;
        }

        const isImage = file.type.startsWith("image/");
        const preview = isImage ? URL.createObjectURL(file) : null;

        setAttachment({ file, preview, url: null, name: file.name, isImage });
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await uploadSingleMedia(formData);
            const url = res?.data?.data?.url;
            if (!url) throw new Error("No URL returned");
            setAttachment(prev => ({ ...prev, url }));
        } catch {
            openNotification("error", "Failed to upload attachment");
            setAttachment(null);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const sendMessage = () => {
        const hasText = message.trim();
        const hasAttachment = attachment?.url;
        if (!hasText && !hasAttachment) return;
        if (!currentUserId) return;
        if (!socket.connected) {
            openNotification("error", "Not connected. Please wait...");
            return;
        }

        const content = hasText ? message.trim() : "";
        const attachments = hasAttachment ? [attachment.url] : [];
        const tempId = `temp-${Date.now()}`;

        // Optimistic UI
        setChatHistory(prev => [...prev, {
            id: tempId, ticketId, content,
            attachments,
            senderId: currentUserId,
            senderName: currentUser?.name,
            isAdmin: true,
            isAdminMessage: true,
            createdAt: new Date().toISOString(),
        }]);
        setMessage("");
        setAttachment(null);

        // Send ONLY via socket — backend saves to DB and broadcasts
        socket.emit("send_ticket_message", {
            ticketId,
            content: content || " ",
            attachments,
            senderId: currentUserId,
            isAdminMessage: true,
        });
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
                openNotification("success", "Ticket has been closed successfully!");
            }
        } catch (err) {
            openNotification("error", "Could not update status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "open": return "bg-yellow-100 text-yellow-700";
            case "closed": return "bg-green-100 text-green-700";
            case "pending": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const formatTime = (d) => {
        if (!d) return "";
        return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Render attachment inside a message bubble
    const renderAttachment = (url, isMe) => {
        if (!url) return null;
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);
        if (isImage) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-1">
                    <img
                        src={url}
                        alt="attachment"
                        className="max-w-[220px] max-h-[180px] rounded-xl object-cover border border-white/20"
                    />
                </a>
            );
        }
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 mt-1 px-3 py-2 rounded-xl text-xs font-medium border ${
                    isMe ? "border-white/30 text-white bg-white/10" : "border-gray-200 text-gray-700 bg-gray-50"
                }`}
            >
                <FileText size={14} />
                <span className="truncate max-w-[160px]">{url.split("/").pop()}</span>
            </a>
        );
    };

    const canSend = (message.trim() || attachment?.url) && !uploading;

    return (
        <div className="flex flex-col bg-gray-50" style={{ height: "100vh" }}>

            {/* Header */}
            <div className="bg-white border-b px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(ticketData?.user?.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 m-0 text-sm">
                                {ticketData?.subject || "Support Ticket"}
                            </h3>
                            {ticketData?.status && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusStyle(ticketData.status)}`}>
                                    {ticketData.status}
                                </span>
                            )}
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${connected ? 'bg-green-500' : 'bg-red-400'}`} />
                        </div>
                        <p className="text-xs text-gray-400 m-0">
                            #{ticketId?.substring(0, 7).toUpperCase()}
                            {ticketData?.user?.name && ` � ${ticketData.user.name}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDetailsOpen(p => !p)}
                        className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition"
                    >
                        {detailsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {detailsOpen ? "Hide" : "Details"}
                    </button>
                    <button
                        onClick={handleResolve}
                        disabled={ticketData?.status === "Closed"}
                        className="px-4 py-1.5 border border-blue text-blue font-bold rounded-full text-xs hover:bg-blue hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Mark Resolved
                    </button>
                </div>
            </div>

            {/* Details Panel */}
            {detailsOpen && ticketData && (
                <div className="bg-white border-b px-5 py-4 flex-shrink-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs max-w-4xl">
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase">Ticket</p>
                            <p className="font-medium text-gray-800 m-0">#{ticketId?.substring(0, 7).toUpperCase()}</p>
                            <p className="text-gray-500 m-0">{ticketData.subject}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase">User</p>
                            <p className="font-medium text-gray-800 m-0">{ticketData.user?.name || "�"}</p>
                            <p className="text-gray-400 m-0 truncate">{ticketData.user?.email || "�"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase">Status</p>
                            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusStyle(ticketData.status)}`}>
                                {ticketData.status}
                            </span>
                            <p className="text-gray-400 m-0">Dept: {ticketData.department || "General Support"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase">Dates</p>
                            <p className="text-gray-600 m-0">Created: {ticketData.createdAt ? new Date(ticketData.createdAt).toLocaleDateString('en-GB') : "�"}</p>
                            <p className="text-gray-600 m-0">Updated: {ticketData.updatedAt ? new Date(ticketData.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "�"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="max-w-2xl mx-auto space-y-3">
                    {chatHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="font-medium text-gray-500">No messages yet</p>
                            <p className="text-sm">Start the conversation with the user</p>
                        </div>
                    ) : (
                        chatHistory.map((msg, index) => {
                            const isMe = msg.senderId === currentUserId || msg.sender?.id === currentUserId;
                            const isTemp = String(msg.id).startsWith("temp-");
                            return (
                                <div key={msg.id || index} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold flex-shrink-0">
                                            {(ticketData?.user?.name || "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                                        isMe ? "bg-blue text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                                    }`}>
                                        {msg.content?.trim() && (
                                            <p className={`text-sm leading-relaxed break-words m-0 ${isMe ? "text-white" : "text-gray-800"}`}>
                                                {msg.content.trim()}
                                            </p>
                                        )}
                                        {parseAttachments(msg.attachments).map((url, i) => (
                                            <div key={i}>{renderAttachment(url, isMe)}</div>
                                        ))}
                                        {/* fallback for old messages with attachmentUrl */}
                                        {!msg.attachments?.length && msg.attachmentUrl && renderAttachment(msg.attachmentUrl, isMe)}
                                        <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? "text-white/60" : "text-gray-400"}`}>
                                            <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                                            {isMe && <span className="text-[11px]">{isTemp ? "?" : "??"}</span>}
                                        </div>
                                    </div>
                                    {isMe && (
                                        <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {(currentUser?.name || "A")[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {typingUser && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold flex-shrink-0">
                                {(ticketData?.user?.name || "U")[0].toUpperCase()}
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                                <div className="flex gap-1 items-center h-4">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input Area */}
            {ticketData?.status !== "Closed" ? (
                <div className="bg-white border-t px-4 py-3 flex-shrink-0">
                    <div className="max-w-2xl mx-auto space-y-2">

                        {/* Attachment Preview */}
                        {attachment && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                                {attachment.isImage && attachment.preview ? (
                                    <img src={attachment.preview} alt="preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center flex-shrink-0">
                                        <FileText size={18} className="text-blue" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate">{attachment.name}</p>
                                    <p className="text-[10px] text-gray-400">
                                        {uploading ? "Uploading..." : attachment.url ? "Ready to send" : "Upload failed"}
                                    </p>
                                </div>
                                {!uploading && (
                                    <button onClick={removeAttachment} className="p-1 rounded-full hover:bg-gray-200 transition flex-shrink-0">
                                        <X size={14} className="text-gray-500" />
                                    </button>
                                )}
                                {uploading && (
                                    <div className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                )}
                            </div>
                        )}

                        {/* Text + Buttons Row */}
                        <div className="flex gap-2 items-end">
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            {/* Attachment button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading || !!attachment}
                                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-40 flex-shrink-0"
                                title="Attach file"
                            >
                                <Paperclip size={17} />
                            </button>

                            <textarea
                                value={message}
                                onChange={handleTyping}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                placeholder="Type a message here..."
                                rows={1}
                                className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-blue transition-colors"
                                style={{ maxHeight: 120, overflowY: "auto" }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!canSend}
                                className="w-11 h-11 rounded-full bg-blue flex items-center justify-center text-white hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
                            >
                                <Send size={17} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100 border-t px-4 py-3 text-center text-sm text-gray-500 flex-shrink-0">
                    This ticket is closed.
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
