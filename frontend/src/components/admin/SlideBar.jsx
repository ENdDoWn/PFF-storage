import { IoMdPerson } from "react-icons/io";
import { FaClipboardCheck } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdHomeFilled } from "react-icons/md";

import logo from "../../assets/logo_condo.png";

function SlideBar({ isExpanded, setIsExpanded, Switch, setSwitch }){

    return(
        <div className={`bg-[#1b1d36] flex flex-col justify-between transition-all duration-300 flex-shrink-0 overflow-hidden fixed left-0 top-0 h-screen ${isExpanded ? "w-60" : "w-20"}`}>
            <div className="flex flex-col items-center">
                <div className="flex justify-center items-center w-full pt-4 pb-7">
                    <div className={`flex items-center transition-all duration-300 ${isExpanded ? "gap-3" : "gap-0"}`}>
                        <img src={logo} className="w-12 h-12 rounded-full flex-shrink-0" />
                        <p className={`font-bold text-[1.5rem] text-white whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 w-auto delay-150" : "opacity-0 w-0"}`}>PFF Storage</p>
                    </div>
                </div>
                <div className="grid text-white w-full">
                    <button onClick={() => setSwitch("main")} className={`whitespace-nowrap flex items-center gap-3 py-3 px-5 min-w-[240px] text-[1.3rem] transition-all duration-300 hover:bg-[#2b2f4b] border-l-4 ${Switch === "main" ? "border-l-orange-400 bg-[#2b2f4b]" : "border-l-transparent"}`}>
                        <MdHomeFilled className="flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100 delay-150" : "opacity-0"}`}>หน้าหลัก</span>
                    </button>
                    <button onClick={() => setSwitch("user")} className={`flex items-center gap-3 py-3 px-5 min-w-[240px] text-[1.3rem] transition-all duration-300 hover:bg-[#2b2f4b] border-l-4 ${Switch === "user" ? "border-l-orange-400 bg-[#2b2f4b]" : "border-l-transparent"}`}>
                        <IoMdPerson className="flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100 delay-150" : "opacity-0"}`}>ผู้เช่า</span>
                    </button>
                    <button onClick={() => setSwitch("approve")} className={`flex items-center gap-3 py-3 px-5 min-w-[240px] text-[1.3rem] transition-all duration-300 hover:bg-[#2b2f4b] border-l-4 ${Switch === "approve" ? "border-l-orange-400 bg-[#2b2f4b]" : "border-l-transparent"}`}>
                        <FaClipboardCheck className="flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100 delay-150" : "opacity-0"}`}>อนุมัติ</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center text-[2rem] text-white mb-4">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-4 transition-transform duration-300">
                      {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
            </div>
        </div>
    )
}

export default SlideBar;