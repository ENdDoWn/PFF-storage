import { IoMdCheckmarkCircleOutline, IoMdPerson } from "react-icons/io";
import { CgCloseO } from "react-icons/cg";
import { FaBuilding, FaWarehouse } from "react-icons/fa6";
import { FaCalendar, FaQrcode } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { useState } from "react";

import bank from "../../assets/kbank.jpg"

function Approve(){
    const [Popup, setPopup] = useState(false);
    return(
        <div className="px-10 py-5 bg-[#f2f2f2]">
            <h1 className="text-[1.7rem] font-bold">การอนุมัติการจอง</h1>
            <p className="text-gray-500 mb-5">จัดการคำขอยืมโกดังจากลูกค้า</p>
            <div className="grid grid-cols-3 gap-5">
                <div className="flex flex-col border border-gray-200 rounded-xl shadow-sm p-7 bg-white gap-5">
                    <div className="flex justify-between">
                        <h1 className="text-[1.3rem] font-semibold">สัญญาเช่าโกดัง A</h1>
                        <p className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-xl">รออนุมัติ</p>
                    </div>
                    <p className="flex justify-start items-center gap-3 text-gray-600"><IoMdPerson /> Kittipich Hirunwong</p>
                    <p className="flex justify-start items-center gap-3 text-gray-600"><FaBuilding /> บริษัทพีเอฟเอฟ จำกัด</p>
                    <p className="flex justify-start items-center gap-3 text-gray-600"><FaWarehouse /> โกดัง A (5,000 ตร.ม.)</p>
                    <p className="flex justify-start items-center gap-3 text-gray-600"><FaCalendar /> 01/01/2025 - 31/12/2025</p>
                    <div className="w-full flex justify-center items-center gap-5">
                        <button className="flex justify-center items-center gap-3 w-full py-2 text-white text-[1.2rem] bg-[#4658b2] border rounded-2xl shadow-sm cursor-pointer hover:bg-[#2f44af]"><IoMdCheckmarkCircleOutline /> อนุมัติ</button>
                        <button className="flex justify-center items-center gap-3 w-full py-2 text-white text-[1.2rem] bg-red-500 border rounded-2xl shadow-sm cursor-pointer hover:bg-red-700"><CgCloseO /> ปฏิเสธ</button>
                    </div>
                    <button onClick={() => setPopup(true)} className="flex justify-center items-center gap-3 w-full py-2 text-white text-[1.2rem] bg-teal-500 border rounded-2xl shadow-sm cursor-pointer hover:bg-teal-700"><FaQrcode /> ดูสลิปชำระเงิน</button>
                </div>
            </div>
            { Popup && (
                <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-center w-[30%] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="w-full flex justify-end pr-5 pb-3">
                        <IoClose onClick={() => setPopup(false)} size={30} className="text-gray-600 cursor-pointer transition duration-200 ease-in-out hover:text-red-600" />
                    </div>
                    <img src={bank} className="w-[80%] h-auto" />
                </div>
            )}
        </div>
    )
}

export default Approve;