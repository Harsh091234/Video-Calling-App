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
  
  const [remoteEmailId, setRemoteEmailId] = useState("")
  const [cameraAvailable, setCameraAvailable] = useState(true)
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
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
  }

  const getUserMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })

      setMyStream(stream)
      setCameraAvailable(true)
    } catch (error) {
      console.log("Camera not available:", error)
      setCameraAvailable(false)
    }
  }

 
  const handleNegotiation = async () => {
    try {
      if (peer.signalingState !== "stable") return
      console.log("negotiation-needed")
   
      const offer = await createOffer(undefined).unwrap()
      socket.emit("call-user", { emailId: remoteEmailId, offer })
    } catch (error) {
      console.log(error)
    }
  }

 

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined)
    socket.on("incoming-call", handleIncomingCall)
    socket.on("call-accepted", handleCallAccepted)

    return () => {
      socket.off("user-joined", handleNewUserJoined)
      socket.off("incoming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccepted)
    }
  }, [socket, handleNewUserJoined])

  useEffect(() => {
    socket.on("ice-candidate", async({candidate}) => {
      try {
        await peer.addIceCandidate(candidate)
      } catch (error) {
        console.log("ice error", error)
      }
    })
    return () => {
      socket.off("ice-candidate");
    }
  }, [])


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
    if(!myStream) return
    myStream.getTracks().forEach((track) => {
      peer.addTrack(track, myStream)
    })
  }, [myStream])

  useEffect(() => {
     const handleTrackEvent = (ev: RTCTrackEvent) => {
       const [stream] = ev.streams
       setRemoteStream(stream)
     }

    peer.addEventListener("track", handleTrackEvent)
     peer.addEventListener("negotiationneeded", handleNegotiation)
    return () => {
      peer.removeEventListener("track", handleTrackEvent)
       peer.removeEventListener("negotiationneeded", handleNegotiation)
    }
  }, [])

  return (
    <div className="">
      <h1>Your are connected to {remoteEmailId}</h1>
      <div className="relative aspect-video w-100">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full -scale-x-100 object-cover"
        />
        {!cameraAvailable && (
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/80 text-lg font-medium text-white">
            Camera not available
          </div>
        )}
      </div>

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width={500}
        className="-scale-x-100"
      />
    </div>
  )
}

export default Roompage
