import warehouse1 from '../../assets/bg-warehouse-1.jpg'

import { Link } from "react-router-dom";
import { FaWarehouse } from "react-icons/fa";

function AllWarehouse(){
    const room = 19;
    const room_total = 20;
    const percent = (room/room_total)*100;

    return(
        <div className="pt-[80px] flex flex-col items-center gap-10 font-Montserrat">
            <div className="flex flex-col items-center justify-center">
                <h1 className="flex justify-center items-center gap-3 text-[3rem] text-[#2563eb]"><FaWarehouse />เลือกโกดังที่คุณต้องการเช่า</h1>
            </div>
            <div className="flex justify-center items-center rounded-xl shadow-md bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-[1200px] p-6">
                    <div className="flex flex-col">
                        <label htmlFor="size" className="text-gray-700 mb-1">ขนาดโกดัง</label>
                        <select className="px-3 py-3 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30">
                            <option value="all">ทั้งหมด</option>
                            <option value="small">ขนาดเล็ก (ต่ำกว่า 200 ตร.ม.)</option>
                            <option value="medium">ขนาดกลาง 200 - 500 ตร.ม.</option>
                            <option value="big">ขนาดใหญ่ (มากกว่า 500 ตร.ม.)</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="location" className="text-gray-700 mb-1">สถานที่ตั้ง</label>
                        <select className="px-3 py-3 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30">
                            <option value="all">ทั้งหมด</option>
                            <optgroup label="ภาคกลาง">
                                <option value="bangkok">กรุงเทพ</option>
                                <option value="nonthaburi">นนทบุรี</option>
                                <option value="nakhonpathom">นครปฐม</option>
                            </optgroup>
                            <optgroup label="ภาคตะวันออก">
                                <option value="chachoengsao">ฉะเชิงเทรา</option>
                                <option value="rayong">ระยอง</option>
                            </optgroup>
                            <optgroup label="ภาคตะวันออกเฉียงเหนือ">
                                <option value="khonkaen">ขอนแก่น</option>
                                <option value="nakhonratchasima">นครราชสีมา</option>
                            </optgroup>
                            <optgroup label="ภาคเหนือ">
                                <option value="chiangmai">เชียงใหม่</option>
                                <option value="lamphun">ลำพูน</option>
                            </optgroup>
                            <optgroup label="ภาคใต้">
                                <option value="songkhla">สงขลา</option>
                                <option value="suratthani">สุราษฎร์ธานี</option>
                                <option value="chumphon">ชุมพร</option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="price" className="text-gray-700 mb-1">ราคา</label>
                        <select className="px-3 py-3 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30">
                            <option value="all">ทั้งหมด</option>
                            <option>ต่ำกว่า 10,000 บาท</option>
                            <option>10,000 - 30,000 บาท</option>
                            <option>30,000 - 60,000 บาท</option>
                            <option>60,000 - 100,000 บาท</option>
                            <option>มากกว่า 100,000 บาท</option>
                        </select>
                    </div>
                </div>
                <div className="mr-6">
                    <label htmlFor="" className="text-white mb-5">sadasdw</label> {/* ใส่มาเฉย ๆ เอามาปรับตำแหน่ง */}
                    <button className="flex justify-center items-center px-5 py-2 mt-1 rounded-xl bg-orange-500 text-white cursor-pointer transform transition duration-300 ease-in-out hover:bg-orange-700 hover:-translate-y-0.5">ค้นหา</button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                <div className="flex flex-col justify-between items-center w-[200px] p-5 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition duration-300 hover:bg-gray-50">
                    <h1 className="text-blue-600 text-[2.5rem] font-bold">56</h1>
                    <p className="text-gray-600">โกดังทั้งหมด</p>
                </div>
                <div className="flex flex-col justify-between items-center w-[200px] p-5 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition duration-300 hover:bg-gray-50">
                    <h1 className="text-blue-600 text-[2.5rem] font-bold">32</h1>
                    <p className="text-gray-600">ว่าง</p>
                </div>
                <div className="flex flex-col justify-between items-center w-[200px] p-5 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition duration-300 hover:bg-gray-50">
                    <h1 className="text-blue-600 text-[2.5rem] font-bold">24</h1>
                    <p className="text-gray-600">กำลังเช่า</p>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6'>
                <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition duration-300">
                    <img src={warehouse1} alt="โกดัง A" className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <h1 className="text-xl font-semibold text-gray-800 mb-2">โกดัง A</h1>
                        <p className="text-gray-600">ขนาด 200 ตร.ม. | กรุงเทพฯ</p>
                        <p className="text-gray-800 font-bold mt-2">50,000 บาท/เดือน</p>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{room} ห้อง</span>
                                <span>{room_total} ห้อง</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-right">เหลือ {room}/{room_total}</p>
                        </div>
                        <Link to="/booking"><button className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-xl hover:bg-orange-700 transition duration-300">เลือกโกดังนี้</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllWarehouse;