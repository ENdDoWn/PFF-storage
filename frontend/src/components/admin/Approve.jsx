import { IoMdCheckmarkCircleOutline, IoMdPerson } from "react-icons/io";
import { CgCloseO } from "react-icons/cg";
import { FaBuilding, FaWarehouse } from "react-icons/fa6";
import { FaCalendar, FaQrcode } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";

import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

function Approve(){
    const [Popup, setPopup] = useState(false);
    const [selectedPaymentSlip, setSelectedPaymentSlip] = useState("");
    const [pendingRentals, setPendingRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);

    useEffect(() => {
        fetchPendingRentals();
    }, []);

    const fetchPendingRentals = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/admin/rentals/pending`);
            const data = await response.json();
            
            if (data.success) {
                console.log('Pending rentals:', data.rentals);
                setPendingRentals(data.rentals);
            }
        } catch (error) {
            console.error('Error fetching pending rentals:', error);
        } finally {
            setLoading(false);
        }
    };

    const openPaymentSlip = (paymentSlipUrl) => {
        if (!paymentSlipUrl) {
            alert("ยังไม่มีสลิปชำระเงิน");
            return;
        }
        setSelectedPaymentSlip(paymentSlipUrl);
        setPopup(true);
    };

    const handleApprove = async (rental) => {
        if (!confirm(`ยืนยันการอนุมัติการจอง ${rental.warehouse?.name || 'คลัง'} ของ ${rental.user?.name || rental.userId}?`)) {
            return;
        }

        try {
            setApproving(true);
            const response = await fetch(`${API_URL}/api/admin/rentals/${rental.userId}/${rental.rentalId}/approve`, {
                method: 'POST'
            });

            const result = await response.json();

            if (result.success) {
                alert('อนุมัติการจองสำเร็จ!');
                fetchPendingRentals(); // Refresh list
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`);
            }
        } catch (error) {
            console.error('Error approving rental:', error);
            alert('เกิดข้อผิดพลาดในการอนุมัติ');
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async (rental) => {
        if (!confirm(`ยืนยันการปฏิเสธการจอง ${rental.warehouse?.name || 'คลัง'} ของ ${rental.user?.name || rental.userId}?`)) {
            return;
        }

        try {
            setApproving(true);
            const response = await fetch(`${API_URL}/api/admin/rentals/${rental.userId}/${rental.rentalId}/reject`, {
                method: 'POST'
            });

            const result = await response.json();

            if (result.success) {
                alert('ปฏิเสธการจองสำเร็จ');
                fetchPendingRentals(); // Refresh list
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`);
            }
        } catch (error) {
            console.error('Error rejecting rental:', error);
            alert('เกิดข้อผิดพลาดในการปฏิเสธ');
        } finally {
            setApproving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH');
    };

    return(
        <div className="px-10 py-5 bg-[#f2f2f2] min-h-screen">
            <h1 className="text-[1.7rem] font-bold">การอนุมัติการจอง</h1>
            <p className="text-gray-500 mb-5">จัดการคำขอเช่าคลังจากลูกค้า</p>
            
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <ImSpinner2 size={50} className="animate-spin text-blue-600" />
                    <p className="ml-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            ) : pendingRentals.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500 text-xl">ไม่มีคำขอรอการอนุมัติ</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-5">
                    {pendingRentals.map((rental) => (
                        <div key={rental.rentalId} className="flex flex-col border border-gray-200 rounded-xl shadow-sm p-7 bg-white gap-5">
                            <div className="flex justify-between">
                                <h1 className="text-[1.3rem] font-semibold">{rental.warehouse?.name || 'คลัง'}</h1>
                                <p className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-xl">รออนุมัติ</p>
                            </div>
                            <p className="flex justify-start items-center gap-3 text-gray-600">
                                <IoMdPerson /> {rental.user?.name || rental.userId}
                            </p>
                            <p className="flex justify-start items-center gap-3 text-gray-600">
                                <FaWarehouse /> {rental.warehouse?.name || 'N/A'} ({rental.warehouse?.size || 'N/A'} ตร.ม.)
                            </p>
                            <p className="flex justify-start items-center gap-3 text-gray-600">
                                <FaCalendar /> {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                            </p>
                            <div className="w-full flex justify-center items-center gap-5">
                                <button 
                                    onClick={() => handleApprove(rental)}
                                    disabled={approving}
                                    className="flex justify-center items-center gap-3 w-full py-2 text-white text-[1.2rem] bg-[#4658b2] border rounded-2xl shadow-sm cursor-pointer hover:bg-[#2f44af] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <IoMdCheckmarkCircleOutline /> อนุมัติ
                                </button>
                                <button 
                                    onClick={() => handleReject(rental)}
                                    disabled={approving}
                                    className="flex justify-center items-center gap-3 w-full py-2 text-white text-[1.2rem] bg-red-500 border rounded-2xl shadow-sm cursor-pointer hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <CgCloseO /> ปฏิเสธ
                                </button>
                            </div>
                            <button 
                                onClick={() => openPaymentSlip(rental.paymentSlip)} 
                                className={`flex justify-center items-center gap-3 w-full py-2 text-white text-[1.2rem] border rounded-2xl shadow-sm cursor-pointer ${rental.paymentSlip ? 'bg-teal-500 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                disabled={!rental.paymentSlip}
                            >
                                <FaQrcode /> {rental.paymentSlip ? 'ดูสลิปชำระเงิน' : 'ยังไม่มีสลิป'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            { Popup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white py-5 rounded-xl flex flex-col justify-center items-center w-[30%] max-w-[500px] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                        <div className="w-full flex justify-end pr-5 pb-3">
                            <IoClose onClick={() => setPopup(false)} size={30} className="text-gray-600 cursor-pointer transition duration-200 ease-in-out hover:text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold mb-3">สลิปชำระเงิน</h2>
                        {selectedPaymentSlip ? (
                            selectedPaymentSlip.endsWith('.pdf') ? (
                                <div className="w-[80%] text-center">
                                    <p className="mb-4">ไฟล์ PDF</p>
                                    <a href={selectedPaymentSlip} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        เปิดดู PDF
                                    </a>
                                </div>
                            ) : (
                                <img src={selectedPaymentSlip} alt="Payment Slip" className="w-[80%] h-auto rounded-lg" />
                            )
                        ) : (
                            <p className="text-gray-500">ไม่มีสลิปชำระเงิน</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Approve;