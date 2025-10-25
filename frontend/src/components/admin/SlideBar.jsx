import { IoMdPerson } from "react-icons/io";
import { FaClipboardCheck } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdHomeFilled } from "react-icons/md";

import logo from "../../assets/logo_condo.png";

function SlideBar({ isExpanded, setIsExpanded, Switch, setSwitch }){

    return(
        <div className={`bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex flex-col justify-between transition-all duration-300 flex-shrink-0 overflow-hidden fixed left-0 top-0 h-screen shadow-2xl ${isExpanded ? "w-64" : "w-20"}`}>
            <div className="flex flex-col items-center">
                <div className="flex justify-center items-center w-full pt-6 pb-8">
                    <div className={`flex items-center transition-all duration-300 ${isExpanded ? "gap-3" : "gap-0"}`}>
                        <div className="relative">
                            <img src={logo} className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-blue-400 shadow-lg" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1e293b]"></div>
                        </div>
                        <p className={`font-bold text-[1.5rem] text-white whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 w-auto delay-150" : "opacity-0 w-0"}`}>PFF Storage</p>
                    </div>
                </div>
                <div className="w-full px-3 mb-2">
                    <div className={`bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                        <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">Navigation</p>
                    </div>
                </div>
                <div className="grid text-white w-full gap-2 px-3">
                    <button 
                        onClick={() => setSwitch("main")} 
                        className={`relative whitespace-nowrap flex items-center gap-4 py-3.5 px-4 rounded-xl text-[1.15rem] font-medium transition-all duration-300 group ${Switch === "main" ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50" : "hover:bg-white/5"}`}
                    >
                        <MdHomeFilled className={`flex-shrink-0 text-xl ${Switch === "main" ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                        <span className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100 delay-150" : "opacity-0"} ${Switch === "main" ? "text-white" : "text-gray-300"}`}>หน้าหลัก</span>
                        {Switch === "main" && <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>}
                    </button>
                    <button 
                        onClick={() => setSwitch("approve")} 
                        className={`relative flex items-center gap-4 py-3.5 px-4 rounded-xl text-[1.15rem] font-medium transition-all duration-300 group ${Switch === "approve" ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50" : "hover:bg-white/5"}`}
                    >
                        <FaClipboardCheck className={`flex-shrink-0 text-xl ${Switch === "approve" ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                        <span className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100 delay-150" : "opacity-0"} ${Switch === "approve" ? "text-white" : "text-gray-300"}`}>อนุมัติ</span>
                        {Switch === "approve" && <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>}
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center text-white mb-6 px-3">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all duration-300 flex items-center justify-center group"
                >
                    {isExpanded ? (
                        <FiChevronLeft className="text-2xl group-hover:scale-110 transition-transform" />
                    ) : (
                        <FiChevronRight className="text-2xl group-hover:scale-110 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default SlideBar;