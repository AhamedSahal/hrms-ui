import React, { useEffect, useCallback } from "react"; // Adjust import as needed
import { getTokenCookie } from "../../utility";

const RasaChat = ({ onClose = () => console.log("Default onClose called") }) => {
    const handleClose = useCallback(() => {
        console.log("Close button clicked"); // Debug log
        if (onClose) {
            console.log("onClose function exists and is being called"); // Debug log
            onClose();
        } else {
            console.log("onClose function is not provided"); // Debug log
        }
    }, [onClose]);

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

            // Use MutationObserver to add a close button to the header
            const observer = new MutationObserver(() => {
                const header = document.querySelector(".rw-header");
                if (header && !header.querySelector(".close-button")) {
                    const closeButton = document.createElement("button");
                    closeButton.textContent = "✖";
                    closeButton.className = "close-button";
                    closeButton.style.cssText = "background: none; border: none; font-size: 16px; cursor: pointer; margin-left: auto;";
                    closeButton.addEventListener("click", handleClose);
                    header.appendChild(closeButton);
                    console.log("Close button added and event listener attached"); // Debug log
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            return () => {
                observer.disconnect();
            };
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [handleClose]);

    return null;
};

export default RasaChat;
