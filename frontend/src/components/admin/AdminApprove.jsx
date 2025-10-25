import { useState, useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { FaCheck, FaTimes, FaClock, FaWarehouse } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

function AdminApprove() {
  const [pendingRentals, setPendingRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminId, setAdminId] = useState('');
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchAdmin();
    fetchPendingRentals();
  }, []);

  const fetchAdmin = async () => {
    try {
      const attributes = await fetchUserAttributes();
      setAdminId(attributes.email?.split('@')[0] || attributes.sub);
    } catch (error) {
      console.error('Error fetching admin:', error);
    }
  };

  const fetchPendingRentals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/rentals/pending`);
      const data = await response.json();
      
      if (data.success) {
        setPendingRentals(data.rentals);
      } else {
        setError(data.error || 'ไม่สามารถโหลดรายการจองได้');
      }
    } catch (error) {
      console.error('Error fetching pending rentals:', error);
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (rental) => {
    if (!window.confirm(`ยืนยันการอนุมัติการจอง ${rental.warehouseName} ห้อง ${rental.roomNumber}?`)) {
      return;
    }

    setProcessing({ ...processing, [rental.rentalId]: 'approving' });

    try {
      const response = await fetch(
        `${API_URL}/api/admin/rentals/${rental.userId}/${rental.rentalId}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ approvedBy: adminId })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('อนุมัติการจองสำเร็จ!');
        fetchPendingRentals(); // Refresh list
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.error}`);
      }
    } catch (error) {
      console.error('Error approving rental:', error);
      alert('ไม่สามารถอนุมัติการจองได้');
    } finally {
      setProcessing({ ...processing, [rental.rentalId]: null });
    }
  };

  const handleReject = async (rental) => {
    if (!window.confirm(`ยืนยันการปฏิเสธการจอง ${rental.warehouseName} ห้อง ${rental.roomNumber}?`)) {
      return;
    }

    setProcessing({ ...processing, [rental.rentalId]: 'rejecting' });

    try {
      const response = await fetch(
        `${API_URL}/api/admin/rentals/${rental.userId}/${rental.rentalId}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rejectedBy: adminId })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('ปฏิเสธการจองสำเร็จ!');
        fetchPendingRentals(); // Refresh list
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.error}`);
      }
    } catch (error) {
      console.error('Error rejecting rental:', error);
      alert('ไม่สามารถปฏิเสธการจองได้');
    } finally {
      setProcessing({ ...processing, [rental.rentalId]: null });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl font-semibold text-gray-700">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <FaClock className="text-blue-600" />
            อนุมัติการจองคลังสินค้า
          </h1>
          <p className="text-gray-600">จัดการคำขอจองที่รอการอนุมัติ</p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3 mx-auto"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Pending Rentals Count */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <p className="text-lg font-semibold text-gray-700">
            มีคำขอจองที่รอการอนุมัติ: <span className="text-blue-600">{pendingRentals.length}</span> รายการ
          </p>
        </div>

        {/* Rentals Table */}
        {pendingRentals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaCheck className="text-6xl text-green-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">ไม่มีคำขอจองที่รอการอนุมัติ</p>
            <p className="text-gray-500 mt-2">คำขอจองทั้งหมดได้รับการอนุมัติแล้ว</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้จอง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      คลังสินค้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ห้อง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ขนาด
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่เริ่มต้น
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันสิ้นสุด
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่จอง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingRentals.map((rental) => (
                    <tr key={rental.rentalId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rental.userId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaWarehouse className="text-blue-600" />
                          <span className="text-sm text-gray-900">{rental.warehouseName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{rental.roomNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {rental.roomSize}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(rental.startDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(rental.endDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(rental.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(rental)}
                            disabled={processing[rental.rentalId]}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <FaCheck />
                            {processing[rental.rentalId] === 'approving' ? 'กำลังอนุมัติ...' : 'อนุมัติ'}
                          </button>
                          <button
                            onClick={() => handleReject(rental)}
                            disabled={processing[rental.rentalId]}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <FaTimes />
                            {processing[rental.rentalId] === 'rejecting' ? 'กำลังปฏิเสธ...' : 'ปฏิเสธ'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApprove;
