import { IoMdPerson } from "react-icons/io";
import { LuLockKeyhole } from "react-icons/lu";
import { MdPhone, MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa6";
import { useState } from "react";
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';

function BoxRegister({ onSwitch }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [username, setUsername] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
            setLoading(false);
            return;
        }

        try {
            const fullName = `${formData.firstName} ${formData.lastName}`;
            const usernameToUse = formData.email.split('@')[0];

            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: usernameToUse,
                password: formData.password,
                options: {
                    userAttributes: {
                        email: formData.email,
                        name: fullName,
                        nickname: formData.companyName,
                        phone_number: formData.phone.startsWith('+') ? formData.phone : `+66${formData.phone.replace(/^0/, '')}`, // phone_number with country code
                        address: formData.address
                    },
                    autoSignIn: false
                }
            });

            //confirmation
            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                setSuccess(true);
                setUsername(usernameToUse);
                setShowConfirmation(true);
                setError("กรุณากรอกรหัสยืนยันที่ส่งไปยังอีเมลของคุณ");
            } else if (isSignUpComplete) {
                setSuccess(true);
                setError("ลงทะเบียนสำเร็จ!");
                setTimeout(() => {
                    onSwitch();
                }, 2000);
            }

        } catch (err) {
            if (err.name === 'UsernameExistsException') {
                setError("อีเมลนี้ถูกใช้งานแล้ว");
            } else if (err.name === 'InvalidPasswordException') {
                setError("รหัสผ่านไม่ตรงตามข้อกำหนด: ต้องมีอย่างน้อย 8 ตัวอักษร, ตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก, ตัวเลข และอักขระพิเศษ");
            } else if (err.name === 'InvalidParameterException') {
                setError("ข้อมูลไม่ถูกต้อง: " + err.message);
            } else {
                setError(err.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
            }
        }

        setLoading(false);
    };

    const handleConfirmSignUp = async (e) => {
        e.preventDefault();
        setConfirmLoading(true);
        setError("");

        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: username,
                confirmationCode: confirmationCode
            });

            console.log("Confirmation response:", { isSignUpComplete, nextStep });

            if (isSignUpComplete) {
                setSuccess(true);
                setError("ยืนยันบัญชีสำเร็จ! กำลังเข้าสู่ระบบ...");
                try {
                    const { isSignedIn } = await signIn({
                        username: username,
                        password: formData.password
                    });

                    if (isSignedIn) {
                        console.log("Auto-login successful");
                        setTimeout(() => {
                            window.location.href = "/main";
                        }, 1500);
                    }
                } catch (loginErr) {
                    console.error("Auto-login error:", loginErr);
                    setError("ยืนยันบัญชีสำเร็จ! กรุณาเข้าสู่ระบบ");
                    setTimeout(() => {
                        onSwitch();
                    }, 2000);
                }
            }
        } catch (err) {
            console.error("Confirmation error:", err);
            
            if (err.name === 'CodeMismatchException') {
                setError("รหัสยืนยันไม่ถูกต้อง");
            } else if (err.name === 'ExpiredCodeException') {
                setError("รหัสยืนยันหมดอายุ กรุณาขอรหัสใหม่");
            } else if (err.name === 'LimitExceededException') {
                setError("พยายามยืนยันมากเกินไป กรุณารอสักครู่");
            } else {
                setError(err.message || "เกิดข้อผิดพลาดในการยืนยันบัญชี");
            }
            setSuccess(false);
        }

        setConfirmLoading(false);
    };

    return (
        <div className="flex flex-col justify-center items-center bg-white p-10 font-Montserrat w-full max-h-screen overflow-y-auto relative">
            <h1 className="text-[4vh] font-bold text-blue-600 mb-2">PFF Storage</h1>
            <p className="text-gray-500 text-[2vh] mb-6">ลงทะเบียน</p>

            {/* Confirmation Modal/Popup */}
            {showConfirmation && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">ยืนยันบัญชี</h2>
                        <p className="text-gray-600 text-center mb-6">
                            เราได้ส่งรหัสยืนยันไปยัง<br />
                            <span className="font-semibold">{formData.email}</span>
                        </p>
                        
                        <form onSubmit={handleConfirmSignUp} className="flex flex-col gap-4">
                            <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500">
                                <LuLockKeyhole className="text-gray-400 mr-3" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="รหัสยืนยัน 6 หลัก"
                                    value={confirmationCode}
                                    onChange={(e) => setConfirmationCode(e.target.value)}
                                    className="flex-1 outline-none text-gray-700 text-center text-lg tracking-widest"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            {error && (
                                <div className={`text-sm text-center ${success ? 'text-green-600' : 'text-red-500'}`}>
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 cursor-pointer disabled:opacity-50"
                                disabled={confirmLoading}
                            >
                                {confirmLoading ? "กำลังยืนยัน..." : "ยืนยันบัญชี"}
                            </button>

                            <button 
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 cursor-pointer"
                            >
                                ยกเลิก
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mb-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                        <IoMdPerson className="text-gray-400 mr-3" size={20} />
                        <input 
                            type="text" 
                            name="firstName"
                            placeholder="ชื่อจริง" 
                            value={formData.firstName}
                            onChange={handleChange}
                            className="flex-1 outline-none text-gray-700"
                            required
                        />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                        <IoMdPerson className="text-gray-400 mr-3" size={20} />
                        <input 
                            type="text" 
                            name="lastName"
                            placeholder="นามสกุล" 
                            value={formData.lastName}
                            onChange={handleChange}
                            className="flex-1 outline-none text-gray-700"
                            required
                        />
                    </div>
                </div>

                {/* Company Name */}
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <FaBuilding className="text-gray-400 mr-3" size={20} />
                    <input 
                        type="text" 
                        name="companyName"
                        placeholder="ชื่อบริษัท หรือ ชื่อร้านค้า" 
                        value={formData.companyName}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-700"
                    />
                </div>

                {/* Phone */}
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <MdPhone className="text-gray-400 mr-3" size={20} />
                    <input 
                        type="tel" 
                        name="phone"
                        placeholder="เบอร์โทรศัพท์ (เช่น 0812345678)" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-700"
                        required
                    />
                </div>

                {/* Address */}
                <div className="flex items-start border border-gray-300 rounded-2xl px-4 py-2 focus-within:border-blue-500">
                    <IoLocationSharp className="text-gray-400 mr-3 mt-1" size={20} />
                    <textarea 
                        name="address"
                        placeholder="ที่อยู่ของคุณ" 
                        value={formData.address}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-700 resize-none"
                        rows="2"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <MdEmail className="text-gray-400 mr-3" size={20} />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-700"
                        required
                    />
                </div>

                {/* Password */}
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <LuLockKeyhole className="text-gray-400 mr-3" size={20} />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password (อย่างน้อย 8 ตัวอักษร)" 
                        value={formData.password}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-700"
                        required
                    />
                </div>

                {/* Confirm Password */}
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500">
                    <LuLockKeyhole className="text-gray-400 mr-3" size={20} />
                    <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirm Password" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-700"
                        required
                    />
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className={`text-sm text-center ${success ? 'text-green-600' : 'text-red-500'}`}>
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    className="mt-4 w-full bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-all duration-300 cursor-pointer disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "กำลังลงทะเบียน..." : "ยืนยัน"}
                </button>
            </form>
            <div className="mt-5 text-[1.8vh] text-gray-500">
                <p>มีบัญชีแล้ว?{" "}
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline" onClick={onSwitch}>เข้าสู่ระบบ</span>
                </p>
            </div>
        </div>
    );
}

export default BoxRegister;
