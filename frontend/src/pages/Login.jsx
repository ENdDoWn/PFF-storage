import "../index.css"
import bgLogin from '../assets/bg-login.png'

// Temporarily commented out to debug white screen
// import { signIn } from 'aws-amplify/auth';
// import BoxRegister from "../components/BoxRegis"

import { useState } from "react"


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Temporarily disabled Amplify auth for debugging
            // const { isSignedIn, nextStep } = await signIn({ 
            //     username, 
            //     password 
            // });
            console.log("Login attempt:", { username });
            alert("Login form submitted (Amplify auth disabled for debugging)!");
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-[70%_30%] h-screen overflow-hidden bg-[#FFF6F1]">
            <img src={bgLogin} className="flex mx-auto w-[80%] h-full object-cover" />
            <div className="flex flex-col justify-center items-center bg-white">
                <form className="w-full max-w-xs" onSubmit={handleLogin}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="mb-4 px-4 py-2 border rounded w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="mb-4 px-4 py-2 border rounded w-full"
                        required
                    />
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <button
                        type="submit"
                        className="bg-orange-400 text-white px-4 py-2 rounded w-full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;