import React, { useState } from "react";
import axios from "axios";
import "./chatbot.css";
import BotLogo from '../../../assets/img/logo.png'
import { MdSend } from "react-icons/md";
import { Center } from "devextreme-react/map";

const Chatbot = ({ closeChatbot }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/chat", {
                messages: newMessages,
            }, {
                headers: { "Content-Type": "application/json" },
            });

            const apiReply = response.data.botReply; // Extract the 'reply' from the API response
            if (apiReply) {
                const botReply = { role: "bot", content: apiReply }; // Map to the expected format
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
                <h4 className="mb-0" style={{color: 'white' }}>Workplus AIChatbot</h4>
                <span className="chat-closeBtn" onClick={closeChatbot}><i className="fa fa-times-circle-o" aria-hidden="true"></i></span>
            </div>
            <div className="chat-messages" >
                <div style={{textAlign: 'Center'}} className="mt-3">
                    <a style={{ cursor: 'revert' }} >
                        <img className="aiChatbotLogo" src={BotLogo} alt="WorkPlus" width={"125px"} height={"50px"} />
                   
                    </a> <br />
                    <span style={{fontWeight: '500', color: 'grey'}}>Hi I'am Bot! Workplus AI Agent</span>
                </div>
                {messages.map((msg, index) => (
                    <div
                        className={`${msg.role === "user" ? "userChatSpace" : "botMsgSpace"}`}
                        key={index}
                    >
                        {msg.content}
                    </div>
                ))}
                {loading && <div>AI HR is typing...</div>}
            </div>


            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress} // Add this line
                    placeholder="Type a message..."
                    style={{ width: "80%", padding: "8px" }}
                />
                <button onClick={sendMessage}><MdSend /></button>
            </div>
        </div>
    );
};

export default Chatbot;