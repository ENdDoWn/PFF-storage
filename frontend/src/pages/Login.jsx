import "../index.css"
import bgLogin from '../assets/bg-login.png'
import { signIn, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import BoxRegister from "./BoxRegis"
import { IoMdPerson } from "react-icons/io";
import { LuLockKeyhole } from "react-icons/lu";

import { useState } from "react"


function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { isSignedIn, nextStep } = await signIn({ 
                username, 
                password 
            });
            if (isSignedIn) {
                try {
                    const session = await fetchAuthSession();
                    const tokens = session.tokens;
                    const groups = tokens?.idToken?.payload['cognito:groups'];
                    if (groups && (groups.includes('Admin') || groups.includes('admin'))) {
                        console.log('Redirecting to admin');
                        window.location.href = "/admin";
                        return;
                    }

                    const attributes = await fetchUserAttributes();
                    const userRole = attributes['custom:role'];

                    if (userRole === 'admin' || userRole === 'Admin') {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/main";
                    }
                } catch (sessionError) {
                    console.error('Error fetching user session:', sessionError);
                    window.location.href = "/main";
                }
            }
            else {
                setError("Additional steps required: " + nextStep);
            }
        } catch (err) {
            setError(err.message || "Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-[70%_30%] h-screen overflow-hidden bg-[#FFF6F1]">
            <img src={bgLogin} className="flex mx-auto w-[80%] h-full object-cover" />
            <div className="flex flex-col justify-center items-center bg-white">
                {isLogin ? (
                    <div className="flex flex-col justify-center items-center bg-white p-10 font-Montserrat w-full">
                        <h1 className="text-[4vh] font-bold text-blue-600 mb-2">PFF Storage</h1>
                        <p className="text-gray-500 text-[2vh] mb-6">เข้าสู่ระบบ</p>
                        <form className="flex flex-col gap-4 w-full mb-5" onSubmit={handleLogin}>
                            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                                <IoMdPerson className="text-gray-400 mr-3" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Email" 
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="flex-1 outline-none text-gray-700"
                                    required
                                />
                            </div>
                            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                                <LuLockKeyhole className="text-gray-400 mr-3" size={20} />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="flex-1 outline-none text-gray-700"
                                    required
                                />
                            </div>
                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                            <button
                                type="submit"
                                className="mt-4 w-full bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-all duration-300 cursor-pointer disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                            </button>
                        </form>
                        <div className="mt-5 text-[1.8vh] text-gray-500">
                            <p>ยังไม่มีบัญชี?{" "}
                                <span className="text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => setIsLogin(false)}>ลงทะเบียน</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <BoxRegister onSwitch={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
}

export default Login;