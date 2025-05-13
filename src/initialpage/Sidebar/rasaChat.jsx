import React, { useEffect } from "react"; // Adjust import as needed
import { getTokenCookie } from "../../utility";

const RasaChat = ({ onClose }) => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/rasa-webchat/lib/index.js";
        script.async = true;
        script.onload = () => {
            window.WebChat.default({
                initPayload: "/greet",
                socketUrl: "https://chatbot-service.workplus-hrms.com",
                customData: { "language": "en", "access_token": getTokenCookie() },
                title: "Workplus Chatbot",
                killSession: true,
                embedded: false,
                params: {
                    images: {
                        dims: {
                            width: 300,
                            height: 200,
                        }
                    },
                    storage: "session"
                }
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [onClose]);

    return null;
};

export default RasaChat;
