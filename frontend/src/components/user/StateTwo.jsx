import { FaWarehouse } from "react-icons/fa6";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { FaDoorOpen } from "react-icons/fa";

import { useState } from "react";

function StateTwo({ onBack, onNext }){
    const [Rent, setRent] = useState();
    const [CustomTime, setCustomTime] = useState("");

    return(
        <div className="pt-[80px] flex flex-col items-center gap-10 font-Montserrat">
            <div className="flex gap-5 w-full max-w-[800px]">
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-[#f4f6f7] shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-[#b3bec3] text-white text-[1.5rem] font-bold">1</button>
                    <p className="text-[#b3bec3] text-[1rem] font-semibold">ลงทะเบียน</p>
                </div>
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-blue-600 shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-white text-blue-600 text-[1.5rem] font-bold">2</button>
                    <p className="text-white text-[1rem] font-semibold">เลือกห้องที่จะเช่า</p>
                </div>
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-[#f4f6f7] shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-[#b3bec3] text-white text-[1.5rem] font-bold">3</button>
                    <p className="text-[#b3bec3] text-[1rem] font-semibold">ชำระเงิน</p>
                </div>
            </div>
            <div className="flex flex-col items-center w-[60%]">
                <div className="flex flex-col justify-center items-center mb-10">
                    <h1 className="flex items-center gap-3 text-[2rem] font-bold text-[#3b5bdb]"><FaWarehouse className="text-[2.5rem]" />เลือกห้องที่จะเช่า</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#3b5bdb] to-[#74c0fc] rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-1 gap-5 w-full mb-10">
                    <div className="w-full border border-[#e2e8f0] rounded-2xl px-10 py-6 mb-10 transition duration-300 ease-in-out shadow-sm hover:border-[#3b5bdb] hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]">
                        <h1 className="flex justify-start items-center gap-3 text-[1.7rem] text-[#3b5bdb] font-bold mb-5"><FaDoorOpen size={35} />รายละเอียดการเช่า</h1>
                        <div className="flex flex-col justify-center mb-5">
                            <span className="text-[1.2rem] mb-2">จำนวนห้องที่จะเช่า</span>
                            <input type="text" className="border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                        <div className="flex flex-col justify-center mb-5">
                            <span className="text-[1.2rem] mb-2">ระยะเวลาการเช่า</span>
                            <div className="w-full flex flex-col justify-center items-center gap-4">
                                <select value={Rent} onChange={(e) => setRent(e.target.value)} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] text-gray-800 px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]">
                                    <option selected> --- กรุณาเลือกระยะเวลาการเช่า --- </option>
                                    <option>3 เดือน</option>
                                    <option>6 เดือน</option>
                                    <option>12 เดือน</option>
                                    <option>24 เดือน</option>
                                    <option value="other">อื่น ๆ</option>
                                </select>
                                { Rent === "other" && (
                                    <input type="text" placeholder="กรุณากำหนดระยะเวลาเช่าเป็นจำนวนเดือน" value={CustomTime} onChange={(e) => setCustomTime(e.target.value)} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center mb-5">
                            <span className="text-[1.2rem] mb-2">วันเริ่มต้นเช่า</span>
                            <input type="date" className="border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                    </div>
                    <div className="w-full bg-[#f8f9fa] rounded-2xl px-10 py-6 flex flex-col">
                        <h1 className="flex items-center justify-center text-[1.7rem] text-[#3b5bdb] font-bold">สรุปรายการเช่าซื้อ</h1>
                        <div className="flex justify-between mt-5 mb-2">
                            <p>โกดัง:</p>
                            <p>ศูนย์กระจายสินค้าพระราม 9</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>จำนวนห้อง:</p>
                            <p>2 ห้อง</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>ราคาต่อเดือน:</p>
                            <p>4,500 บาท</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>ระยะเวลาเช่า:</p>
                            <p>6 เดือน</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3 text-[1.3rem] font-semibold">
                            <p>รวมทั้งหมด:</p>
                            <p>24,300 บาท</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-between items-end px-5 mb-10">
                    <button onClick={onBack} className="flex justify-center items-center border border-blue-600 rounded-2xl text-[1.5rem] text-blue-600 bg-white px-10 py-3 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(37,99,235,0.3)] hover:bg-blue-50 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]"><GrFormPreviousLink /> ย้อนกลับ</button>
                    <button onClick={onNext} className="flex justify-center items-center border rounded-2xl text-[1.5rem] text-white bg-blue-600 px-10 py-3 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]">ต่อไป <GrFormNextLink /></button>
                </div>
            </div>
        </div>
    )
}

export default StateTwo;