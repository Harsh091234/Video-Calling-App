import { useSendNameMutation } from '@/services/api/demoApi'
import React, { useState } from 'react'
import {Input} from "../components/ui/input"
import {Card, CardDescription} from "../components/ui/card"
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
const Homepage = () => {
    const [sendName, {isLoading, data}] = useSendNameMutation();
    const [name, setName] = useState<string>("");
    const message = data?.message;
    
    const handleSubmit = async() => {
        if(!name) return alert("enter your name");
        try {
            await sendName(name).unwrap();

        } catch (error: any) {
          console.log("Error in handleSubmit", error.data.message)  
        }
    }

    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className='text-2xl font-semibold mb-15'>
          MERN-TS-VITE Starter with additonal Shadcn, RTK Query integration
        </h1>
        <Card className='p-10 '>
          <div className='flex gap-3'>
            <Input placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} />
            <Button variant={"outline"} onClick={handleSubmit}>
              Submit
            </Button>
          </div>

          {isLoading ? (
            <Loader2 />
          ) : (
            <CardDescription className='text-center'>{message}</CardDescription>
          )}
        </Card>
      </div>
    )
}

export default Homepage
