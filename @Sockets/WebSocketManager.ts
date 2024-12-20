/**
 * WebSocketManager is a singleton class that manages a single WebSocket connection
 */
class WebSocketManager {
    // Singleton instance of WebSocketManager
    private static instance: WebSocketManager;

    // WebSocket instance to manage the connection
    private socket: WebSocket | null = null;

    // List of listeners for connection status changes
    private connectionListeners: ((isConnected: boolean) => void)[] = [];

    // Private constructor to prevent direct instantiation
    private constructor() {}

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
            };

            // Handle WebSocket connection close event
            this.socket.onclose = () => {
                console.log("WebSocket disconnected!");
                this.notifyConnectionListeners(false); // Notify listeners about disconnection
            };

            // Handle WebSocket errors
            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            // Handle incoming messages from the WebSocket server
            this.socket.onmessage = (event) => {
                console.log("Message from server:", event.data);
                // You can add additional logic here to handle specific events
            };
        }
    }

    /**
     * Sends a message to the WebSocket server.
     * @param message - An object containing the message to be sent
     */
    public sendMessage(message: object): void {
        // Ensure the socket is open before sending a message
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message)); // Convert the message to JSON format
        } else {
            console.error("WebSocket is not open. Cannot send message.");
        }
    }

    /**
     * Closes the WebSocket connection if it exists.
     */
    public close(): void {
        if (this.socket) {
            this.socket.close(); // Close the connection
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
