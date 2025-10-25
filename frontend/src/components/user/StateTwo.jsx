import { FaWarehouse } from "react-icons/fa6";
import { GrFormNextLink } from "react-icons/gr";
import { FaDoorOpen } from "react-icons/fa";

import { useState, useEffect } from "react";
import { fetchUserAttributes } from 'aws-amplify/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

function StateTwo({ onNext }){
    const [Rent, setRent] = useState("");
    const [CustomTime, setCustomTime] = useState("");
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [warehouse, setWarehouse] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get selected warehouse from sessionStorage
        const selectedWarehouse = sessionStorage.getItem('selectedWarehouse');
        if (selectedWarehouse) {
            const warehouseData = JSON.parse(selectedWarehouse);
            setWarehouse(warehouseData);
            // Fetch available rooms for this warehouse
            fetchAvailableRooms(warehouseData.id || warehouseData.warehouseId);
        }
        
        // Get user info
        fetchUser();
    }, []);

    const fetchAvailableRooms = async (warehouseId) => {
        try {
            const response = await fetch(`${API_URL}/warehouses/${warehouseId}/rooms`);
            const data = await response.json();
            
            if (data.success) {
                // Filter only available rooms
                const available = data.rooms.filter(room => room.status === 'AVAILABLE');
                setAvailableRooms(available);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setError('ไม่สามารถโหลดข้อมูลห้องได้');
        }
    };

    const fetchUser = async () => {
        try {
            const attributes = await fetchUserAttributes();
            setUserInfo(attributes);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const toggleRoomSelection = (room) => {
        setSelectedRooms(prev => {
            const isSelected = prev.find(r => r.roomId === room.roomId);
            if (isSelected) {
                return prev.filter(r => r.roomId !== room.roomId);
            } else {
                return [...prev, room];
            }
        });
    };

    const calculateMonths = () => {
        if (Rent === "other") return parseInt(CustomTime) || 0;
        if (Rent === "3 เดือน") return 3;
        if (Rent === "6 เดือน") return 6;
        if (Rent === "12 เดือน") return 12;
        if (Rent === "24 เดือน") return 24;
        return 0;
    };

    const calculateEndDate = () => {
        if (!startDate) return "";
        const months = calculateMonths();
        const start = new Date(startDate);
        start.setMonth(start.getMonth() + months);
        return start.toISOString().split('T')[0];
    };

    const calculateTotal = () => {
        if (!warehouse) return 0;
        return warehouse.price * selectedRooms.length * calculateMonths();
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        // Validation
        if (selectedRooms.length === 0) {
            setError("กรุณาเลือกห้องที่ต้องการเช่าอย่างน้อย 1 ห้อง");
            setLoading(false);
            return;
        }
        if (!Rent) {
            setError("กรุณาเลือกระยะเวลาการเช่า");
            setLoading(false);
            return;
        }
        if (Rent === "other" && !CustomTime) {
            setError("กรุณากำหนดระยะเวลาเช่า");
            setLoading(false);
            return;
        }
        if (!startDate) {
            setError("กรุณาเลือกวันเริ่มต้นเช่า");
            setLoading(false);
            return;
        }

        try {
            const endDate = calculateEndDate();
            const userId = userInfo.email?.split('@')[0] || userInfo.sub;
            const warehouseId = warehouse.id || warehouse.warehouseId;

            // Create rental for each selected room
            const rentalPromises = selectedRooms.map(room => {
                const rentalData = {
                    userId,
                    roomId: room.roomId,
                    warehouseId,
                    startDate,
                    endDate
                };

                return fetch(`${API_URL}/api/rentals`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rentalData)
                });
            });

            const responses = await Promise.all(rentalPromises);
            const results = await Promise.all(responses.map(r => r.json()));

            // Check if all rentals were successful
            const allSuccessful = results.every(r => r.success);

            if (allSuccessful) {
                // Store booking info for next step
                const bookingInfo = {
                    warehouse,
                    rooms: selectedRooms,
                    rentals: results.map(r => r.rental),
                    startDate,
                    endDate,
                    months: calculateMonths(),
                    total: calculateTotal(),
                    userId,
                    userEmail: userInfo.email,
                    userName: userInfo.name
                };
                sessionStorage.setItem('currentBooking', JSON.stringify(bookingInfo));
                onNext();
            } else {
                const failedRentals = results.filter(r => !r.success);
                setError(`เกิดข้อผิดพลาด: ${failedRentals[0]?.error || 'ไม่สามารถจองห้องได้'}`);
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        } finally {
            setLoading(false);
        }
    };

    if (!warehouse) {
        return (
            <div className="pt-[80px] flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold">กรุณาเลือกโกดังก่อนทำการจอง</div>
            </div>
        );
    }

    return(
        <div className="pt-[80px] flex flex-col items-center gap-10 font-Montserrat">
            <div className="flex gap-5 w-full max-w-[800px]">
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-blue-600 shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-white text-blue-600 text-[1.5rem] font-bold">1</button>
                    <p className="text-white text-[1rem] font-semibold">เลือกห้องที่จะเช่า</p>
                </div>
                <div className="flex flex-1 items-center border-none rounded-xl px-7 py-5 gap-5 bg-[#f4f6f7] shadow-sm">
                    <button className="rounded-full w-12 h-12 bg-[#b3bec3] text-white text-[1.5rem] font-bold">2</button>
                    <p className="text-[#b3bec3] text-[1rem] font-semibold">ชำระเงิน</p>
                </div>
            </div>
            <div className="flex flex-col items-center w-[60%]">
                <div className="flex flex-col justify-center items-center mb-10">
                    <h1 className="flex items-center gap-3 text-[2rem] font-bold text-[#3b5bdb]"><FaWarehouse className="text-[2.5rem]" />เลือกห้องที่จะเช่า</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#3b5bdb] to-[#74c0fc] rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-1 gap-5 w-full mb-10">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-5">
                            {error}
                        </div>
                    )}
                    <div className="w-full border border-[#e2e8f0] rounded-2xl px-10 py-6 mb-10 transition duration-300 ease-in-out shadow-sm hover:border-[#3b5bdb] hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]">
                        <h1 className="flex justify-start items-center gap-3 text-[1.7rem] text-[#3b5bdb] font-bold mb-5"><FaDoorOpen size={35} />รายละเอียดการเช่า</h1>
                        
                        <div className="flex flex-col justify-center mb-5">
                            <span className="text-[1.2rem] mb-2">เลือกห้องที่ต้องการเช่า</span>
                            {availableRooms.length === 0 ? (
                                <p className="text-gray-500 py-4">กำลังโหลดห้องที่ว่าง...</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {availableRooms.map((room) => (
                                        <button
                                            key={room.roomId}
                                            onClick={() => toggleRoomSelection(room)}
                                            className={`border-2 rounded-xl px-4 py-3 text-center transition duration-300 ${
                                                selectedRooms.find(r => r.roomId === room.roomId)
                                                    ? 'border-[#3b5bdb] bg-[#3b5bdb] text-white shadow-md'
                                                    : 'border-[#e2e8f0] hover:border-[#3b5bdb] hover:bg-blue-50'
                                            }`}
                                        >
                                            <div className="font-semibold">ห้อง {room.roomNumber}</div>
                                            <div className="text-sm opacity-80">{room.size}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <span className="text-sm text-gray-500 mt-2">
                                เลือกแล้ว: {selectedRooms.length} ห้อง | เหลือห้องว่าง: {availableRooms.length} ห้อง
                            </span>
                        </div>
                        
                        <div className="flex flex-col justify-center mb-5">
                            <span className="text-[1.2rem] mb-2">ระยะเวลาการเช่า</span>
                            <div className="w-full flex flex-col justify-center items-center gap-4">
                                <select value={Rent} onChange={(e) => setRent(e.target.value)} className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] text-gray-800 px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]">
                                    <option value=""> --- กรุณาเลือกระยะเวลาการเช่า --- </option>
                                    <option>3 เดือน</option>
                                    <option>6 เดือน</option>
                                    <option>12 เดือน</option>
                                    <option>24 เดือน</option>
                                    <option value="other">อื่น ๆ</option>
                                </select>
                                { Rent === "other" && (
                                    <input 
                                        type="number" 
                                        placeholder="กรุณากำหนดระยะเวลาเช่าเป็นจำนวนเดือน" 
                                        value={CustomTime} 
                                        onChange={(e) => setCustomTime(e.target.value)} 
                                        className="w-full border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" 
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center mb-5">
                            <span className="text-[1.2rem] mb-2">วันเริ่มต้นเช่า</span>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="border-2 border-[#e2e8f0] rounded-2xl text-[1.1rem] px-5 py-3 transition duration-300 ease-in-out focus:outline-none focus:border-[#3b5bdb] focus:shadow-[0_0_0_4px_rgba(59,91,219,0.1)]" 
                            />
                        </div>
                    </div>
                    <div className="w-full bg-[#f8f9fa] rounded-2xl px-10 py-6 flex flex-col">
                        <h1 className="flex items-center justify-center text-[1.7rem] text-[#3b5bdb] font-bold">สรุปรายการเช่า</h1>
                        <div className="flex justify-between mt-5 mb-2">
                            <p>โกดัง:</p>
                            <p>{warehouse.name}</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>ห้องที่เลือก:</p>
                            <p className="text-right">
                                {selectedRooms.length > 0 
                                    ? selectedRooms.map(r => r.roomNumber).join(', ')
                                    : '-'
                                }
                            </p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>จำนวนห้อง:</p>
                            <p>{selectedRooms.length} ห้อง</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>ราคาต่อเดือน:</p>
                            <p>{warehouse.price.toLocaleString()} บาท</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>ระยะเวลาเช่า:</p>
                            <p>{calculateMonths() || '-'} เดือน</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>วันเริ่มต้น:</p>
                            <p>{startDate || '-'}</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3">
                            <p>วันสิ้นสุด:</p>
                            <p>{calculateEndDate() || '-'}</p>
                        </div>
                        <hr className="h-[1px] bg-[#dee1e4] border-0" />
                        <div className="flex justify-between mt-5 mb-3 text-[1.3rem] font-semibold">
                            <p>รวมทั้งหมด:</p>
                            <p>{calculateTotal().toLocaleString()} บาท</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end items-end px-5 mb-10">
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className={`flex justify-center items-center border rounded-2xl text-[1.5rem] text-white px-10 py-3 cursor-pointer transition duration-300 ease-in-out shadow-[0_5px_15px_rgba(37,99,235,0.3)] ${
                            loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]'
                        }`}>
                        {loading ? 'กำลังดำเนินการ...' : 'ต่อไป'} <GrFormNextLink />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StateTwo;