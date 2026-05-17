import { useCreateAnswerMutation, useCreateOfferMutation, useSetRemoteAnswerMutation } from '@/services/api/peerApi'
import { socket } from '@/socket/socket'
import React, { useCallback, useEffect } from 'react'

const Roompage = () => {
    const [createOffer] = useCreateOfferMutation();
    const [createAnswer] = useCreateAnswerMutation();
    const [setAnswer] = useSetRemoteAnswerMutation();


    const handleNewUserJoined = async({emailId}: {emailId: string}) => {
        console.log("New user joined room:", emailId);
        const offer = await createOffer(undefined).unwrap();
        socket.emit("call-user", {emailId, offer})
    }

    const handleIncomingCall = async(data: any) => {
        const {from, offer} = data;
        console.log("Incoming-call", from , offer);
        const ans = await createAnswer(offer).unwrap();
        socket.emit("call-accepted", {emailId: from, ans});
    }

    const handleCallAccepted = async(data: any) => {
        const {ans} = data;
        console.log("Call-accepted:", ans);
        await setAnswer(ans).unwrap();

    }

    
    useEffect(() => {
        socket.on("user-joined", handleNewUserJoined)
        socket.on("incoming-call", handleIncomingCall)
        socket.on("call-accepted", handleCallAccepted);
        
        return () => {
            socket.off("user-joined", handleNewUserJoined);
            socket.off("incoming-call", handleIncomingCall)
            socket.off("call-accepted", handleCallAccepted)

        }
    }, [socket,handleNewUserJoined])
  return (
    <div>
      rr
    </div>
  )
}

export default Roompage
