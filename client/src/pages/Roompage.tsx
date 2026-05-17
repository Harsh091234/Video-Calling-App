import { Button } from "@/components/ui/button"
import { peer } from "@/config/peer"
import {
  useCreateAnswerMutation,
  useCreateOfferMutation,
  useSendStreamMutation,
  useSetRemoteAnswerMutation,
} from "@/services/api/peerApi"
import { socket } from "@/socket/socket"
import { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"

const Roompage = () => {
  const [createOffer] = useCreateOfferMutation()
  const [createAnswer] = useCreateAnswerMutation()
  const [setAnswer] = useSetRemoteAnswerMutation()
  const [sendStream] = useSendStreamMutation()
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  const handleNewUserJoined = async ({ emailId }: { emailId: string }) => {
    console.log("New user joined room:", emailId)
    const offer = await createOffer(undefined).unwrap()
    socket.emit("call-user", { emailId, offer })
  }

  const handleIncomingCall = async (data: any) => {
    const { from, offer } = data
    console.log("Incoming-call", from, offer)
    const ans = await createAnswer(offer).unwrap()
    socket.emit("call-accepted", { emailId: from, ans })
  }

  const handleCallAccepted = async (data: any) => {
    const { ans } = data
    console.log("Call-accepted:", ans)
    await setAnswer(ans).unwrap()
  }

  const getUserMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
   
    setMyStream(stream)
  }

  const handleTrackEvent = (ev: RTCTrackEvent) => {
    const [stream] = ev.streams;
    setRemoteStream(stream);
  }

const handleNegotiation = () => {
    console.log("negotiation-needed");
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

  useEffect(() => {peer.addEventListener("track", handleTrackEvent)
    peer.addEventListener("negotiationneeded", handleNegotiation)
    return () => {
        peer.removeEventListener("track", handleTrackEvent)
         peer.removeEventListener("negotiationneeded", handleNegotiation)
    }
  },[])

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={500}
        className="-scale-x-100"
      />
      <Button
        variant={"outline"}
        onClick={() => {
          if (myStream) {
            sendStream(myStream)
          }
        }}
      >
        Send video
      </Button>
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
