
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import MainLoader from "./components/loaders/MainLoader";

const Homepage  = lazy(() => import("./pages/Homepage"));

export function App() {
  return (  
   <BrowserRouter>
    <Suspense fallback={<MainLoader />} >
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Suspense>
   </BrowserRouter>
  )
}

export default App
