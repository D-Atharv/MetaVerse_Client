/**
 * WebSocketManager is a singleton class that manages a single WebSocket connection,
 * message queuing, and automatic reconnection.
 */
class WebSocketManager {
    // Singleton instance of WebSocketManager
    private static instance: WebSocketManager;

    // WebSocket instance to manage the connection
    private socket: WebSocket | null = null;

    // List of listeners for connection status changes
    private connectionListeners: ((isConnected: boolean) => void)[] = [];

    // Queue to store messages when WebSocket is not open
    private messageQueue: object[] = [];

    // Delay in milliseconds for automatic reconnection attempts
    private reconnectDelay: number = 3000; // 3 seconds

    // Maximum size of the message queue
    private maxQueueSize: number = 100;

    // Private constructor to prevent direct instantiation
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
     * If a connection already exists and is not closed, it will not create a new one.
     * @param url - The WebSocket server URL to connect to
     */
    public connect(url: string): void {
        // Only create a new connection if none exists or the previous one is closed
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            this.socket = new WebSocket(url);

            // Handle WebSocket connection open event
            this.socket.onopen = () => {
                console.log("WebSocket connected!");
                this.notifyConnectionListeners(true); // Notify listeners about connection status
                this.flushMessageQueue(); // Flush any queued messages
            };

            // Handle WebSocket connection close event
            this.socket.onclose = () => {
                console.log("WebSocket disconnected! Attempting to reconnect...");
                this.notifyConnectionListeners(false); // Notify listeners about disconnection
                setTimeout(() => this.connect(url), this.reconnectDelay); // Attempt to reconnect after a delay
            };

            // Handle WebSocket errors
            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            // Handle incoming messages from the WebSocket server
            this.socket.onmessage = (event) => {
                console.log("Message from server:", event.data);
                // Additional logic for handling messages can be added here
            };
        }
    }

    /**
     * Sends a message to the WebSocket server.
     * If the WebSocket is not open, the message is queued for later delivery.
     * @param message - An object containing the message to be sent
     */
    public sendMessage(message: object): void {
        // Ensure the socket is open before sending a message
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message)); // Convert the message to JSON format
        } else {
            // If the queue exceeds the maximum size, remove the oldest message
            if (this.messageQueue.length >= this.maxQueueSize) {
                console.warn("Message queue is full. Dropping the oldest message.");
                this.messageQueue.shift(); // Remove the oldest message
            }
            console.error("WebSocket is not open. Queueing message.");
            this.messageQueue.push(message); // Add the message to the queue
        }
    }

    /**
     * Sends all queued messages when the WebSocket connection is established.
     * This method is called internally when the WebSocket is open.
     */
    private flushMessageQueue(): void {
        // Process all messages in the queue
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift(); // Get the oldest message
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(message)); // Send the message to the server
            }
        }
    }

    /**
     * Registers a listener to be notified of WebSocket connection status changes.
     * @param listener - A callback function that receives the connection status (true/false)
     */
    public onConnectionChange(listener: (isConnected: boolean) => void): void {
        this.connectionListeners.push(listener); // Add the listener to the list
    }

    /**
     * Notifies all registered listeners about a connection status change.
     * This is called internally when the WebSocket connects or disconnects.
     * @param isConnected - The current connection status (true for connected, false for disconnected)
     */
    private notifyConnectionListeners(isConnected: boolean): void {
        this.connectionListeners.forEach((listener) => listener(isConnected)); // Call each listener
    }
}

export default WebSocketManager;
