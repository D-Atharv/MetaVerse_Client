export type WebSocketEvent =
    | { event: "register"; data: { user_id: string } }
    | { event: "movement"; data: { user_id: string; x: number; y: number } }
    | { event: "positions"; positions: { user_id: string; x: number; y: number }[] };

export interface WebSocketMessage {
    event: string;
    data?: unknown;
}

class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;
    private connectionListeners: ((isConnected: boolean) => void)[] = [];
    private messageListeners: ((message: WebSocketEvent) => void)[] = [];
    private messageQueue: WebSocketEvent[] = [];
    private reconnectDelay: number = 3000;
    private maxQueueSize: number = 100;

    private constructor() { }

    /**
     * Returns the singleton instance of WebSocketManager.
     * If it doesn't exist, it creates a new one.
     */
    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    /**
     * Establishes a WebSocket connection to the given URL.
     * @param url - The WebSocket server URL to connect to
     */
    public connect(url: string): void {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                console.log("WebSocket connected!");
                this.notifyConnectionListeners(true);
                this.flushMessageQueue();
            };

            this.socket.onclose = () => {
                console.log("WebSocket disconnected! Attempting to reconnect...");
                this.notifyConnectionListeners(false);
                setTimeout(() => this.connect(url), this.reconnectDelay);
            };

            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            this.socket.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log("Received WebSocket message:", message); // Log the raw message
                    this.notifyMessageListeners(message as WebSocketEvent);
                } catch (error) {
                    console.error("Failed to parse WebSocket message:", error);
                }
            };
        }
    }

    /**
     * Sends a message to the WebSocket server.
     * @param message - A structured WebSocket event to be sent
     */
    public sendMessage(message: WebSocketEvent): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            if (this.messageQueue.length >= this.maxQueueSize) {
                console.warn("Message queue is full. Dropping the oldest message.");
                this.messageQueue.shift();
            }
            this.messageQueue.push(message);
        }
    }

    /**
     * Sends all queued messages when the WebSocket connection is established.
     */
    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (this.socket && this.socket.readyState === WebSocket.OPEN && message) {
                this.socket.send(JSON.stringify(message));
            }
        }
    }

    /**
     * Registers a listener to be notified of WebSocket connection status changes.
     * @param listener - A callback function that receives the connection status (true/false)
     */
    public onConnectionChange(listener: (isConnected: boolean) => void): void {
        this.connectionListeners.push(listener);
    }

    /**
     * Registers a listener to be notified of incoming WebSocket messages.
     * @param listener - A callback function that receives the incoming message
     */
    public onMessage(listener: (message: WebSocketEvent) => void): void {
        this.messageListeners.push(listener);
    }

    /**
     * Notifies all registered listeners about a connection status change.
     * @param isConnected - The current connection status (true for connected, false for disconnected)
     */
    private notifyConnectionListeners(isConnected: boolean): void {
        this.connectionListeners.forEach((listener) => listener(isConnected));
    }

    /**
     * Notifies all registered listeners about an incoming WebSocket message.
     * @param message - The incoming WebSocket message
     */
    private notifyMessageListeners(message: WebSocketEvent): void {
        this.messageListeners.forEach((listener) => listener(message));
    }
}

export default WebSocketManager;
