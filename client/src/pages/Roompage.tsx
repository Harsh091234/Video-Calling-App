import { Button } from "@/components/ui/button"
import { peer } from "@/config/peer"
import {
  useCreateAnswerMutation,
  useCreateOfferMutation,
  useSetRemoteAnswerMutation,
} from "@/services/api/peerApi"
import { socket } from "@/socket/socket"
import { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"

const Roompage = () => {
  const [createOffer] = useCreateOfferMutation()
  const [createAnswer] = useCreateAnswerMutation()
  const [setAnswer] = useSetRemoteAnswerMutation()
  const tracksAdded = useRef(false)
  const [remoteEmailId, setRemoteEmailId] = useState("")
  const [cameraAvailable, setCameraAvailable] = useState(true)
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const iceQueue = useRef<RTCIceCandidateInit[]>([])
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  const handleNewUserJoined = async ({ emailId }: { emailId: string }) => {
    setRemoteEmailId(emailId)
    console.log("New user joined room:", emailId)

    const offer = await createOffer(undefined).unwrap()
    socket.emit("call-user", { emailId, offer })
  }

  const handleIncomingCall = async (data: any) => {
    const { from, offer } = data
    console.log("Incoming-call", from, offer)
    setRemoteEmailId(from)
    const ans = await createAnswer(offer).unwrap()
    socket.emit("call-accepted", { emailId: from, ans })
  }

  const handleCallAccepted = async (data: any) => {
    const { ans } = data
    console.log("Call-accepted:", ans)
    await setAnswer(ans).unwrap()
    for (const candidate of iceQueue.current) {
      await peer.addIceCandidate(candidate)
    }

    iceQueue.current = []
  }

  const getUserMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })

      setMyStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraAvailable(true)
      console.log(stream.getTracks())
      console.log(stream.getVideoTracks())
    } catch (error) {
      console.log("Camera not available:", error)
      setCameraAvailable(false)
    }
  }

  // const handleNegotiation = async () => {
  //   try {
  //     if (peer.signalingState !== "stable") return
  //     console.log("negotiation-needed")

  //     const offer = await createOffer(undefined).unwrap()
  //     socket.emit("call-user", { emailId: remoteEmailId, offer })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    socket.on("user-connected", handleNewUserJoined)
    socket.on("incoming-call", handleIncomingCall)
    socket.on("call-accepted", handleCallAccepted)

    return () => {
      socket.off("user-connected", handleNewUserJoined)
      socket.off("incoming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccepted)
    }
  }, [socket, handleNewUserJoined])
  useEffect(() => {
    const handleIceCandidate = async ({ candidate }: any) => {
      try {
        if (!peer.remoteDescription) {
          iceQueue.current.push(candidate)
          return
        }

        await peer.addIceCandidate(candidate)
      } catch (error) {
        console.log("ICE ERROR", error)
      }
    }

    socket.on("ice-candidate", handleIceCandidate)

    return () => {
      socket.off("ice-candidate", handleIceCandidate)
    }
  }, [])

  useEffect(() => {
    peer.onconnectionstatechange = () => {
      console.log("connectionState", peer.connectionState)
    }

    peer.oniceconnectionstatechange = () => {
      console.log("iceConnectionState", peer.iceConnectionState)
    }

    peer.onsignalingstatechange = () => {
      console.log("signalingState", peer.signalingState)
    }
  }, [])

  useEffect(() => {
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          emailId: remoteEmailId,
          candidate: event.candidate,
        })
      }
    }
  }, [remoteEmailId])

  useEffect(() => {
    if (videoRef.current && myStream) {
      videoRef.current.srcObject = myStream
    }
  }, [myStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    getUserMediaStream()
  }, [])

  useEffect(() => {
    if (!myStream || tracksAdded.current) return

    myStream.getTracks().forEach((track) => {
      peer.addTrack(track, myStream)
    })

    tracksAdded.current = true
  }, [myStream])

  useEffect(() => {
    const handleTrackEvent = (ev: RTCTrackEvent) => {
      console.log("TRACK EVENT", ev)
      const [stream] = ev.streams

      console.log("REMOTE STREAM", stream)
      setRemoteStream(stream)
    }

    peer.addEventListener("track", handleTrackEvent)
    // peer.addEventListener("negotiationneeded", handleNegotiation)
    return () => {
      peer.removeEventListener("track", handleTrackEvent)
      // peer.removeEventListener("negotiationneeded", handleNegotiation)
    }
  }, [])

  return (
    <div className="">
      <h1>Your are connected to {remoteEmailId}</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={300}
        height={100}
        className="-scale-x-100 bg-black"
      />{" "}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width={300}
        height={100}
        className="-scale-x-100 bg-yellow-400"
      />
    </div>
  )
}

export default Roompage
