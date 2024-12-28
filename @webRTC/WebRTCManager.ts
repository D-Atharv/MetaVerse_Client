import Peer, { MediaConnection } from "peerjs";

export default class PeerService {
    private peer: Peer | null = null;
    private localStream: MediaStream | null = null;
    private remoteStreamCallback: (stream: MediaStream) => void;
    private localStreamPromise: Promise<void> | null = null;
    private onCallEnd?: () => void;


    constructor(remoteStreamCallback: (stream: MediaStream) => void) {
        this.remoteStreamCallback = remoteStreamCallback;
    }

    /**
     * Initializes the Peer object and sets up event listeners.
     * @param peerId Optional custom peer ID
     */
    public initialize(peerId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.peer = new Peer(peerId, {
                debug: 3,
            });

            this.peer.on("open", (id) => {
                console.log("PeerJS connected with ID:", id);
                resolve(id);
            });

            this.peer.on("error", (err) => {
                console.error("PeerJS error:", err);
                reject(err);
            });

            this.peer.on("call", (call: MediaConnection) => {
                if (this.localStream) {
                    call.answer(this.localStream); // Answer with local stream
                    this.setupCallEvents(call);
                } else {
                    console.warn("No local stream available to answer the call.");
                }
            });
        });
    }

    /**
     * Starts a video call with the given peer ID.
     * @param peerId The ID of the peer to call
     */
    public async startCall(peerId: string): Promise<void> {
        try {
            await this.ensureLocalStreamInitialized();
            if (!this.peer || !this.localStream) {
                console.error("Peer or local stream not initialized.");
                return;
            }

            const call = this.peer.call(peerId, this.localStream);
            this.setupCallEvents(call);
        } catch (error) {
            console.error("Failed to start the call:", error);
        }
    }

    /**
     * Sets up event listeners for a media connection.
     * @param call The media connection
     */
    private setupCallEvents(call: MediaConnection): void {
        call.on("stream", (remoteStream) => {
            console.log("Received remote stream.");
            this.remoteStreamCallback(remoteStream);
        });

        call.on("close", () => {
            console.log("Call closed.");
            // Notify parent that the call ended
            this.onCallEnd?.();
        });

        call.on("error", (err) => {
            console.error("Call error:", err);
            // Notify parent that the call ended
            this.onCallEnd?.();
        });
    }

    /**
     * Sets a callback function to be called when the call ends.
     * @param callback - The callback function to be called when the call ends
     */
    public setOnCallEndCallback(callback: () => void): void {
        /**
         * The callback function to be called when the call ends
         */
        this.onCallEnd = callback;
    }


    /**
     * Closes the peer connection.
     */
    public closeConnection(): void {
        this.peer?.disconnect();
        this.peer?.destroy();
    }

    /**
     * Sets the local media stream and resolves the promise to indicate it's ready.
     * @param stream The local MediaStream
     */
    public setLocalStream(stream: MediaStream): void {
        this.localStream = stream;
        if (this.localStreamPromise) {
            this.localStreamPromise = Promise.resolve();
        }
    }


    /**
     * Ensures the local stream is initialized.
     * Returns a promise that resolves when the local stream is ready.
     */
    private ensureLocalStreamInitialized(): Promise<void> {
        if (this.localStream) {
            return Promise.resolve();
        }

        if (!this.localStreamPromise) {
            this.localStreamPromise = new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Local stream initialization timed out."));
                }, 10000); // Timeout after 10 seconds

                const checkStream = () => {
                    if (this.localStream) {
                        clearTimeout(timeout);
                        resolve();
                    } else {
                        setTimeout(checkStream, 100); // Retry every 100ms
                    }
                };

                checkStream();
            });
        }

        return this.localStreamPromise;
    }
}
