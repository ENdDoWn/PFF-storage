import Header from "../components/admin/HeaderAdmin"
import Main from "../components/admin/Main"
import Slide from "../components/admin/SlideBar"
import User from "../components/admin/User"
import AdminApprove from "../components/admin/AdminApprove"

import { useState, useEffect } from "react"

function Admin(){
    const [isExpanded, setIsExpanded] = useState(true);
    const [Switch, setSwitch] = useState("main");

    const Content = () => {
        switch(Switch) {
            case "main":
                return <Main />;
            case "approve":
                return <AdminApprove />;
            default:
                return <Main />;
        }
    }

    return(
        <div className="flex font-Montserrat bg-[#f2f2f2] h-[100vh]">
            <Slide isExpanded={isExpanded} setIsExpanded={setIsExpanded} Switch={Switch} setSwitch={setSwitch} />
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isExpanded ? "ml-60" : "ml-20"}`}>
                <Header />
                {Content()}
            </div>
        </div>
    )
}

export default Admin;