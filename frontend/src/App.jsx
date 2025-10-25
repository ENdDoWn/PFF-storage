import "./index.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Warehouses from "./pages/Warehouses"
import Booking from "./pages/Booking"
import Main from "./pages/Main"
import Admin from "./pages/Admin"
import Forbidden from "./pages/Forbidden"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminProtectedRoute from "./components/AdminProtectedRoute"

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/warehouse" element={<ProtectedRoute><Warehouses /></ProtectedRoute>} />
            <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
            <Route path="/forbidden" element={<Forbidden />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
