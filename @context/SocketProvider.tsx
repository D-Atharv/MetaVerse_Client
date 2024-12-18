import React, { createContext, useEffect, useState } from "react";

interface SocketContextType {
    sendMessage: (message: string) => void;
    isConnected: boolean;
}

//TODO -> later properly implement cleanup function for the websocket
//TODO -> added console.log for debugging purposes. Remove them later
const SocketContext = createContext<SocketContextType | undefined>(undefined);

let socketInstance: WebSocket | null = null;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socketInstance || socketInstance.readyState === WebSocket.CLOSED) {
            console.log("Initializing WebSocket...");
            socketInstance = new WebSocket("ws://localhost:8080/ws");

            socketInstance.onopen = () => {
                console.log("WebSocket connected!");
                setIsConnected(true);

                socketInstance?.send(JSON.stringify({ event: "ping", data: "Hello Server!" }));
            };

            socketInstance.onmessage = (event) => {
                console.log("Message from server:", event.data);
            };

            socketInstance.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            socketInstance.onclose = () => {
                console.warn("WebSocket disconnected");
                setIsConnected(false);
                socketInstance = null;
            };
        }

        return () => {
            if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
                console.log("Closing WebSocket...");
                socketInstance.close();
            }
        };
    }, []);

    const sendMessage = (message: string) => {
        if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
            const payload = typeof message === "string" ? { event: "message", data: message } : message;
            socketInstance.send(JSON.stringify(payload));
        } else {
            console.error("Cannot send message, WebSocket is not open");
        }
    };

    return (
        <SocketContext.Provider value={{ sendMessage, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;

