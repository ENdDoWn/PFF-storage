import { IoMdPerson } from "react-icons/io";
import { LuLockKeyhole } from "react-icons/lu";

import { Link } from "react-router-dom";

function BoxLogin({ onSwitch }) {
  return (
    <div className="flex flex-col justify-center items-center w-full p-10 font-Montserrat">
        <h1 className="text-[4vh] font-bold text-blue-600 mb-2">PFF Storage</h1>
        <p className="text-gray-500 text-[2vh] mb-6">เข้าสู่ระบบ</p>
        <div className="flex flex-col gap-4 w-full mb-5">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                <IoMdPerson className="text-gray-400 mr-3" size={20} />
                <input type="text" placeholder="Email" className="flex-1 outline-none text-gray-700" />
            </div>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                <LuLockKeyhole className="text-gray-400 mr-3" size={20} />
                <input type="password" placeholder="Password" className="flex-1 outline-none text-gray-700" />
            </div>
        </div>
        <Link to="/Main" className="w-full"><button className="mt-6 w-full bg-orange-500 text-white text-[2vh] py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-all duration-300 cursor-pointer">เข้าสู่ระบบ</button></Link>
    </div>
  );
}

export default BoxLogin;
