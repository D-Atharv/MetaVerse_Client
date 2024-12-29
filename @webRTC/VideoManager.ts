export default class VideoManager {
    private localVideo!: HTMLVideoElement;
    private remoteVideo!: HTMLVideoElement;

    constructor() {
        this.initializeVideoElements();
    }

    private initializeVideoElements() {
        this.localVideo = document.createElement("video");
        this.localVideo.className = "fixed top-0 left-0 w-48 h-48 rounded-md border-2 border-gray-800 z-10";
        this.localVideo.setAttribute("autoplay", "true");
        this.localVideo.setAttribute("muted", "true");
        document.body.appendChild(this.localVideo);

        this.remoteVideo = document.createElement("video");
        this.remoteVideo.className = "fixed top-0 right-0 w-48 h-48 rounded-md border-2 border-gray-800 z-10";
        this.remoteVideo.setAttribute("autoplay", "true");
        document.body.appendChild(this.remoteVideo);
    }

    setLocalStream(stream: MediaStream) {
        this.localVideo.srcObject = stream;
    }

    setRemoteStream(stream: MediaStream) {
        this.remoteVideo.srcObject = stream;
    }

    destroy() {
        this.localVideo.remove();
        this.remoteVideo.remove();
    }
}
