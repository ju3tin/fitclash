import SimplePeer from "simple-peer"

export type PeerEventCallbacks = {
  onSignal?: (signal: SimplePeer.SignalData) => void
  onConnect?: () => void
  onStream?: (stream: MediaStream) => void
  onData?: (data: any) => void
  onClose?: () => void
  onError?: (err: Error) => void
}

export class WebRTCService {
  private peer: SimplePeer.Instance | null = null
  private localStream: MediaStream | null = null
  private callbacks: PeerEventCallbacks = {}

  constructor(callbacks: PeerEventCallbacks = {}) {
    this.callbacks = callbacks
  }

  // Initialize a peer connection as the initiator (caller)
  public initiatePeer(stream: MediaStream): void {
    this.localStream = stream

    this.peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    })

    this.attachPeerEvents()
  }

  // Initialize a peer connection as the receiver (answerer)
  public receivePeer(stream: MediaStream): void {
    this.localStream = stream

    this.peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    })

    this.attachPeerEvents()
  }

  // Handle incoming signal data (offer or answer)
  public signal(data: SimplePeer.SignalData): void {
    if (this.peer) {
      this.peer.signal(data)
    } else {
      console.error("Peer connection not initialized")
    }
  }

  // Send data to the peer
  public sendData(data: any): void {
    if (this.peer && this.peer.connected) {
      this.peer.send(JSON.stringify(data))
    } else {
      console.error("Peer not connected, cannot send data")
    }
  }

  // Close the peer connection
  public destroy(): void {
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  // Attach event listeners to the peer
  private attachPeerEvents(): void {
    if (!this.peer) return

    this.peer.on("signal", (data) => {
      if (this.callbacks.onSignal) {
        this.callbacks.onSignal(data)
      }
    })

    this.peer.on("connect", () => {
      console.log("Peer connection established")
      if (this.callbacks.onConnect) {
        this.callbacks.onConnect()
      }
    })

    this.peer.on("stream", (stream) => {
      console.log("Remote stream received")
      if (this.callbacks.onStream) {
        this.callbacks.onStream(stream)
      }
    })

    this.peer.on("data", (data) => {
      try {
        const parsedData = JSON.parse(data.toString())
        if (this.callbacks.onData) {
          this.callbacks.onData(parsedData)
        }
      } catch (err) {
        console.error("Error parsing data:", err)
      }
    })

    this.peer.on("close", () => {
      console.log("Peer connection closed")
      if (this.callbacks.onClose) {
        this.callbacks.onClose()
      }
    })

    this.peer.on("error", (err) => {
      console.error("Peer connection error:", err)
      if (this.callbacks.onError) {
        this.callbacks.onError(err)
      }
    })
  }
}

