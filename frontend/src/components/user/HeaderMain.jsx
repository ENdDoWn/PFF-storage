import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from 'aws-amplify/auth';

import { PiSignOut } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";

function HeaderMain({ userInfo }) {
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

  const getFirstName = () => {
    if (!userInfo?.name) return "User";
    return userInfo.name.split(' ')[0];
  };

  return(
    <header className="fixed top-0 left-0 w-full flex justify-center items-center bg-white h-16 px-10 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-50 font-Montserrat">
      <div className="w-full flex justify-between items-center">
        <p className="flex justify-center items-center gap-4 text-[1.8rem] font-bold">Dashboard</p>
        <div className="flex justify-end items-center gap-4 w-[30%]">
          <Link to="/warehouse">
            <button className="flex justify-center items-center px-5 py-2 rounded-full cursor-pointer text-[1.1rem] font-semibold text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition duration-300 ease-in-out">
              คลังสินค้า
            </button>
          </Link>
          <div className="w-[2px] h-8 rounded-2xl bg-gray-200"></div>
          <label className="relative inline-block">
            <input type="checkbox" className="hidden peer" />
            <p className="w-full h-full flex items-center justify-center gap-2 text-gray-700 cursor-pointer">
              <span className="text-[1.1rem] font-semibold">{getFirstName()}</span>
              <IoIosArrowDown className="w-full h-full rounded-full p-2 hover:bg-gray-200 transition duration-300 ease-in-out" size={20} />
            </p>
            <nav className="absolute right-0 top-[40px] w-[200px] bg-white border border-none rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] invisible opacity-0 transition-all duration-200 ease-in-out z-10 peer-checked:visible peer-checked:opacity-100">
              <ul className="list-none p-2 m-0">
                <li>
                  <button onClick={handleLogout} className="flex justify-center items-center gap-4 block w-full px-3 py-2 text-left text-[1.2rem] font-semibold rounded-md hover:bg-blue-200 hover:text-white cursor-pointer transition-colors duration-150"><PiSignOut size={25} />Sign Out</button>
                </li>
              </ul>
            </nav>
          </label>
        </div>
      </div>
    </header>

  )
}

export default HeaderMain;
