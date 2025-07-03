import React, { useEffect, useState } from "react";
import axios from "axios";
import "./chatbot.css";
import BotLogo from '../../../assets/img/logo.png';
import { MdSend } from "react-icons/md";
import { getBranchId, getCompanyIdCookie, getEmployeeId, getTokenCookie, getUserName, getUserType } from "../../../utility"; // ✅ adjust this path to where you defined getTokenCookie

const Chatbot = ({ closeChatbot }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userName = getUserName();
        const greeting = {
            role: "bot",
            content: `Hello,${userName ? ` ${userName}` : ""}! How can I assist you today?`
        };
        setMessages([greeting]);
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const employeeId = getEmployeeId();
        const token = getTokenCookie();
        const companyId = getCompanyIdCookie();
        const locationId = getBranchId();
        const userType = getUserType();
        console.log("API Response:", locationId);
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("https://chatbot-service-six.vercel.app/api/chat", {
                messages: newMessages,
                employeeId,
                locationId,
                userType,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    CompanyId: companyId,
                    LocationId: locationId,
                    userType: userType,
                }
            });

            const apiReply = response.data.botReply;
            if (apiReply) {
                const botReply = { role: "bot", content: apiReply };
                setMessages([...newMessages, botReply]);
            } else {
                console.error("Invalid API response format:", response.data);
            }

        } catch (error) {
            console.error("Error fetching response:", error);
        }

  setLoading(false);
};


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h4 className="mb-0" style={{ color: 'white' }}>Workplus AIChatbot</h4>
                <span className="chat-closeBtn" onClick={closeChatbot}>
                    <i className="fa fa-times-circle-o" aria-hidden="true"></i>
                </span>
            </div>
            <div className="chat-messages">
                <div style={{ textAlign: 'Center' }} className="mt-3">
                    <a style={{ cursor: 'revert' }}>
                        <img className="aiChatbotLogo" src={BotLogo} alt="WorkPlus" width={"125px"} height={"50px"} />
                    </a>
                    <br />
                    <span style={{ fontWeight: '500', color: 'grey' }}>Hi I'am Bot! Workplus AI Agent</span>
                </div>
                {messages.map((msg, index) => (
                    <div
                        className={`${msg.role === "user" ? "userChatSpace" : "botMsgSpace"}`}
                        key={index}
                    >
                        {typeof msg.content === "string" ? (
                            msg.content.split('\n').map((line, idx) => (
                                <p key={idx} style={{ margin: 0 }}>{line}</p>
                            ))
                        ) : (
                            JSON.stringify(msg.content.content)
                        )}
                    </div>
                ))}

                {loading && <div>Bot is typing...</div>}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    style={{ width: "80%", padding: "8px" }}
                />
                <button onClick={sendMessage}><MdSend /></button>
            </div>
        </div>
    );
};

export default Chatbot;
