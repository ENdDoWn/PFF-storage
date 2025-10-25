import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHome } from 'react-icons/fa';
import { MdError } from 'react-icons/md';

function Forbidden() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4 font-Montserrat">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <FaShieldAlt className="text-red-500 text-9xl opacity-20 absolute -top-4 -left-4" />
            <MdError className="text-red-600 text-8xl relative z-10" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-red-600 mb-4">403</h1>
        
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          ไม่มีสิทธิ์เข้าถึง
        </h2>
        
        {/* Description */}
        <p className="text-xl text-gray-600 mb-8">
          คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p className="text-gray-700 mb-4">
            หน้านี้สำหรับผู้ดูแลระบบเท่านั้น
          </p>
          <p className="text-sm text-gray-500">
            หากคุณคิดว่านี่เป็นข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/main"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <FaHome size={20} />
            กลับสู่หน้าหลัก
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            ย้อนกลับ
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>รหัสข้อผิดพลาด: 403 Forbidden</p>
          <p>หากต้องการความช่วยเหลือ กรุณาติดต่อ support@pffstorage.com</p>
        </div>
      </div>
    </div>
  );
}

export default Forbidden;
