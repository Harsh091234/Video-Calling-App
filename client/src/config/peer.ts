import { socket } from "../socket/socket"


export const peer = new RTCPeerConnection({
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
})

peer.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit("ice-candidate", {
      candidate: event.candidate,
    })
  }
}
