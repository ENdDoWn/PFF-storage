import "../index.css"
import bgLogin from '../assets/bg-login.png'

import BoxLogin from "../components/user/BoxLogin"
// import BoxRegister from "../components/BoxRegis"

import { useState } from "react"

function Login() {
    const [Login, setLogin] = useState(true);
    return (
        <div className="grid grid-cols-[70%_30%] h-screen overflow-hidden bg-[#FFF6F1]">
            <img src={bgLogin} className="flex mx-auto w-[80%] h-full object-cover" />
            <div className="flex flex-col justify-center items-center bg-white">
                <BoxLogin />
                {/* {Login ? (
                    <BoxLogin onSwitch={() => setLogin(false)} />
                ) : (
                    <BoxRegister onSwitch={() => setLogin(true)} />
                )} */}
            </div>
        </div>
    )
}

export default Login;