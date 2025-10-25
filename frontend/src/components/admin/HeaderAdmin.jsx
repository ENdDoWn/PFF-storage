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
            <header className="flex-1 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 h-20 px-10 py-4 shadow-lg z-50 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <RiAdminFill className="text-white text-2xl" />
                    </div>
                    <div>
                        <p className="font-bold text-xl text-white">Admin Management</p>
                        <p className="text-xs text-blue-100">PFF Storage Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-200">
                        <FaBell className="text-white text-xl" />
                        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-600"></span>
                    </button>
                    <div className="w-[2px] h-8 rounded-2xl bg-white/30"></div>
                    <label className="relative inline-block">
                        <input type="checkbox" className="hidden peer" />
                        <div className="flex items-center gap-3 cursor-pointer bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-all duration-200">
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                A
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-semibold">Admin</span>
                                <IoIosArrowDown className="text-white text-lg peer-checked:rotate-180 transition-transform duration-200" />
                            </div>
                        </div>
                        <nav className="absolute right-0 top-[60px] w-[220px] bg-white border border-gray-100 rounded-xl shadow-2xl invisible opacity-0 transition-all duration-200 ease-in-out z-10 peer-checked:visible peer-checked:opacity-100 overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                                <p className="text-sm font-semibold text-gray-700">Admin Account</p>
                                <p className="text-xs text-gray-500">admin@pffstorage.com</p>
                            </div>
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