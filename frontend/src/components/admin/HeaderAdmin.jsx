import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from 'aws-amplify/auth';

import { PiSignOut } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";

function HeaderAdmin() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            console.log("Logout successful");
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="font-Montserrat">
            <header className="flex-1 flex justify-between items-center bg-white h-20 px-10 py-4 shadow-lg z-50 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                        <RiAdminFill className="text-black text-2xl" />
                    </div>
                    <div>
                        <p className="font-bold text-xl text-black">Admin Management</p>
                        <p className="text-xs text-gray-600">PFF Storage Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-[2px] h-8 rounded-2xl bg-white/30"></div>
                    <label className="relative inline-block">
                        <input type="checkbox" className="hidden peer" />
                        <div className="flex items-center gap-3 cursor-pointer bg-black/10 hover:bg-black/20 rounded-lg px-4 py-2 transition-all duration-200">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Admin</span>
                                <IoIosArrowDown className="text-black text-lg peer-checked:rotate-180 transition-transform duration-200" />
                            </div>
                        </div>
                        <nav className="absolute right-0 top-[60px] w-[220px] bg-white border border-gray-100 rounded-xl shadow-2xl invisible opacity-0 transition-all duration-200 ease-in-out z-10 peer-checked:visible peer-checked:opacity-100 overflow-hidden">
                            <ul className="list-none p-2 m-0">
                                <li>
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-700 cursor-pointer transition-all duration-150 group">
                                        <PiSignOut size={20} className="group-hover:scale-110 transition-transform" />
                                        <span>Sign Out</span>
                                    </button>
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