import { useRef } from "react";
import { Link } from "react-router-dom";

function Header(){
    const contactRef = useRef(null);
    return(
      <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-white h-16 px-10 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-50">
        <Link to="/" className="text-[3.5vh] font-Montserrat font-semibold">PFF Storage</Link>
        <div className="flex gap-7 font-Montserrat">
          <Link to="/"><button className="flex justify-center items-center px-5 py-2 rounded-full cursor-pointer text-[2vh] hover:underline hover:underline-offset-4 hover:decoration-2">หน้าหลัก</button></Link>
          <Link to="/warehouse"><button className="flex justify-center items-center px-5 py-2 rounded-full cursor-pointer text-[2vh] hover:underline hover:underline-offset-4 hover:decoration-2">คลังสินค้า</button></Link>
          <a href="#contact" className="text-[2vh]"><button className="flex justify-center items-center px-5 py-2 rounded-full cursor-pointer text-[2vh] hover:underline hover:underline-offset-4 hover:decoration-2">ติดต่อเรา</button></a>
        </div>
      </header>

    )
}

export default Header;