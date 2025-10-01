import bgHome from '../../assets/bg-home-1.png'
import warehouse from '../../assets/bg-home-2.png'
import bgHome2 from '../../assets/bg-home-3.png'
import slide1 from '../../assets/bg-home-4.jpg'
import slide2 from '../../assets/bg-home-5.webp'
import slide3 from '../../assets/bg-home-6.jpg'
import slide4 from '../../assets/bg-home-7.jpg'
import slide5 from '../../assets/bg-home-8.jpeg'

import { IoIosArrowDropright } from "react-icons/io";
import { TbBuildingWarehouse } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import { PiClockCountdownLight } from "react-icons/pi";
import { GrDocumentTime } from "react-icons/gr";
import { BsBox2 } from "react-icons/bs";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { FaCheckCircle, FaLine } from "react-icons/fa";
import { MdPhone, MdOutlineEmail } from "react-icons/md";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ContentHome() {
    const slide = [slide1, slide2, slide3, slide4, slide5];
    const sequence = [0, 1, 2, 3, 4];
    const [SeqIndex, setSeqIndex] = useState(0);
    const time = useRef(null);

    const ResetTime = () => {
        if (time.current) clearInterval(time.current);
        time.current = setInterval(() => {NextSlide();}, 5000);
    };

    const PrevSlide = () => {
        setSeqIndex((prev) => (prev === 0 ? sequence.length - 1 : prev - 1));
        ResetTime();
    };

    const NextSlide = () => {
        setSeqIndex((prev) => (prev === sequence.length - 1 ? 0 : prev + 1));
        ResetTime();
    };

    useEffect(() => {
        ResetTime();
        return () => clearInterval(time.current);
    }, []);

    const currentSlideIndex = sequence[SeqIndex];

    return(
        <div>
            <section className="h-[70vh] bg-cover bg-center flex font-Montserrat z-10" style={{ backgroundImage: `url(${bgHome})` }}>
                <div className='w-full h-full flex justify-around items-center px-20'>
                    <div className='h-[50vh] flex flex-col justify-center mx-auto gap-3'>
                        <h1 className="text-[4vh] font-bold leading-[1.1]">PFF storage <br /> ระบบคลังสินค้าที่ครบจบในตัว</h1>
                        <p className='text-[2vh]'>เช็คสินค้าเรียลไทม์ จัดการคลัง เพิ่ม-ลบ-แก้ไขสินค้า ติดตามการเช่า ข้อมูลปลอดภัย ค้นหาง่าย</p>
                        <Link to="/login"><button className='flex justify-center items-center text-white text-[2vh] px-12 py-3 gap-2 rounded-full bg-gradient-to-r from-[#195CB9] to-[#117FD6] cursor-pointer'>เข้าสู่ระบบ <IoIosArrowDropright size={30} /></button></Link>
                    </div>
                    <img src={warehouse} className='w-[30%] h-[50vh]'/>
                </div>
            </section>

            <section className="h-[60vh] bg-cover bg-center flex font-Montserrat z-10">
                <div className="w-full h-full flex flex-col items-center gap-10 px-20 my-10">
                    <div className="flex flex-col items-center">
                        <h1 className="text-[5vh] font-bold">OUR SERVICES</h1>
                        <p className="text-[2.5vh]">บริการหลักของเรา</p>
                    </div>

                    <div className="grid grid-cols-5 gap-10 w-[75%]">
                        <div className="flex flex-col items-center justify-center border px-5 py-10 text-[1.7vh] min-h-[180px]">
                            <TbBuildingWarehouse size={50} />
                            <p className="mt-5 font-semibold text-center">Warehousing</p>
                            <p className="text-center text-gray-400">คลังสินค้า</p>
                        </div>

                        <div className="flex flex-col items-center justify-center border px-5 py-10 text-[1.7vh] min-h-[180px]">
                            <FiCheckCircle size={50} />
                            <p className="mt-5 font-semibold text-center">Rental status</p>
                            <p className="text-center text-gray-400">ตรวจสอบสถานะการเช่า</p>
                        </div>

                        <div className="flex flex-col items-center justify-center border px-5 py-10 text-[1.7vh] min-h-[180px]">
                            <PiClockCountdownLight size={50} />
                            <p className="mt-5 font-semibold text-center">Track real-time</p>
                            <p className="text-center text-gray-400">เช็คสถานะสินค้าแบบเรียลไทม์</p>
                        </div>

                        <div className="flex flex-col items-center justify-center border px-5 py-10 text-[1.7vh] min-h-[180px]">
                            <GrDocumentTime size={50} />
                            <p className="mt-5 font-semibold text-center">View product history</p>
                            <p className="text-center text-gray-400">บันทึกประวัติของสินค้า</p>
                        </div>

                        <div className="flex flex-col items-center justify-center border px-5 py-10 text-[1.7vh] min-h-[180px]">
                            <BsBox2 size={50} />
                            <p className="mt-5 font-semibold text-center">Manage Products</p>
                            <p className="text-center text-gray-400">จัดการสินค้า</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="h-[70vh] bg-cover bg-center flex items-center justify-center gap-20 font-Montserrat" style={{ backgroundImage: `url(${bgHome2})` }}>
                <div className='flex justify-start items-center gap-5 w-[40%] h-[60%]'>
                    <button onClick={PrevSlide} className="p-2 rounded-full cursor-pointer transform transition-transform duration-300 hover:scale-110"><CiCircleChevLeft size={40} /></button>
                    <div className="w-[90%] h-full overflow-hidden flex justify-center items-center ">
                        <img src={slide[currentSlideIndex]} className="w-full h-full object-cover transition-transform duration-300 ease-in-out" />
                    </div>
                    <button onClick={NextSlide} className="p-2 rounded-full cursor-pointer transform transition-transform duration-300 hover:scale-110"><CiCircleChevRight size={40} /></button>
                </div>
                <div className='flex flex-col items-start h-[60%]'>
                    <h1 className='text-[5vh] font-bold'>ตัวอย่างคลังสินค้า</h1>
                    <p className='text-[1.8vh] text-gray-400 mb-3'>คลังหลากหลาย ขนาดครบ จัดเก็บสินค้านานอย่างปลอดภัย มีระบบครบวงจร</p>
                    <p className='flex items-center gap-3 text-[2.3vh] mb-2'><FaCheckCircle color='green' size={25} /> ดูจำนวนสินค้าคงเหลือ</p>
                    <p className='flex items-center gap-3 text-[2.3vh] mb-2'><FaCheckCircle color='green' size={25} /> เพิ่ม ลบ แก้ไขข้อมูลสินค้า</p>
                    <p className='flex items-center gap-3 text-[2.3vh] mb-7'><FaCheckCircle color='green' size={25} /> ดูประวัติการเข้าออกของสินค้า</p>
                    <Link to="/warehouse"><button className='flex justify-center items-center px-8 py-3 text-[2.5vh] bg-orange-500 text-white rounded-3xl cursor-pointer hover:bg-orange-600'>จองใช้บริการ</button></Link>
                </div>
            </section>

            <section id='contact' className="flex flex-col items-center font-Montserrat py-10 px-6 rounded-2xl shadow-md">
                <div>
                    <button className='flex justify-center items-center px-3 py-1 mb-1 text-[2vh] bg-orange-500 text-white'>Contact Us</button>
                    <h1 className='text-[5vh] font-bold mb-4'>ติดต่อเรา</h1>
                    <div className='gap-3 text-[2.3vh] mb-2'>
                        <p>บริษัทพีเอฟเอฟ จำกัด</p>
                        <p>1 ซอย ฉลองกรุง 1 แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพมหานคร 10520</p>
                    </div>
                    <div className='gap-3 text-[2.3vh] mb-5'>
                        <p>PFF Co., Ltd.</p>
                        <p>1 Soi Chalongkrung 1, Lat Krabang Subdistrict, Lat Krabang District, Bangkok 10520, Thailand</p>
                    </div>
                    <p className='flex items-center gap-3 text-[2.3vh] mb-2'><MdPhone size={40} /> Tel: 087-716-0351</p>
                    <p className='flex items-center gap-3 text-[2.3vh] mb-2'><FaLine size={40} /> @PFFstorage</p>
                    <p className='flex items-center gap-3 text-[2.3vh] mb-2'><MdOutlineEmail size={40} /> PFFstorage@gmail.com</p>
                </div>
            </section>

        </div>
    )
}

export default ContentHome;