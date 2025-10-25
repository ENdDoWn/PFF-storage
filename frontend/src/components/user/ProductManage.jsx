import { IoAdd, IoClose } from "react-icons/io5";
import { FaBoxes, FaWarehouse, FaExclamationTriangle, FaShippingFast } from "react-icons/fa";
import { LuAsterisk } from "react-icons/lu";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

function ProductManage({ userInfo }){
    const [Edit, setEdit] = useState(false);
    const [Status, setStatus] = useState("คงคลัง");
    const [Popup, setPopup] = useState(false);
    const [WithdrawPopup, setWithdrawPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [withdrawQuantity, setWithdrawQuantity] = useState(0);
    const [Unit, setUnit] = useState("กก.");
    const [CustomUnit, setCustomUnit] = useState("");
    const [hasActiveRental, setHasActiveRental] = useState(false);
    const [rentals, setRentals] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [warehouseDetails, setWarehouseDetails] = useState({});
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null); // NEW: Track selected warehouse

    useEffect(() => {
        if (userInfo?.email) {
            checkActiveRentals();
            fetchWarehouses();
            fetchProducts();
        }
    }, [userInfo]);

    // NEW: Auto-select first warehouse when rentals load
    useEffect(() => {
        if (rentals.length > 0 && !selectedWarehouseId) {
            setSelectedWarehouseId(rentals[0].warehouseId);
        }
    }, [rentals]);

    const checkActiveRentals = async () => {
        try {
            const userId = userInfo.email?.split('@')[0];
            const response = await fetch(`${API_URL}/api/users/${userId}/rentals/active`);
            const data = await response.json();
            
            if (data.success && data.rentals.length > 0) {
                setHasActiveRental(true);
                setRentals(data.rentals);
                // Fetch warehouse details for each rental
                await fetchWarehouseDetails(data.rentals);
            } else {
                setHasActiveRental(false);
            }
        } catch (error) {
            console.error('Error checking rentals:', error);
            setHasActiveRental(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchWarehouseDetails = async (rentals) => {
        try {
            const warehouseIds = [...new Set(rentals.map(r => r.warehouseId))];
            const details = {};
            
            for (const warehouseId of warehouseIds) {
                const response = await fetch(`${API_URL}/warehouses/${warehouseId}`);
                const data = await response.json();
                if (data) {
                    details[warehouseId] = data;
                }
            }
            
            setWarehouseDetails(details);
        } catch (error) {
            console.error('Error fetching warehouse details:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const userId = userInfo.email?.split('@')[0];
            const response = await fetch(`${API_URL}/api/users/${userId}/products`);
            const data = await response.json();
            
            if (data.success) {
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await fetch(`${API_URL}/warehouses`);
            const data = await response.json();
            
            if (data.success) {
                // Get first 3 warehouses with available rooms
                const availableWarehouses = data.warehouses
                    .filter(w => w.availableRooms > 0)
                    .slice(0, 3);
                setWarehouses(availableWarehouses);
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    // NEW: Get rentals for selected warehouse
    const getSelectedWarehouseRentals = () => {
        if (!selectedWarehouseId) return rentals;
        return rentals.filter(r => r.warehouseId === selectedWarehouseId);
    };

    // NEW: Get room IDs for selected warehouse
    const getSelectedWarehouseRoomIds = () => {
        const warehouseRentals = getSelectedWarehouseRentals();
        return warehouseRentals.map(r => r.roomId);
    };

    // NEW: Filter products by selected warehouse
    const getFilteredProducts = () => {
        if (!selectedWarehouseId) return products;
        const roomIds = getSelectedWarehouseRoomIds();
        return products.filter(p => roomIds.includes(p.roomId));
    };

    // Calculate stock statistics from products (UPDATED to use filtered products)
    const calculateStockStats = () => {
        const filteredProducts = getFilteredProducts(); // Use filtered products
        const totalProducts = filteredProducts.length;
        const inStockProducts = filteredProducts.filter(p => p.status === 'in-stock').length;
        const nearExpiryProducts = filteredProducts.filter(p => {
            if (!p.expiryDate) return false;
            const expiryDate = new Date(p.expiryDate);
            const today = new Date();
            const daysUntilExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24);
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0 && p.status === 'in-stock';
        }).length;
        const shippedProducts = filteredProducts.filter(p => p.status === 'shipped' || p.status === 'out-of-stock').length;

        const totalQuantity = filteredProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
        const inStockQuantity = filteredProducts.filter(p => p.status === 'in-stock').reduce((sum, p) => sum + (p.quantity || 0), 0);

        return {
            total: totalProducts,
            totalQuantity,
            inStock: inStockProducts,
            inStockQuantity,
            nearExpiry: nearExpiryProducts,
            shipped: shippedProducts,
            inStockPercentage: totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 0,
            nearExpiryPercentage: totalProducts > 0 ? Math.round((nearExpiryProducts / totalProducts) * 100) : 0,
            shippedPercentage: totalProducts > 0 ? Math.round((shippedProducts / totalProducts) * 100) : 0
        };
    };

    const handleAddProduct = async (productData) => {
        try {
            const userId = userInfo.email?.split('@')[0];
            
            // Get selected warehouse's first rental roomId
            const warehouseRentals = getSelectedWarehouseRentals();
            const roomId = warehouseRentals[0]?.roomId;
            
            if (!roomId) {
                alert('ไม่พบห้องที่เช่าในคลังนี้ กรุณาเลือกคลังที่เช่าอยู่');
                return;
            }

            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    ...productData,
                    roomId
                })
            });

            const result = await response.json();

            if (result.success) {
                alert('เพิ่มสินค้าสำเร็จ');
                setPopup(false);
                fetchProducts(); // Refresh products list
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('ไม่สามารถเพิ่มสินค้าได้');
        }
    };

    const handleDeleteProduct = async (productId, quantityToWithdraw) => {
        try {
            const userId = userInfo.email?.split('@')[0];
            const product = products.find(p => p.productId === productId);
            
            if (!product) {
                alert('ไม่พบข้อมูลสินค้า');
                return;
            }

            const currentQuantity = product.quantity || 0;
            const newQuantity = currentQuantity - quantityToWithdraw;

            if (newQuantity < 0) {
                alert('จำนวนสินค้าไม่เพียงพอ');
                return;
            }

            if (newQuantity === 0) {
                // Delete the product completely if quantity reaches 0
                const response = await fetch(`${API_URL}/api/users/${userId}/products/${productId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    alert(`เบิกสินค้าสำเร็จ ${quantityToWithdraw} หน่วย (ลบสินค้าออกจากระบบ)`);
                    fetchProducts();
                    setWithdrawPopup(false);
                    setSelectedProduct(null);
                } else {
                    alert(`เกิดข้อผิดพลาด: ${result.error}`);
                }
            } else {
                // Update the product quantity
                const response = await fetch(`${API_URL}/api/users/${userId}/products/${productId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });

                const result = await response.json();

                if (result.success) {
                    alert(`เบิกสินค้าสำเร็จ ${quantityToWithdraw} หน่วย (เหลือ ${newQuantity} หน่วย)`);
                    fetchProducts();
                    setWithdrawPopup(false);
                    setSelectedProduct(null);
                } else {
                    alert(`เกิดข้อผิดพลาด: ${result.error}`);
                }
            }
        } catch (error) {
            console.error('Error withdrawing product:', error);
            alert('ไม่สามารถเบิกสินค้าได้');
        }
    };

    const handleUpdateProduct = async (productId, updates) => {
        try {
            const userId = userInfo.email?.split('@')[0];
            const response = await fetch(`${API_URL}/api/users/${userId}/products/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            const result = await response.json();

            if (result.success) {
                alert('อัพเดทสินค้าสำเร็จ');
                fetchProducts(); // Refresh products list
                setEdit(false);
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('ไม่สามารถอัพเดทสินค้าได้');
        }
    };

    const stats = calculateStockStats();

    const StatusColors = {
        "คงคลัง": "bg-green-200 text-green-800",
        "in-stock": "bg-green-200 text-green-800",
        "ใกล้หมดอายุ": "bg-yellow-200 text-yellow-800",
        "near-expiry": "bg-yellow-200 text-yellow-800",
        "ส่งออกแล้ว": "bg-red-200 text-red-800",
        "shipped": "bg-red-200 text-red-800",
        "out-of-stock": "bg-gray-200 text-gray-800",
    };
    
    const stock = [
        {
            title: "จำนวนสินค้าทั้งหมดในโกดัง",
            value: stats.totalQuantity.toLocaleString(),
            count: `${stats.total} รายการ`,
            icon: <FaBoxes className="text-blue-500" />,
            color: "from-blue-400 to-blue-600",
            progress: 100,
            description: "สินค้าทั้งหมด"
        },
        {
            title: "จำนวนสินค้าในคลัง",
            value: stats.inStockQuantity.toLocaleString(),
            count: `${stats.inStock} รายการ`,
            icon: <FaWarehouse className="text-green-500" />,
            color: "from-green-400 to-green-600",
            progress: stats.inStockPercentage,
            description: `${stats.inStockPercentage}% ของสินค้าทั้งหมด`
        },
        {
            title: "จำนวนสินค้าที่ใกล้หมดอายุ",
            value: stats.nearExpiry.toString(),
            count: `${stats.nearExpiry} รายการ`,
            icon: <FaExclamationTriangle className="text-yellow-500" />,
            color: "from-yellow-400 to-yellow-600",
            progress: stats.nearExpiryPercentage,
            description: `${stats.nearExpiryPercentage}% ของสินค้าทั้งหมด`
        },
        {
            title: "จำนวนสินค้าที่ส่งออกแล้ว",
            value: stats.shipped.toString(),
            count: `${stats.shipped} รายการ`,
            icon: <FaShippingFast className="text-red-500" />,
            color: "from-red-400 to-red-600",
            progress: stats.shippedPercentage,
            description: `${stats.shippedPercentage}% ของสินค้าทั้งหมด`
        }
    ];

    if (loading) {
        return (
            <div className="pt-[80px] w-full h-screen flex items-center justify-center">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    // If user has no active rental, show warehouse selection page
    if (!hasActiveRental) {
        return (
            <div className="pt-[80px] w-full min-h-screen bg-[#f2f2f2] py-10 font-Montserrat">
                <div className="px-10 py-5">
                    <p className="text-[1.4rem] font-semibold mx-2 my-1">User Information</p>
                    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-10 pt-5 pb-3">
                        <div className="pb-5">
                            <p className="text-[2.5rem] font-bold">{userInfo?.name || 'Loading...'}</p>
                            <p className="text-[1.3rem] text-orange-500 font-semibold">ยังไม่มีการเช่าโกดัง</p>
                        </div>
                        <div className="grid grid-cols-4 gap-5">
                            <p className="flex flex-col">
                                <span className="text-[1rem]">Organization</span>
                                <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.nickname || 'N/A'}</span>
                            </p>
                            <div className="flex gap-5">
                                <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                                <p className="flex flex-col">
                                    <span className="text-[1rem]">location</span>
                                    <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.address || 'N/A'}</span>
                                </p>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                                <p className="flex flex-col">
                                    <span className="text-[1rem]">Mobile</span>
                                    <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.phone_number || 'N/A'}</span>
                                </p>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                                <p className="flex flex-col">
                                    <span className="text-[1rem]">Email</span>
                                    <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.email || 'N/A'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to action section */}
                <div className="px-10 py-10">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg px-10 py-12 text-white text-center">
                        <FaWarehouse className="mx-auto mb-4" size={80} />
                        <h2 className="text-[2.5rem] font-bold mb-4">เริ่มต้นใช้งานกับเรา</h2>
                        <p className="text-[1.3rem] mb-8">คุณยังไม่มีการเช่าโกดัง เริ่มต้นจัดการสินค้าของคุณได้ตอนนี้</p>
                        <Link to="/warehouse">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full text-[1.3rem] font-semibold shadow-lg hover:-translate-y-1 transition duration-300">
                                เลือกโกดังเลย
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Available warehouses preview */}
                <div className="px-10 py-5">
                    <div className="flex justify-between items-center mb-5">
                        <p className="text-[1.4rem] font-semibold mx-2">โกดังที่พร้อมให้บริการ</p>
                        <Link to="/warehouse">
                            <button className="text-blue-600 hover:text-blue-700 font-semibold">ดูทั้งหมด →</button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {warehouses.map((warehouse) => (
                            <div key={warehouse.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
                                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <FaWarehouse className="text-white" size={80} />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{warehouse.name}</h3>
                                    <p className="text-gray-600 mb-3">{warehouse.description || `${warehouse.size} | ${warehouse.location}`}</p>
                                    <p className="text-blue-600 font-bold text-lg mb-3">{warehouse.price?.toLocaleString()} บาท/เดือน</p>
                                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                                        <span>ห้องว่าง: {warehouse.availableRooms}/{warehouse.totalRooms}</span>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">พร้อมให้เช่า</span>
                                    </div>
                                    <Link to="/warehouse">
                                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-xl transition duration-300">
                                            เลือกโกดังนี้
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {warehouses.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            <p>กำลังโหลดข้อมูลโกดัง...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Original content for users with active rentals
    
    const latestRental = rentals.length > 0 ? rentals[0] : null;
    const rentalEndDate = latestRental?.endDate ? new Date(latestRental.endDate).toLocaleDateString('th-TH') : 'N/A';

    return(
        <div className="pt-[80px] w-full h-full bg-[#f2f2f2] py-5 font-Montserrat">
            <div className="px-10 py-5">
                <p className="text-[1.4rem] font-semibold mx-2 my-1">User Information</p>
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-10 pt-5 pb-3">
                    <div className="pb-5">
                        <p className="text-[2.5rem] font-bold">{userInfo?.name || 'Loading...'}</p>
                        <p className="text-[1.1rem] text-gray-600 mb-3">
                            คุณมีคลังสินค้าที่เช่าอยู่: <span className="font-semibold text-blue-600">{rentals.length}</span> คลัง
                        </p>
                        {rentals.length > 0 && (
                            <>
                                <p className="text-sm text-gray-500 mb-2">เลือกคลังเพื่อดูข้อมูล:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    {/* Group rentals by warehouse */}
                                    {[...new Set(rentals.map(r => r.warehouseId))].map((warehouseId) => {
                                        const warehouse = warehouseDetails[warehouseId];
                                        const warehouseRentals = rentals.filter(r => r.warehouseId === warehouseId);
                                        const isSelected = selectedWarehouseId === warehouseId;
                                        
                                        return (
                                            <button
                                                key={warehouseId}
                                                onClick={() => setSelectedWarehouseId(warehouseId)}
                                                className={`text-left rounded-lg p-4 transition-all duration-200 ${
                                                    isSelected 
                                                        ? 'bg-blue-600 border-2 border-blue-700 shadow-lg transform scale-105' 
                                                        : 'bg-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <FaWarehouse className={isSelected ? 'text-white' : 'text-blue-600'} />
                                                            <p className={`font-semibold ${isSelected ? 'text-white' : 'text-blue-900'}`}>
                                                                {warehouse?.name || 'Loading...'}
                                                            </p>
                                                        </div>
                                                        <p className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                                                            จำนวนห้อง: {warehouseRentals.length} ห้อง
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {warehouseRentals.map((rental, idx) => (
                                                                <span 
                                                                    key={rental.rentalId}
                                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                                        isSelected 
                                                                            ? 'bg-blue-500 text-white' 
                                                                            : 'bg-blue-200 text-blue-800'
                                                                    }`}
                                                                >
                                                                    {rental.roomId}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="ml-3">
                                                            <div className="bg-white text-blue-600 rounded-full p-2">
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        <p className="flex flex-col">
                            <span className="text-[1rem]">Organization</span>
                            <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.nickname || 'N/A'}</span>
                        </p>
                        <div className="flex gap-5">
                            <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                            <p className="flex flex-col">
                                <span className="text-[1rem]">location</span>
                                <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.address || 'N/A'}</span>
                            </p>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                            <p className="flex flex-col">
                                <span className="text-[1rem]">Mobile</span>
                                <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.phone_number || 'N/A'}</span>
                            </p>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-[2px] h-16 rounded-2xl bg-gray-200"></div>
                            <p className="flex flex-col">
                                <span className="text-[1rem]">Email</span>
                                <span className="text-[1rem] text-[#78b5ff] font-semibold">{userInfo?.email || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-10 py-5">
                <div className="flex items-center justify-between mx-2 my-1 mb-4">
                    <div>
                        <p className="text-[1.4rem] font-semibold">Stock</p>
                        {selectedWarehouseId && warehouseDetails[selectedWarehouseId] && (
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <FaWarehouse className="text-blue-600" />
                                แสดงข้อมูลจาก: <span className="font-semibold text-blue-600">{warehouseDetails[selectedWarehouseId].name}</span>
                            </p>
                        )}
                    </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-10 py-5">
                    <div className="flex justify-center items-center w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            {stock.map((item, index) => (
                                <div key={index} className="relative flex flex-col p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-2 transform transition-all duration-300 ease-in-out overflow-hidden group">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div className="p-3 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-300">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.description}</span>
                                    </div>
                                    
                                    <div className="mb-4 relative z-10">
                                        <h1 className="text-3xl font-bold text-gray-800 mb-1">{item.value}</h1>
                                        <p className="text-gray-600 text-sm">{item.title}</p>
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>ความคืบหน้า</span>
                                            <span>{item.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-10 py-5">
                <div className="flex items-center justify-between mx-2 my-1 mb-4">
                    <div>
                        <p className="text-[1.4rem] font-semibold">All Products</p>
                        {selectedWarehouseId && warehouseDetails[selectedWarehouseId] && (
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <FaWarehouse className="text-blue-600" />
                                แสดงสินค้าจาก: <span className="font-semibold text-blue-600">{warehouseDetails[selectedWarehouseId].name}</span>
                            </p>
                        )}
                    </div>
                    <button onClick={() => setPopup(true)} className="flex justify-center items-center gap-3 rounded-xl px-5 py-2 bg-orange-500 shadow-sm text-[1.3rem] text-white font-medium transition duration-300 ease-in-out hover:bg-orange-600 cursor-pointer"><IoAdd size={25} />เพิ่มสินค้า</button>
                </div>
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-10 py-5">
                    <table className="w-full border-none rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-blue-500 text-white text-[1.1rem]">
                            <tr>
                                <th className="px-4 py-2 text-center">ID</th>
                                <th className="px-4 py-2 text-center">ชื่อสินค้า</th>
                                <th className="px-4 py-2 text-center">วันสินค้าเข้า</th>
                                <th className="px-4 py-2 text-center">วันหมดอายุ</th>
                                <th className="px-4 py-2 text-center">จำนวนคงเหลือ</th>
                                <th className="px-4 py-2 text-center">ห้อง</th>
                                <th className="px-4 py-2 text-center">สถานะ</th>
                                <th className="px-4 py-2 text-center">จัดการสินค้า</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredProducts().length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                                        {selectedWarehouseId 
                                            ? `ยังไม่มีสินค้าในคลัง ${warehouseDetails[selectedWarehouseId]?.name || 'นี้'}`
                                            : 'ยังไม่มีสินค้าในระบบ กรุณาเพิ่มสินค้าใหม่'
                                        }
                                    </td>
                                </tr>
                            ) : (
                                getFilteredProducts().map((product, index) => (
                                    <tr key={product.productId} className="hover:bg-blue-50 odd:bg-white even:bg-gray-100">
                                        <td className="px-4 py-2 text-center">{String(index + 1).padStart(3, '0')}</td>
                                        <td className="px-4 py-2 text-center">{product.name}</td>
                                        <td className="px-4 py-2 text-center">
                                            {product.importDate ? new Date(product.importDate).toLocaleDateString('th-TH') : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('th-TH') : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 text-center">{product.quantity?.toLocaleString() || 0}</td>
                                        <td className="px-4 py-2 text-center">{product.roomId || 'N/A'}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${StatusColors[product.status] || StatusColors['in-stock']}`}>
                                                {product.status === 'in-stock' ? 'คงคลัง' : 
                                                 product.status === 'near-expiry' ? 'ใกล้หมดอายุ' :
                                                 product.status === 'shipped' ? 'ส่งออกแล้ว' : 
                                                 product.status || 'คงคลัง'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center space-x-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setWithdrawQuantity(1);
                                                    setWithdrawPopup(true);
                                                }}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                                            >
                                                เบิกสินค้า
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            { Popup && (
                <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-start w-[30%] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const productData = {
                            name: formData.get('name'),
                            importDate: formData.get('importDate'),
                            expiryDate: formData.get('expiryDate') || '',
                            quantity: parseInt(formData.get('quantity')),
                            status: 'in-stock'
                        };
                        handleAddProduct(productData);
                    }} className="w-full">
                        <div className="flex justify-between items-center w-full px-5 mb-5">
                            <h1 className="text-[1.5rem] font-bold">เพิ่มสินค้าใหม่</h1>
                            <IoClose size={30} className="text-gray-600 cursor-pointer" onClick={() => setPopup(false)} />
                        </div>
                        <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                        <div className="mx-5">
                            <div className="mb-5">
                                <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">ชื่อสินค้า<LuAsterisk color="red" size={15} /></span>
                                <input 
                                    type="text" 
                                    name="name"
                                    placeholder="กรุณากรอกชื่อสินค้า" 
                                    required
                                    className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" 
                                />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                                <div>
                                    <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">วันที่สินค้าเข้า<LuAsterisk color="red" size={15} /></span>
                                    <input 
                                        type="date" 
                                        name="importDate"
                                        required
                                        className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" 
                                    />
                                </div>
                                <div>
                                    <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">วันที่หมดอายุ</span>
                                    <input 
                                        type="date" 
                                        name="expiryDate"
                                        className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" 
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">จำนวน<LuAsterisk color="red" size={15} /></span>
                                <input 
                                    type="number" 
                                    name="quantity"
                                    placeholder="0" 
                                    required
                                    min="0"
                                    className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" 
                                />
                            </div>
                        </div>
                        <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                        <div className="w-full flex justify-end items-center gap-5 px-5">
                            <button 
                                type="button"
                                onClick={() => setPopup(false)} 
                                className="flex justify-center items-center border border-blue-600 rounded-2xl text-[1.3rem] text-blue-600 bg-white px-5 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(37,99,235,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]"
                            >
                                cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex justify-center items-center border rounded-2xl text-[1.3rem] text-white bg-orange-500 px-10 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)]"
                            >
                                add
                            </button>
                        </div>
                    </form>
                </div>
            )}

            { WithdrawPopup && selectedProduct && (
                <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-start w-[30%] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]">
                    <div className="flex justify-between items-center w-full px-5 mb-5">
                        <h1 className="text-[1.5rem] font-bold">เบิกสินค้า</h1>
                        <IoClose 
                            size={30} 
                            className="text-gray-600 cursor-pointer hover:text-red-600 transition" 
                            onClick={() => {
                                setWithdrawPopup(false);
                                setSelectedProduct(null);
                                setWithdrawQuantity(0);
                            }} 
                        />
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="mx-5 w-full px-5">
                        <div className="bg-blue-50 rounded-xl p-4 mb-5">
                            <p className="text-gray-600 text-sm mb-2">สินค้า</p>
                            <p className="text-xl font-bold text-gray-800">{selectedProduct.name}</p>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-gray-500 text-xs">จำนวนคงเหลือ</p>
                                    <p className="text-lg font-semibold text-blue-600">{selectedProduct.quantity?.toLocaleString() || 0} หน่วย</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">ห้อง</p>
                                    <p className="text-lg font-semibold text-gray-700">{selectedProduct.roomId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <span className="flex items-center mb-2 text-[1.1rem] text-gray-600">
                                จำนวนที่ต้องการเบิก<LuAsterisk color="red" size={15} />
                            </span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setWithdrawQuantity(Math.max(1, withdrawQuantity - 1))}
                                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl text-2xl font-bold transition"
                                >
                                    -
                                </button>
                                <input 
                                    type="number" 
                                    value={withdrawQuantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setWithdrawQuantity(Math.min(Math.max(1, val), selectedProduct.quantity));
                                    }}
                                    min="1"
                                    max={selectedProduct.quantity}
                                    className="flex-1 border-2 border-[#e2e8f0] rounded-2xl text-[1.3rem] text-center px-5 py-3 font-bold transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" 
                                />
                                <button
                                    onClick={() => setWithdrawQuantity(Math.min(selectedProduct.quantity, withdrawQuantity + 1))}
                                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl text-2xl font-bold transition"
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>ขั้นต่ำ: 1</span>
                                <span>สูงสุด: {selectedProduct.quantity}</span>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5">
                            <div className="flex items-start gap-2">
                                <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-yellow-800 font-semibold">ข้อมูลการเบิก</p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        หลังเบิกจะเหลือ: <span className="font-bold">{(selectedProduct.quantity - withdrawQuantity).toLocaleString()}</span> หน่วย
                                    </p>
                                    {(selectedProduct.quantity - withdrawQuantity) === 0 && (
                                        <p className="text-xs text-red-600 mt-1 font-semibold">
                                            ⚠️ สินค้าจะถูกลบออกจากระบบ
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 mb-5"></div>
                    <div className="w-full flex justify-end items-center gap-5 px-5">
                        <button 
                            onClick={() => {
                                setWithdrawPopup(false);
                                setSelectedProduct(null);
                                setWithdrawQuantity(0);
                            }}
                            className="flex justify-center items-center border border-gray-400 rounded-2xl text-[1.3rem] text-gray-600 bg-white px-5 py-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-50"
                        >
                            ยกเลิก
                        </button>
                        <button 
                            onClick={() => {
                                if (withdrawQuantity > 0 && withdrawQuantity <= selectedProduct.quantity) {
                                    handleDeleteProduct(selectedProduct.productId, withdrawQuantity);
                                } else {
                                    alert('กรุณาระบุจำนวนที่ถูกต้อง');
                                }
                            }}
                            className="flex justify-center items-center border rounded-2xl text-[1.3rem] text-white bg-red-500 px-10 py-2 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(239,68,68,0.3)] hover:bg-red-600 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(239,68,68,0.4)]"
                        >
                            ยืนยันเบิก
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductManage;