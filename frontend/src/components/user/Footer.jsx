function Footer(){
    return(
        <footer className="h-[25vh] bg-cover bg-center flex font-Montserrat bg-[#104ca0]">
            <div className="flex justify-center items-start mt-5 mx-auto w-[80%]">
                <div className="grid grid-cols-[1.8fr_0.8fr_2fr] gap-5 divide-x divide-gray-400 text-white">
                    <div className="">
                        <h1 className="text-[2.7vh] font-semibold mb-2">PFF storage</h1>
                        <p>ผู้ให้บริการคลังสินค้าชั้นนำ ในย่านลาดกระบัง มีพื้นที่จำนวนมาก การันตีคุณภาพด้วยลูกค้าชั้นนำ จัดการสินค้าได้เมื่อต้องการ พร้อมกับการเก็บข้อมูลที่ไม่สูญหาย</p>
                    </div>
                    <div>
                        <h1 className="text-[2.7vh] font-semibold">บริการของเรา</h1>
                        <p className="mb-2">เช่าคลังสินค้า</p>
                        <p className="mb-2">เช็คสถานะการเช่า</p>
                        <p className="mb-2">เช็คสถานะสินค้าแบบเรียลไทม์</p>
                        <p className="mb-2">บันทึกประวัติของสินค้า</p>
                        <p className="mb-2">จัดการสินค้า</p>
                    </div>
                    <div className="">
                        <h1 className="text-[2.7vh] font-semibold">ติดต่อเรา</h1>
                        <p>661 อาคาร PFF ซอย ฉลองกรุง 1 แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพมหานคร 10520</p>
                        <p>จันทร์ - ศุกร์ 9.00-18.00</p>
                        <p>Tel: 087-716-0351</p>
                        <p>Line: @PFFstorage</p>
                        <p>Email: PFFstorage@gmail.com</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;