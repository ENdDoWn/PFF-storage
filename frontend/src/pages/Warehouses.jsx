import "../index.css"
import Header from '../components/user/Header'
import Main from '../components/user/AllWarehouse'

function Warehouses(){
    return(
        <div className="bg-[#f3f4f6] w-full h-full">
            <Header />
            <Main />
        </div>
    )
}
export default Warehouses;