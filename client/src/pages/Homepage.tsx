import { useAppDispatch } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { socket } from "@/socket/socket"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Homepage = () => {
  const dispatch = useAppDispatch()
  const [emailId, setEmailId] = useState("")
  const [roomId, setRoomId] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    socket.emit("join-room", { emailId, roomId })
  }

 

   const handleJoinedRoom = ({ roomId }: { roomId: string }) => {
    console.log("joined room received", roomId)
     navigate(`/room/${roomId}`)
     
   }
  
 useEffect(() => {
  

   socket.on("joined-room", handleJoinedRoom)

   return () => {
     socket.off("joined-room", handleJoinedRoom)
   }
 }, [])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={handleSubmit}>Enter room</Button>
      </div>
    </div>
  )
}

export default Homepage
