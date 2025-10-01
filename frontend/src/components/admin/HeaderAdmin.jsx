import { useState } from "react";

import { PiSignOut } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";

function HeaderAdmin() {

    return (
        <div className="font-Montserrat">
            <header className="flex-1 flex justify-between items-center bg-white h-16 px-10 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-50 transition-all duration-300">
                <p className="font-bold text-[1.3rem]">Admin Management</p>
                <div className="flex items-center gap-4">
                    <div className="w-[2px] h-8 rounded-2xl bg-gray-200"></div>
                    <label className="relative inline-block">
                        <input type="checkbox" className="hidden peer" />
                        <p className="w-full h-full flex items-center justify-center gap-2 text-gray-700 text-[1.4rem] font-semibold cursor-pointer">
                            <span>Admin</span>
                            <IoIosArrowDown className="w-full h-full rounded-full p-2 hover:bg-gray-200 transition duration-300 ease-in-out" />
                        </p>
                        <nav className="absolute right-0 top-[40px] w-[200px] bg-white border border-none rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] invisible opacity-0 transition-all duration-200 ease-in-out z-10 peer-checked:visible peer-checked:opacity-100">
                            <ul className="list-none p-2 m-0">
                                <li>
                                    <a href="/logout" className="flex justify-center items-center gap-4 block w-full px-3 py-2 text-left text-[1.2rem] font-semibold rounded-md hover:bg-blue-200 hover:text-white cursor-pointer transition-colors duration-150"><PiSignOut size={25} />Sign Out</a>
                                </li>
                            </ul>
                        </nav>
                    </label>
                </div>
            </header>
        </div>
    );
}

export default HeaderAdmin;