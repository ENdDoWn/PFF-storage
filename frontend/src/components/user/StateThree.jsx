import { GrFormPreviousLink } from "react-icons/gr";
import { RiBankCardFill } from "react-icons/ri";
import { FaQrcode, FaRegCopy, FaCheckCircle } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { IoMdCloudUpload } from "react-icons/io";

import qrcode from '../../assets/qrcode.png'

import { useState } from "react";
import { Link } from "react-router-dom";

function StateThree({ onBack, onNext }){
    const [FileName, setFileName] = useState("");
    const [Tab, setTab] = useState("qr");
    const [Copy, setCopy] = useState(false);
    const account_number = "123-4-56789-0";

    const FileSelect = (e) => {
        const file = e.target.files[0];
        setFileName("ไฟล์: " + file.name);
    };

    const copy = () =>{
        navigator.clipboard.writeText(account_number);
        setCopy(true);
        setTimeout(() => setCopy(false), 500);
    };

    return(
        <div className="pt-[80px] flex flex-col items-center gap-10 font-Montserrat">
            <div className="flex gap-5 w-full max-w-[800px]">
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-[#f4f6f7] shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-[#b3bec3] text-white text-[1.5rem] font-bold">1</button>
                    <p className="text-[#b3bec3] text-[1rem] font-semibold">ลงทะเบียน</p>
                </div>
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-[#f4f6f7] shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-[#b3bec3] text-white text-[1.5rem] font-bold">2</button>
                    <p className="text-[#b3bec3] text-[1rem] font-semibold">เลือกห้องที่จะเช่า</p>
                </div>
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-blue-600 shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-white text-blue-600 text-[1.5rem] font-bold">3</button>
                    <p className="text-white text-[1rem] font-semibold">ชำระเงิน</p>
                </div>
            </div>
            <div className="flex flex-col items-center w-[60%]">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="flex items-center gap-3 text-[2rem] font-bold text-[#3b5bdb]"><RiBankCardFill className="text-[2.5rem]" />ชำระเงิน</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#3b5bdb] to-[#74c0fc] rounded-full mt-2"></div>
                </div>
                <div className="w-[50%] flex flex-col justify-center items-center my-10 py-5 border-none rounded-xl bg-[#f8f9fa] shadow-sm">
                    <h1 className="text-[2rem] text-[#3b5bdb] font-bold mb-3">฿ 24,300</h1>
                    <p className="text-[1.2rem] text-gray-500">เลขที่คำสั่งซื้อ: PFF-2025-0001</p>
                </div>
                <div className="w-full mb-10">
                    <div>
                        <div className="grid grid-cols-2 mb-5">
                            <button onClick={() => setTab("qr")} className={`flex justify-center items-center gap-2 py-3 text-[1.3rem] rounded-sm  ${Tab === "qr" ? "text-[#3b5bdb] border-b-4" : "border-b border-[#b3bec3]"}`}>
                                <FaQrcode /> QR Code
                            </button>
                            <button onClick={() => setTab("bank")} className={`flex justify-center items-center gap-2 py-3 text-[1.3rem] rounded-sm ${Tab === "bank" ? "text-[#3b5bdb] border-b-4" : "border-b border-[#b3bec3]"}`}>
                                <BsBank2 /> โอนผ่านธนาคาร
                            </button>
                        </div>
                        
                        {Tab === "qr" && (
                            <div className="flex flex-col justify-center items-center border border-[#e2e8f0] rounded-xl shadow-sm mt-10 p-10">
                                <h1 className="flex justify-center items-center gap-3 mb-3 text-[2rem]"><FaQrcode /> แสกน QR Code เพื่อชำระเงิน</h1>
                                <img src={qrcode} className="w-42 h-42 mb-3" />
                                <p className="text-[1rem] text-[#858585]">ใช้แอปพลิเคชันธนาคารบนมือถือสแกน QR Code เพื่อชำระเงิน</p>
                                <div className="flex flex-col justify-center items-center mt-5">
                                    <span className="text-[1.2rem] font-bold mb-3">ส่งหลักฐานการชำระเงิน:</span>
                                    <label htmlFor="file" className="h-[200px] w-[300px] flex flex-col items-center justify-center gap-5 cursor-pointer border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] p-6 rounded-lg shadow-[0px_48px_35px_-48px_rgba(0,0,0,0.1)]">
                                        <IoMdCloudUpload size={60} color="#2563eb" />
                                        <span className="font-normal text-gray-600">คลิกเพื่ออัปโหลดสลิปชำระเงิน</span>
                                        <input type="file" id="file" className="hidden" onChange={FileSelect} />
                                    </label>
                                    {FileName && (
                                        <div className="font-semibold text-[1.2rem] text-[#10b981] mt-5">{FileName}</div>
                                    )}
                                </div>
                            </div>
                        )}
                        {Tab === "bank" && (
                            <div className="border border-[#e2e8f0] rounded-xl shadow-sm mt-10 py-10">
                                <h1 className="flex justify-center items-center gap-3 text-[2rem]"><BsBank2 /> ชำระเงินผ่านบัญชีธนาคาร</h1>
                                <div className="border-none rounded-xl mx-10 mt-10 bg-gray-50 shadow-sm">
                                    <div className="flex justify-between p-5">
                                        <p>ธนาคาร:</p>
                                        <p>กรุงเทพ</p>
                                    </div>
                                    <hr className="h-[1px] w-[95%] mx-auto bg-[#dee1e4] border-0" />
                                    <div className="flex justify-between p-5">
                                        <p>ชื่อบัญชี:</p>
                                        <p>บริษัทพีเอฟเอฟ จำกัด</p>
                                    </div>
                                    <hr className="h-[1px] w-[95%] mx-auto bg-[#dee1e4] border-0" />
                                    <div className="flex justify-between p-5">
                                        <p>เลขที่บัญชี:</p>
                                        <p className="flex justify-center items-center gap-2">{account_number} <button className="cursor-pointer hover:scale-110" onClick={copy}>{Copy ? <FaCheckCircle size={20} /> : <FaRegCopy />}</button></p>
                                    </div>
                                    <hr className="h-[1px] w-[95%] mx-auto bg-[#dee1e4] border-0" />
                                    <div className="flex justify-between p-5">
                                        <p>ประเภทบัญชี:</p>
                                        <p>ออมทรัพย์</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center mt-5">
                                    <span className="text-[1.2rem] font-bold mb-3">ส่งหลักฐานการชำระเงิน:</span>
                                    <label htmlFor="file" className="h-[200px] w-[300px] flex flex-col items-center justify-center gap-5 cursor-pointer border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] p-6 rounded-lg shadow-[0px_48px_35px_-48px_rgba(0,0,0,0.1)]">
                                        <IoMdCloudUpload size={60} color="#2563eb" />
                                        <span className="font-normal text-gray-600">คลิกเพื่ออัปโหลดสลิปชำระเงิน</span>
                                        <input type="file" id="file" className="hidden" onChange={FileSelect} />
                                    </label>
                                    {FileName && (
                                        <div className="font-semibold text-[1.2rem] text-[#10b981] mt-5">{FileName}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full flex justify-between items-end px-5 mb-10">
                    <button onClick={onBack} className="flex justify-center items-center border border-blue-600 rounded-2xl text-[1.5rem] text-blue-600 bg-white px-10 py-3 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(37,99,235,0.3)] hover:bg-blue-50 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]"><GrFormPreviousLink /> ย้อนกลับ</button>
                    <Link to="/"><button onClick={onNext} className="flex justify-center items-center border rounded-2xl text-[1.5rem] text-white bg-orange-500 px-10 py-3 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]">ยืนยัน</button></Link>
                </div>
            </div>
        </div>
    )
}

export default StateThree;