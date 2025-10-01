import { IoSearchOutline, IoClose } from "react-icons/io5";
import { IoIosEye } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { useState } from "react";

function User(){
    const [Popup, setPopup] = useState(false);
    return(
        <div className="px-10 py-5 bg-[#f2f2f2]">
            <h1 className="text-[1.7rem] font-bold">จัดการผู้เช่า</h1>
            <p className="text-gray-500 mb-5">ดูรายชื่อผู้เช่าและสถานะการเช่า</p>
            <div className="flex flex-col w-full p-5 border border-gray-300 rounded-xl shadow-sm bg-white">
                <div className="flex justify-start gap-5 mb-10 w-full">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500 w-[50%]">
                        <IoSearchOutline className="text-gray-400 mr-3" size={20} />
                        <input type="serch" placeholder="ค้นหารายชื่อผู้เช่า" className="flex-1 outline-none text-gray-700" />
                    </div>
                    <button className="flex justify-center items-center px-5 rounded-xl bg-orange-500 text-white cursor-pointer transform transition duration-300 ease-in-out hover:bg-orange-700">ค้นหา</button>
                </div>
                <table className="w-full border-none rounded-lg overflow-hidden shadow-md">
                    <thead className="text-left bg-gray-50 text-gray-600 text-[1.1rem] font-semibold border-b border-t border-gray-200">
                        <tr>
                            <th className="px-4 py-3">ผู้เช่า</th>
                            <th className="px-4 py-3">บริษัท</th>
                            <th className="px-4 py-3">โกดัง</th>
                            <th className="px-4 py-3">วันเช่า</th>
                            <th className="px-4 py-3">สถานะ</th>
                            <th className="px-4 py-3">การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-[1rem]">
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium">
                                <p className="font-bold">Kittpich Hirunwong</p>
                                <p className="text-gray-600">PFFstorage@gmail.com</p>
                            </td>
                            <td className="px-4 py-3 text-start">พีเอฟเอฟ จำกัด</td>
                            <td className="px-4 py-3 text-start">โกดัง A</td>
                            <td className="px-4 py-3 text-start">01/01/2025 - 31/12/2025</td>
                            <td className="px-4 py-3 text-start">
                                <p className="flex justify-center items-center w-fit px-3 py-1 rounded-2xl bg-green-100 text-green-800">ใช้งานอยู่</p>
                            </td>
                            <td className="px-4 py-3 text-start">
                                <div className="flex items-center gap-4">
                                    <button className="relative flex items-center justify-center outline-none border-none cursor-pointer group">
                                        <span className="absolute left-1/2 -translate-x-1/2 px-2 py-1 whitespace-nowrap text-[12px] text-white bg-orange-500 rounded transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible -top-7">
                                            ดูสินค้า
                                        </span>
                                        <IoIosEye onClick={() => setPopup(true)} className="text-[1.5rem]" />
                                    </button>
                                    <button className="relative flex items-center justify-center outline-none border-none cursor-pointer group">
                                        <span className="absolute left-1/2 -translate-x-1/2 px-2 py-1 whitespace-nowrap text-[12px] text-white bg-red-500 rounded transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible -top-7">
                                            ลบ
                                        </span>
                                        <RiDeleteBin6Line className="text-[1.5rem]" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                { Popup && (
                    <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-start w-[50%] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100">
                        <div className="flex justify-between items-center w-full px-5 mb-5">
                            <h1 className="text-[1.5rem] font-bold">รายการสินค้า - บริษัทพีเอฟเอฟ จำกัด</h1>
                            <IoClose onClick={() => setPopup(false)} size={30} className="text-gray-600 cursor-pointer transition duration-200 ease-in-out hover:text-red-600" />
                        </div>
                        <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                        <div className="w-full">
                            <div className="pl-5 pr-11 mb-3 flex justify-between">
                                <h1 className="font-semibold text-[1.3rem]">ข้อมูลผู้เช่า</h1>
                                <button className="flex justify-center items-center gap-3 px-5 py-2 bg-yellow-300 border border-yellow-50 rounded-xl shadow-sm shadow-yellow-50 cursor-pointer transition duration-200 ease-in-out hover:bg-yellow-400"><LuPencil />แก้ไข</button>
                            </div>
                            <div className="grid grid-cols-3 gap-5 bg-gray-100 px-5 py-3 w-[90%] mx-auto rounded-2xl">
                                <div>
                                    <p className="text-gray-600">ชื่อ - นามสกุล</p>
                                    <p className="text-[1.1rem]">Kittipich Hirunwong</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">บริษัท</p>
                                    <p className="text-[1.1rem]">พีเอฟเอฟ จำกัด</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">อีเมล</p>
                                    <p className="text-[1.1rem]">PFFStorage@gmail.com</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">ชื่อโกดัง</p>
                                    <p className="text-[1.1rem]">โกดัง A</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">จำนวนห้อง</p>
                                    <p className="text-[1.1rem]">20</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">โทรศัพท์</p>
                                    <p className="text-[1.1rem]">087-716-0351</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">วันเริ่มต้น - สิ้นสุด</p>
                                    <p className="text-[1.1rem]">01/01/2025 - 31/12/2025</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">สถานะ</p>
                                    <p className="text-[1.1rem]">กำลังใช้งาน</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default User;