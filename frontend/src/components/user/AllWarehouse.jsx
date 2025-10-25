import warehouse1 from '../../assets/bg-warehouse-1.jpg'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWarehouse } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AllWarehouse(){
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [stats, setStats] = useState({ total: 0, available: 0, rented: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        size: 'all',
        location: 'all',
        priceRange: 'all'
    });

    useEffect(() => {
        fetchWarehouses();
        fetchStats();
    }, []);

    const fetchWarehouses = async (filterParams = {}) => {
        try {
            const queryParams = new URLSearchParams(filterParams).toString();
            const response = await fetch(`${API_URL}/warehouses?${queryParams}`);
            const data = await response.json();
            
            if (data.success) {
                setWarehouses(data.warehouses);
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/warehouses/stats`);
            const data = await response.json();
            
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        setLoading(true);
        fetchWarehouses(filters);
    };

    const handleBookWarehouse = (warehouse) => {
        // Store selected warehouse in sessionStorage
        sessionStorage.setItem('selectedWarehouse', JSON.stringify(warehouse));
        navigate('/booking');
    };

    if (loading) {
        return (
            <div className="pt-[80px] flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold">Loading warehouses...</div>
            </div>
        );
    }

    return(
        <div className="pt-[80px] flex flex-col items-center gap-10 font-Montserrat">
            <div className="flex flex-col items-center justify-center">
                <h1 className="flex justify-center items-center gap-3 text-[3rem] text-[#2563eb]"><FaWarehouse />เลือกโกดังที่คุณต้องการเช่า</h1>
            </div>
            <div className="flex justify-center items-center rounded-xl shadow-md bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-[1200px] p-6">
                    <div className="flex flex-col">
                        <label htmlFor="size" className="text-gray-700 mb-1">ขนาดโกดัง</label>
                        <select 
                            name="size"
                            value={filters.size}
                            onChange={handleFilterChange}
                            className="px-3 py-3 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30">
                            <option value="all">ทั้งหมด</option>
                            <option value="small">ขนาดเล็ก (ต่ำกว่า 200 ตร.ม.)</option>
                            <option value="medium">ขนาดกลาง 200 - 500 ตร.ม.</option>
                            <option value="big">ขนาดใหญ่ (มากกว่า 500 ตร.ม.)</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="location" className="text-gray-700 mb-1">สถานที่ตั้ง</label>
                        <select 
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            className="px-3 py-3 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30">
                            <option value="all">ทั้งหมด</option>
                            <optgroup label="ภาคกลาง">
                                <option value="bangkok">กรุงเทพ</option>
                                <option value="nonthaburi">นนทบุรี</option>
                                <option value="nakhonpathom">นครปฐม</option>
                            </optgroup>
                            <optgroup label="ภาคตะวันออก">
                                <option value="chachoengsao">ฉะเชิงเทรา</option>
                                <option value="rayong">ระยอง</option>
                            </optgroup>
                            <optgroup label="ภาคตะวันออกเฉียงเหนือ">
                                <option value="khonkaen">ขอนแก่น</option>
                                <option value="nakhonratchasima">นครราชสีมา</option>
                            </optgroup>
                            <optgroup label="ภาคเหนือ">
                                <option value="chiangmai">เชียงใหม่</option>
                                <option value="lamphun">ลำพูน</option>
                            </optgroup>
                            <optgroup label="ภาคใต้">
                                <option value="songkhla">สงขลา</option>
                                <option value="suratthani">สุราษฎร์ธานี</option>
                                <option value="chumphon">ชุมพร</option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="price" className="text-gray-700 mb-1">ราคา</label>
                        <select 
                            name="priceRange"
                            value={filters.priceRange}
                            onChange={handleFilterChange}
                            className="px-3 py-3 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30">
                            <option value="all">ทั้งหมด</option>
                            <option value="under10000">ต่ำกว่า 10,000 บาท</option>
                            <option value="10000-30000">10,000 - 30,000 บาท</option>
                            <option value="30000-60000">30,000 - 60,000 บาท</option>
                            <option value="60000-100000">60,000 - 100,000 บาท</option>
                            <option value="over100000">มากกว่า 100,000 บาท</option>
                        </select>
                    </div>
                </div>
                <div className="mr-6">
                    <label htmlFor="" className="text-white mb-5">sadasdw</label> {/* ใส่มาเฉย ๆ เอามาปรับตำแหน่ง */}
                    <button onClick={handleSearch} className="flex justify-center items-center px-5 py-2 mt-1 rounded-xl bg-orange-500 text-white cursor-pointer transform transition duration-300 ease-in-out hover:bg-orange-700 hover:-translate-y-0.5">ค้นหา</button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                <div className="flex flex-col justify-between items-center w-[200px] p-5 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition duration-300 hover:bg-gray-50">
                    <h1 className="text-blue-600 text-[2.5rem] font-bold">{stats.total}</h1>
                    <p className="text-gray-600">โกดังทั้งหมด</p>
                </div>
                <div className="flex flex-col justify-between items-center w-[200px] p-5 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition duration-300 hover:bg-gray-50">
                    <h1 className="text-blue-600 text-[2.5rem] font-bold">{stats.available}</h1>
                    <p className="text-gray-600">ว่าง</p>
                </div>
                <div className="flex flex-col justify-between items-center w-[200px] p-5 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition duration-300 hover:bg-gray-50">
                    <h1 className="text-blue-600 text-[2.5rem] font-bold">{stats.rented}</h1>
                    <p className="text-gray-600">กำลังเช่า</p>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6'>
                {warehouses.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500 py-10">
                        ไม่พบโกดังที่ตรงกับเงื่อนไขการค้นหา
                    </div>
                ) : (
                    warehouses.map((warehouse) => {
                        const percent = (warehouse.availableRooms / warehouse.totalRooms) * 100;
                        return (
                            <div key={warehouse.id} className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition duration-300">
                                <img src={warehouse.imageUrl || warehouse1} alt={warehouse.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h1 className="text-xl font-semibold text-gray-800 mb-2">{warehouse.name}</h1>
                                    <p className="text-gray-600">{warehouse.description || `ขนาด ${warehouse.size} ตร.ม. | ${warehouse.location}`}</p>
                                    <p className="text-gray-800 font-bold mt-2">{warehouse.price.toLocaleString()} บาท/เดือน</p>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>{warehouse.availableRooms} ห้อง</span>
                                            <span>{warehouse.totalRooms} ห้อง</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 text-right">เหลือ {warehouse.availableRooms}/{warehouse.totalRooms}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleBookWarehouse(warehouse)}
                                        disabled={warehouse.availableRooms === 0}
                                        className={`mt-4 w-full text-white py-2 px-4 rounded-xl transition duration-300 ${
                                            warehouse.availableRooms === 0 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-orange-500 hover:bg-orange-700'
                                        }`}>
                                        {warehouse.availableRooms === 0 ? 'เต็มแล้ว' : 'เลือกโกดังนี้'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}

export default AllWarehouse;