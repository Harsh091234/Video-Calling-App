
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import MainLoader from "./components/loaders/MainLoader";

const Homepage  = lazy(() => import("./pages/Homepage"));
const Roompage = lazy(() => import("./pages/Roompage"))


export function App() {
  return (  
   <BrowserRouter>
    <Suspense fallback={<MainLoader />} >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/room/:roomId" element={<Roompage />} />
      </Routes>
    </Suspense>
   </BrowserRouter>
  )
}

export default App
