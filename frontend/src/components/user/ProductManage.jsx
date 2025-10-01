import { IoAdd, IoClose } from "react-icons/io5";
import { FaBoxes, FaWarehouse, FaExclamationTriangle, FaShippingFast } from "react-icons/fa";
import { LuAsterisk } from "react-icons/lu";

import { useState } from "react";


function ProductManage(){
    const [Edit, setEdit] = useState(false);
    const [Status, setStatus] = useState("คงคลัง");
    const [Popup, setPopup] = useState(false);
    const [Unit, setUnit] = useState("กก.");
    const [CustomUnit, setCustomUnit] = useState("");

    const StatusColors = {
        "คงคลัง": "bg-green-200 text-green-800",
        "ใกล้หมดอายุ": "bg-yellow-200 text-yellow-800",
        "ส่งออกแล้ว": "bg-red-200 text-red-800",
    };
    const stock = [
        {
            title: "จำนวนสินค้าทั้งหมดในโกดัง",
            value: "10,000",
            icon: <FaBoxes className="text-blue-500" />,
            color: "from-blue-400 to-blue-600",
            progress: 100,
            description: "สินค้าทั้งหมด"
        },
        {
            title: "จำนวนสินค้าในคลัง",
            value: "5,000",
            icon: <FaWarehouse className="text-green-500" />,
            color: "from-green-400 to-green-600",
            progress: 50,
            description: "50% ของสินค้าทั้งหมด"
        },
        {
            title: "จำนวนสินค้าที่ใกล้หมดอายุ",
            value: "1,000",
            icon: <FaExclamationTriangle className="text-yellow-500" />,
            color: "from-yellow-400 to-yellow-600",
            progress: 10,
            description: "10% ของสินค้าทั้งหมด"
        },
        {
            title: "จำนวนสินค้าที่ส่งออกแล้ว",
            value: "5,000",
            icon: <FaShippingFast className="text-red-500" />,
            color: "from-red-400 to-red-600",
            progress: 50,
            description: "50% ของสินค้าทั้งหมด"
        }
    ];

    return(
        <div className="pt-[80px] w-full h-full bg-[#f2f2f2] py-5 font-Montserrat">
            <div className="px-10 py-5">
                <p className="text-[1.4rem] font-semibold mx-2 my-1">User Information</p>
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-10 pt-5 pb-3">
                    <div className="pb-5">
                        <p className="text-[2.5rem] font-bold">Kittpich Hirunwong</p>
                        <p className="tet-[1.3rem]">สิ้นสุดการเช่า: 31-12-2025</p>
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        <p className="flex flex-col">
                            <span className="text-[1rem]">Organization</span>
                            <span className="text-[1rem] text-[#78b5ff] font-semibold">บริษัทพีเอฟเอฟ จำกัด</span>
                        </p>
                        <div className="flex gap-5">
                            <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                            <p className="flex flex-col">
                                <span className="text-[1rem]">location</span>
                                <span className="text-[1rem] text-[#78b5ff] font-semibold">1 ซอย ฉลองกรุง 1 แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพมหานคร 10520</span>
                            </p>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                            <p className="flex flex-col">
                                <span className="text-[1rem]">Mobile</span>
                                <span className="text-[1rem] text-[#78b5ff] font-semibold">087-716-0351</span>
                            </p>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                            <p className="flex flex-col">
                                <span className="text-[1rem]">Email</span>
                                <span className="text-[1rem] text-[#78b5ff] font-semibold">PFFstorage@gmail.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-10 py-5">
                <p className="text-[1.4rem] font-semibold mx-2 my-1">Stock</p>
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-10 py-5">
                    <div className="flex justify-center items-center w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            {stock.map((item, index) => (
                                <div key={index} className="relative flex flex-col p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-2 transform transition-all duration-300 ease-in-out overflow-hidden group">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div className="p-3 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-300">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.description}</span>
                                    </div>
                                    
                                    <div className="mb-4 relative z-10">
                                        <h1 className="text-3xl font-bold text-gray-800 mb-1">{item.value}</h1>
                                        <p className="text-gray-600 text-sm">{item.title}</p>
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>ความคืบหน้า</span>
                                            <span>{item.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-10 py-5">
                <p className="text-[1.4rem] font-semibold mx-2 my-1">All Products</p>
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-10 py-5">
                    <div className="w-full flex justify-end mb-5">
                        <button onClick={() => setPopup(true)} className="flex justify-center items-center gap-3 rounded-xl px-5 py-2 bg-orange-500 shadow-sm text-[1.3rem] text-white font-medium transition duration-300 ease-in-out hover:bg-orange-600 cursor-pointer"><IoAdd size={25} />เพิ่มสินค้า</button>
                    </div>
                    <table className="w-full border-none rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-blue-500 text-white text-[1.1rem]">
                            <tr>
                                <th className="px-4 py-2 text-center">ID</th>
                                <th className="px-4 py-2 text-center">ชื่อสินค้า</th>
                                <th className="px-4 py-2 text-center">วันสินค้าเข้า</th>
                                <th className="px-4 py-2 text-center">วันหมดอายุ</th>
                                <th className="px-4 py-2 text-center">จำนวนคงเหลือ</th>
                                <th className="px-4 py-2 text-center">รายละเอียด</th>
                                <th className="px-4 py-2 text-center">สถานะ</th>
                                <th className="px-4 py-2 text-center">จัดการสินค้า</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-blue-50 odd:bg-white even:bg-gray-100">
                                <td className="px-4 py-2 text-center">001</td>
                                <td className="px-4 py-2 text-center">เนื้อหมู</td>
                                <td className="px-4 py-2 text-center">2025-01-30</td>
                                <td className="px-4 py-2 text-center">2025-02-06</td>
                                <td className="px-4 py-2 text-center">50 กก.</td>
                                <td className="px-4 py-2 text-center">ตัดแต่งแล้ว</td>
                                <td className="px-4 py-2 text-center">
                                    {Edit ? (
                                        <select value={Status} onChange={(e) => setStatus(e.target.value)} className="px-2 py-1 border border-gray-300 rounded">
                                            <option value="คงคลัง">คงคลัง</option>
                                            <option value="ใกล้หมดอายุ">ใกล้หมดอายุ</option>
                                            <option value="ส่งออกแล้ว">ส่งออกแล้ว</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${StatusColors[Status]}`}>{Status}</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-center space-x-2">
                                    {Edit ? (
                                        <button onClick={() => setEdit(false)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">บันทึก</button>
                                    ) : (
                                        <button onClick={() => setEdit(true)} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 cursor-pointer">แก้ไข</button>
                                    )}
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">ลบสินค้า</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            { Popup && (
                <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-start w-[30%] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100">
                    <div className="flex justify-between items-center w-full px-5 mb-5">
                        <h1 className="text-[1.5rem] font-bold">เพิ่มสินค้าใหม่</h1>
                        <IoClose size={30} className="text-gray-600 cursor-pointer" onClick={() => setPopup(false)} />
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="mx-5">
                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">ชื่อสินค้า<LuAsterisk color="red" size={15} /></span>
                            <input type="text" placeholder="กรุณากรอกชื่อสินค้า" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                            <div>
                                <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">วันที่สินค้าเข้า<LuAsterisk color="red" size={15} /></span>
                                <input type="date" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                            </div>
                            <div>
                                <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">วันที่หมดอายุ<LuAsterisk color="red" size={15} /></span>
                                <input type="date" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-5">
                            <div>
                                <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">จำนวน<LuAsterisk color="red" size={15} /></span>
                                <input type="text" placeholder="0.00" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                            </div>
                            <div>
                                <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">หน่วย<LuAsterisk color="red" size={15} /></span>
                                <div className="flex flex-col justify-center items-center gap-4">
                                    <select value={Unit} onChange={(e) => setUnit(e.target.value)} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]">
                                        <option selected>กก.</option>
                                        <option>กรัม</option>
                                        <option>ลัง</option>
                                        <option>ถุง</option>
                                        <option>ขวด</option>
                                        <option value="other">อื่น ๆ</option>
                                    </select>
                                    { Unit === "other" && (
                                        <input type="text" placeholder="กรุณาใส่หน่วยที่ต้องการ" value={CustomUnit} onChange={(e) => setCustomUnit(e.target.value)} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <span className="flex items-center gap-3 mb-2 text-[1.1rem] text-gray-600">รายละเอียดสินค้าเพิ่มเติม (ถ้ามี)</span>
                            <textarea placeholder="กรอกรายละเอียดของสินค้า (ถ้ามี)" className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]"></textarea>
                        </div>
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="w-full flex justify-end items-center gap-5 px-5">
                        <button onClick={() => setPopup(false)} className="flex justify-center items-center border border-blue-600 rounded-2xl text-[1.3rem] text-blue-600 bg-white px-5 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(37,99,235,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]">cancel</button>
                        <button onClick={() => setPopup(false)} className="flex justify-center items-center border rounded-2xl text-[1.3rem] text-white bg-orange-500 px-10 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]">add</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductManage;