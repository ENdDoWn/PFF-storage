import { IoSearchOutline, IoClose } from "react-icons/io5";
import { IoIosEye } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

function User(){
    const [Popup, setPopup] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/admin/users/cognito`);
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const statusMap = {
            'CONFIRMED': { bg: 'bg-green-100', text: 'text-green-800', label: 'ยืนยันแล้ว' },
            'UNCONFIRMED': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'ยังไม่ยืนยัน' },
            'FORCE_CHANGE_PASSWORD': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'ต้องเปลี่ยนรหัสผ่าน' },
            'ARCHIVED': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'เก็บถาวร' },
        };
        const config = statusMap[status] || { bg: 'bg-blue-100', text: 'text-blue-800', label: status };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-semibold`}>
                {config.label}
            </span>
        );
    };
    return(
        <div className="min-h-screen px-10 py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">จัดการผู้เช่า</h1>
                <p className="text-gray-600 text-lg">ดูรายชื่อผู้เช่าและสถานะการเช่า</p>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3"></div>
            </div>
            <div className="flex flex-col w-full p-8 border border-gray-200 rounded-2xl shadow-lg bg-white">
                <div className="flex justify-start gap-4 mb-8 w-full">
                    <div className="flex items-center border-2 border-gray-300 rounded-xl px-5 py-3 focus-within:border-blue-500 focus-within:shadow-lg w-[60%] bg-gray-50 transition-all duration-200">
                        <IoSearchOutline className="text-gray-400 mr-3" size={22} />
                        <input 
                            type="search" 
                            placeholder="ค้นหารายชื่อผู้เช่า..." 
                            className="flex-1 outline-none text-gray-700 bg-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex justify-center items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold cursor-pointer transform transition duration-300 ease-in-out hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        ค้นหา ({filteredUsers.length})
                    </button>
                </div>
                
                {loading ? (
                    <div className="text-center py-10">กำลังโหลดข้อมูลผู้ใช้...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        {searchTerm ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ยังไม่มีผู้ใช้ในระบบ'}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                        <table className="w-full">
                            <thead className="text-left bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm font-bold border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">ผู้เช่า</th>
                                    <th className="px-6 py-4">สถานะ</th>
                                    <th className="px-6 py-4">จำนวนการเช่า</th>
                                    <th className="px-6 py-4">กำลังเช่า</th>
                                    <th className="px-6 py-4">รออนุมัติ</th>
                                    <th className="px-6 py-4">วันที่สมัคร</th>
                                    <th className="px-6 py-4">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-base">
                                {filteredUsers.map((user) => (
                                    <tr key={user.userId} className="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200">
                                        <td className="px-6 py-4 font-medium">
                                            <div>
                                                <p className="font-bold text-gray-800">{user.name || user.username}</p>
                                                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-start">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                                            {user.totalRentals || 0}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                                                {user.activeRentals || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                                                {user.pendingRentals || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-start text-gray-600 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="px-6 py-4 text-start">
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    className="p-2.5 text-lg text-gray-600 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200 hover:scale-110"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setPopup(true);
                                                    }}
                                                >
                                                    <IoIosEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                { Popup && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white py-6 rounded-2xl flex flex-col justify-center items-start w-[55%] max-w-4xl shadow-2xl transform transition-all duration-300">
                            <div className="flex justify-between items-center w-full px-6 mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">ข้อมูลผู้ใช้ - {selectedUser.name || selectedUser.username}</h1>
                                    <p className="text-sm text-gray-500 mt-1">ข้อมูลผู้เช่าและรายละเอียดการจอง</p>
                                </div>
                                <button onClick={() => {setPopup(false); setSelectedUser(null);}} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200">
                                    <IoClose size={28} />
                                </button>
                            </div>
                            <div className="w-full h-[2px] bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 mb-6"></div>
                            <div className="w-full px-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold text-xl text-gray-800">ข้อมูลผู้เช่า</h1>
                                </div>
                                <div className="grid grid-cols-3 gap-6 bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-5 rounded-2xl border border-gray-200 shadow-sm">
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-1">ชื่อผู้ใช้</p>
                                        <p className="text-base font-semibold text-gray-800">{selectedUser.name || selectedUser.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-1">อีเมล</p>
                                        <p className="text-base font-semibold text-gray-800">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-1">สถานะ</p>
                                        {getStatusBadge(selectedUser.status)}
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-1">วันที่สมัคร</p>
                                        <p className="text-base font-semibold text-gray-800">
                                            {new Date(selectedUser.createdAt).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-1">อัปเดตล่าสุด</p>
                                        <p className="text-base font-semibold text-gray-800">
                                            {new Date(selectedUser.lastModified).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-1">User ID</p>
                                        <p className="text-xs font-mono text-gray-600 break-all">{selectedUser.userId}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h2 className="font-bold text-xl text-gray-800 mb-4">สถิติการเช่า</h2>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="bg-white px-6 py-4 rounded-xl border-2 border-blue-200 shadow-sm">
                                            <p className="text-gray-600 text-sm font-semibold mb-1">จำนวนการเช่าทั้งหมด</p>
                                            <p className="text-3xl font-bold text-blue-600">{selectedUser.totalRentals || 0}</p>
                                        </div>
                                        <div className="bg-white px-6 py-4 rounded-xl border-2 border-green-200 shadow-sm">
                                            <p className="text-gray-600 text-sm font-semibold mb-1">กำลังเช่า</p>
                                            <p className="text-3xl font-bold text-green-600">{selectedUser.activeRentals || 0}</p>
                                        </div>
                                        <div className="bg-white px-6 py-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                                            <p className="text-gray-600 text-sm font-semibold mb-1">รออนุมัติ</p>
                                            <p className="text-3xl font-bold text-yellow-600">{selectedUser.pendingRentals || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h2 className="font-bold text-xl text-gray-800 mb-4">สถานะบัญชี</h2>
                                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-4 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm font-semibold mb-1">สถานะการใช้งาน</p>
                                                <p className="text-base font-semibold text-gray-800">
                                                    {selectedUser.enabled ? '✅ เปิดใช้งาน' : '❌ ปิดใช้งาน'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm font-semibold mb-1">Username</p>
                                                <p className="text-base font-semibold text-gray-800">{selectedUser.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default User;