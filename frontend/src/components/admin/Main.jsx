import { FaWarehouse, FaBell } from "react-icons/fa6";
import { MdPeople } from "react-icons/md";
import { FaMoneyCheck } from "react-icons/fa";
import { IoAdd, IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useState } from "react";

function Main(){
    const [Popup, setPopup] = useState("");
    const [Warehouse, setWarehouse] = useState({
        name: "",
        location: "",
        area: "",
        rooms: ""
    });

    return(
        <div className="px-10 py-5 w-full bg-[#f2f2f2]">
            <div className="flex flex-col justify-center items-start mb-10">
                <h1 className="text-[1.7rem] font-bold">Dashboard</h1>
                <p className="text-gray-500 mb-5">ภาพรวมของระบบจัดเก็บข้อมูล PFF Storage</p>
                <div className="grid grid-cols-4 gap-5 w-full">
                    <div className="flex flex-col justify-start items-start gap-5 py-3 px-5 border border-gray-100 rounded-2xl shadow-sm bg-white">
                        <div className="flex justify-start items-start gap-5">
                            <p className="text-[2rem] text-blue-800 bg-blue-100 p-3 rounded-xl"><FaWarehouse /></p>
                            <div className="flex flex-col justify-center items-start w-full">
                                <span className="text-gray-500">จำนวนโกดังทั้งหมด</span>
                                <h1 className="text-[1.5rem] font-bold">100</h1>
                            </div>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                            <p className="flex justify-between w-full px-2 text-gray-600">
                                <span>โกดังที่ว่าง</span>
                                <span>5</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-5 py-3 px-5 border border-gray-100 rounded-2xl shadow-sm bg-white">
                        <div className="flex justify-start items-start gap-5">
                            <p className="text-[2rem] text-green-800 bg-green-100 p-3 rounded-xl"><MdPeople /></p>
                            <div className="flex flex-col justify-center items-start w-full">
                                <span className="text-gray-500">ผู้เช่าทั้งหมด</span>
                                <h1 className="text-[1.5rem] font-bold">37</h1>
                            </div>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                            <p className="flex justify-between w-full px-2 text-gray-600">
                                <span className="text-green-300">ใหม่เดือนนี้</span>
                                <span className="text-green-500">+5</span>
                            </p>
                            <p className="flex justify-between w-full px-2 text-gray-600">
                                <span className="text-red-300">หมดสัญญา</span>
                                <span className="text-red-500">-5</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-5 py-3 px-5 border border-gray-100 rounded-2xl shadow-sm bg-white">
                        <div className="flex justify-start items-start gap-5">
                            <p className="text-[2rem] text-purple-800 bg-purple-100 p-3 rounded-xl"><FaMoneyCheck /></p>
                            <div className="flex flex-col justify-center items-start w-full">
                                <span className="text-gray-500">รายได้เดือนนี้</span>
                                <h1 className="text-[1.5rem] font-bold">฿150,000</h1>
                            </div>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-5 py-3 px-5 border border-gray-100 rounded-2xl shadow-sm bg-white">
                        <div className="flex justify-start items-start gap-5">
                            <p className="text-[2rem] text-red-800 bg-red-100 p-3 rounded-xl"><FaBell /></p>
                            <div className="flex flex-col justify-center items-start w-full">
                                <span className="text-gray-500">รออนุมัติ</span>
                                <h1 className="text-[1.5rem] font-bold">3</h1>
                            </div>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-[1.7rem] font-bold">จัดการคลังสินค้า</h1>
                <p className="text-gray-500 mb-5">ดูพื้นที่ว่างและสถานะของแต่ละโกดัง</p>
                <div className="flex flex-col w-full p-5 border border-gray-300 rounded-xl shadow-sm bg-white">
                    <div className="flex justify-between mb-10">
                        <p className="flex flex-col">
                            <span className="text-[1.5rem]">รายการคลังสินค้า</span>
                            <span className="text-gray-500">จัดการและดูข้อมูลคลังสินค้าทั้งหมด</span>
                        </p>
                        <button onClick={() => setPopup("add")} className="flex justify-center items-center gap-3 rounded-xl px-5 bg-orange-500 shadow-sm text-[1.2rem] text-white font-medium transition duration-300 ease-in-out hover:bg-orange-600 cursor-pointer"><IoAdd size={20} />เพิ่มคลังสินค้า</button>
                    </div>
                    <table className="w-full border-none rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-gray-50 text-gray-600 text-[1.1rem] font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-center">ชื่อคลัง</th>
                                <th className="px-4 py-3 text-center">ที่ตั้ง</th>
                                <th className="px-4 py-3 text-center">พื้นที่</th>
                                <th className="px-4 py-2 text-center">จำนวนห้อง</th>
                                <th className="px-4 py-3 text-center">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-[1rem]">
                            <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-center font-medium">โกดัง A</td>
                                <td className="px-4 py-3 flex justify-center items-center gap-2"><CiLocationOn /> บางนา, กรุงเทพฯ</td>
                                <td className="px-4 py-3 text-center">5,000 ตร.ม.</td>
                                <td className="px-4 py-3 text-center">20</td>
                                <td className="px-4 py-3 flex justify-center items-center gap-4">
                                    <button className="p-2 text-[1.2rem] text-gray-500 hover:bg-orange-500 hover:text-white rounded-md transition"
                                        onClick={() => {setWarehouse({
                                            name: "โกดัง A",
                                            location: "บางนา, กรุงเทพ",
                                            area: "5,000 ตร.ม.",
                                            rooms: "20"
                                        }); setPopup("edit");}}>
                                        <LuPencil />
                                    </button>
                                    <button className="p-2 text-[1.2rem] text-gray-500 hover:bg-red-500 hover:text-white rounded-md transition"><RiDeleteBin6Line /></button>
                                </td>
                            </tr>

                            <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-center font-medium">โกดัง B</td>
                                <td className="px-4 py-3 flex justify-center items-center gap-2"><CiLocationOn /> ศรีราชา, ชลบุรี</td>
                                <td className="px-4 py-3 text-center">8,000 ตร.ม.</td>
                                <td className="px-4 py-3 text-center">30</td>
                                <td className="px-4 py-3 flex justify-center items-center gap-4">
                                  <button onClick={() => setPopup("edit")} className="p-2 text-[1.2rem] text-gray-500 hover:bg-orange-500 hover:text-white rounded-md transition"><LuPencil /></button>
                                  <button className="p-2 text-[1.2rem] text-gray-500 hover:bg-red-500 hover:text-white rounded-md transition"><RiDeleteBin6Line /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            { Popup === "add" && (
                <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-start w-[30%] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100">
                    <div className="flex justify-between items-center w-full px-5 mb-5">
                        <h1 className="text-[1.5rem] font-bold">เพิ่มคลังสินค้าใหม่</h1>
                        <IoClose onClick={() => setPopup()} size={30} className="text-gray-600 cursor-pointer transition duration-200 ease-in-out hover:text-red-600" />
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="px-5 w-full">
                        <div className="pb-5 w-full">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">ชื่อโกดัง</span>
                            <input type="text" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">สถานที่ตั้ง</span>
                            <input type="text" placeholder="เช่น บางนา, กรุงเทพ" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">พื้นที่</span>
                            <input type="text" placeholder="กรุณาใส่แค่ตัวเลข เช่น 8000" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">จำนวนห้อง</span>
                            <input type="text" placeholder="กรุณาใส่แค่ตัวเลข เช่น 10" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="w-full flex justify-end items-center gap-5 px-5">
                        <button onClick={() => setPopup()} className="flex justify-center items-center border border-orange-600 rounded-2xl text-[1.3rem] text-orange-600 bg-white px-5 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]">ยกเลิก</button>
                        <button onClick={() => setPopup()} className="flex justify-center items-center border rounded-2xl text-[1.3rem] text-white bg-orange-500 px-10 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]">เพิ่มโกดัง</button>
                    </div>
                </div>
            )}
            { Popup === "edit" && (
                <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-start w-[30%] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100">
                    <div className="flex justify-between items-center w-full px-5 mb-5">
                        <h1 className="text-[1.5rem] font-bold">แก้ไขคลังสินค้า</h1>
                        <IoClose onClick={() => setPopup()} size={30} className="text-gray-600 cursor-pointer transition duration-200 ease-in-out hover:text-red-600" />
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="px-5 w-full">
                        <div className="pb-5 w-full">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">ชื่อโกดัง</span>
                            <input type="text" value={Warehouse.name} onChange={(e) => setWarehouse({ ...Warehouse, name: e.target.value })} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]"/>
                        </div>
                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">สถานที่ตั้ง</span>
                            <input type="text" value={Warehouse.location} onChange={(e) => setWarehouse({ ...Warehouse, location: e.target.value })} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]"/>
                        </div>
                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">พื้นที่</span>
                            <input type="text" value={Warehouse.area} onChange={(e) => setWarehouse({ ...Warehouse, area: e.target.value })} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]"/>
                        </div>
                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">จำนวนห้อง</span>
                            <input type="text" value={Warehouse.rooms} onChange={(e) => setWarehouse({ ...Warehouse, rooms: e.target.value })} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]"/>
                        </div>
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="w-full flex justify-end items-center gap-5 px-5">
                        <button onClick={() => setPopup()} className="flex justify-center items-center border border-orange-600 rounded-2xl text-[1.3rem] text-orange-600 bg-white px-5 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]">ยกเลิก</button>
                        <button onClick={() => setPopup()} className="flex justify-center items-center border rounded-2xl text-[1.3rem] text-white bg-orange-500 px-10 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]">แก้ไข</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Main;