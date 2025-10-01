import { IoMdPerson } from "react-icons/io";
import { LuLockKeyhole } from "react-icons/lu";

function BoxRegister({ onSwitch }) {
    return (
        <div className="flex flex-col justify-center items-center bg-white p-10 font-Montserrat w-full">
            <h1 className="text-[4vh] font-bold text-blue-600 mb-2">PFF Storage</h1>
            <p className="text-gray-500 text-[2vh] mb-6">ลงทะเบียน</p>
            <div className="flex flex-col gap-4 w-full mb-5">
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <IoMdPerson className="text-gray-400 mr-3" size={20} />
                    <input type="text" placeholder="Email" className="flex-1 outline-none text-gray-700" />
                </div>
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <LuLockKeyhole className="text-gray-400 mr-3" size={20} />
                    <input type="password" placeholder="Password" className="flex-1 outline-none text-gray-700" />
                </div>
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <LuLockKeyhole className="text-gray-400 mr-3" size={20} />
                    <input type="password" placeholder="Confirm Password" className="flex-1 outline-none text-gray-700" />
                </div>
            </div>
            <button className="mt-4 w-full bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-all duration-300 cursor-pointer">ยืนยัน</button>
            <div className="mt-5 text-[1.8vh] text-gray-500">
                <p>มีบัญชีแล้ว?{" "}
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline" onClick={onSwitch}>เข้าสู่ระบบ</span>
                </p>
            </div>

        </div>
    );
}

export default BoxRegister;
