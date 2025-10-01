import { useState } from "react";

import Header from "../components/user/HeaderMain"
import Product from "../components/user/ProductManage"

function Main(){
    return(
        <div className="bg-[#f2f2f2] w-full h-full">
            <Header />
            <Product />
        </div>
    )
}

export default Main;