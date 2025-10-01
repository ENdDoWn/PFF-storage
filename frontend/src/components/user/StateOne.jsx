import { IoPersonAddSharp, IoLocationSharp } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { LuLockKeyhole } from "react-icons/lu";
import { MdPhone, MdEmail } from "react-icons/md";
import { GrFormNextLink } from "react-icons/gr";
import { FaBuilding } from "react-icons/fa6";

function StateOne({ onNext }){
    return(
        <div className="pt-[80px] flex flex-col items-center gap-10 font-Montserrat">
            <div className="flex gap-5 w-full max-w-[800px]">
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-blue-600 shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-white text-blue-600 text-[1.5rem] font-bold">1</button>
                    <p className="text-white text-[1rem] font-semibold">ลงทะเบียน</p>
                </div>
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-[#f4f6f7] shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-[#b3bec3] text-white text-[1.5rem] font-bold">2</button>
                    <p className="text-[#b3bec3] text-[1rem] font-semibold">เลือกห้องที่จะเช่า</p>
                </div>
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-[#f4f6f7] shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-[#b3bec3] text-white text-[1.5rem] font-bold">3</button>
                    <p className="text-[#b3bec3] text-[1rem] font-semibold">ชำระเงิน</p>
                </div>
            </div>
            <div className="flex flex-col items-center w-[60%] border border-[#e2e8f0] rounded-xl shadow-sm mb-10 p-10">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="flex items-center gap-3 text-[2rem] font-bold text-[#3b5bdb]"><IoPersonAddSharp className="text-[2.5rem]" />ลงทะเบียนผู้เช่า</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#3b5bdb] to-[#74c0fc] rounded-full mt-2"></div>
                </div>
                <div className="w-full mt-10 px-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                        <div>
                            <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><IoMdPerson color="#5c7cfa" size={30} />ชื่อ</span>
                            <input type="text" placeholder="ชื่อจริง" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                        <div>
                            <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><IoMdPerson color="#5c7cfa" size={30} />นามสกุล</span>
                            <input type="text" placeholder="นามสกุล" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                    </div>
                    <div className="mb-10">
                        <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><FaBuilding color="#5c7cfa" size={30} />ชื่อบริษัท</span>
                        <input type="text" placeholder="ชื่อบริษัท หรือ ชื่อร้านค้าของคุณ" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                    </div>
                    <div className="mb-10">
                        <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><MdPhone color="#5c7cfa" size={30} />เบอร์โทรศัพท์</span>
                        <input type="text" placeholder="เบอร์โทรศัพท์" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                    </div>
                    <div className="mb-5">
                        <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><IoLocationSharp color="#5c7cfa" size={30} />ที่อยู่</span>
                        <textarea placeholder="ที่อยู่ของคุณ" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]"></textarea>
                    </div>
                    <h1 className="flex items-center mb-10 text-[2rem] font-bold text-[#3b5bdb]">ข้อมูลสมัครบัญชี</h1>
                    <div className="mb-10">
                        <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><MdEmail color="#5c7cfa" size={30} />Email</span>
                        <input type="email" placeholder="อีเมลของคุณ" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                        <div>
                            <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><LuLockKeyhole color="#5c7cfa" size={30} />รหัสผ่าน</span>
                            <input type="password" placeholder="รหัสผ่าน" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                        <div>
                            <span className="flex items-center gap-3 mb-2 text-[1.3rem]"><LuLockKeyhole color="#5c7cfa" size={30} />ยืนยันรหัสผ่าน</span>
                            <input type="password" placeholder="ยืนยันรหัสผ่าน" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end items-end px-5">
                    <button onClick={onNext} className="flex justify-center items-center border rounded-2xl text-[1.5rem] text-white bg-blue-600 px-10 py-3 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]">ต่อไป <GrFormNextLink /></button>
                </div>
            </div>
        </div>
    )
}

export default StateOne;