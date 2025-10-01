import "./index.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Warehouses from "./pages/Warehouses"
import Booking from "./pages/Booking"
import Main from "./pages/Main"
import Admin from "./pages/Admin"

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/warehouse" element={<Warehouses />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/main" element={<Main />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
