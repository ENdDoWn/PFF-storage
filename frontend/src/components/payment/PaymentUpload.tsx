import { useState } from 'react';
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3005';

interface PaymentUploadProps {
  userId: string;
  rentalId?: string;
  onUploadSuccess?: (data: any) => void;
}

function PaymentUpload({ userId, rentalId, onUploadSuccess }: PaymentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG) หรือ PDF เท่านั้น');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('กรุณาเลือกไฟล์');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userId);
      if (rentalId) {
        formData.append('rentalId', rentalId);
      }

      const response = await fetch(`${API_URL}/api/upload/payment-slip`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการอัปโหลด');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('ไม่สามารถอัปโหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaCloudUploadAlt className="text-blue-600" />
        อัปโหลดหลักฐานการชำระเงิน
      </h2>

      {!uploadResult ? (
        <>
          {/* File Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              เลือกไฟล์ (JPG, PNG, PDF - ไม่เกิน 5MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleFileSelect}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="mb-6">
              <p className="text-gray-700 font-semibold mb-2">ตัวอย่าง:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border-2 border-gray-300 max-h-96 object-contain"
              />
            </div>
          )}

          {selectedFile && !preview && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700 font-semibold">ไฟล์ที่เลือก:</p>
              <p className="text-gray-600">{selectedFile.name}</p>
              <p className="text-gray-500 text-sm">
                ขนาด: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <FaTimesCircle className="text-red-600" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              !selectedFile || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                กำลังอัปโหลด...
              </span>
            ) : (
              'อัปโหลดหลักฐานการชำระเงิน'
            )}
          </button>
        </>
      ) : (
        /* Success Message */
        <div className="text-center py-6">
          <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-600 mb-2">อัปโหลดสำเร็จ!</h3>
          <p className="text-gray-600 mb-4">หลักฐานการชำระเงินของคุณถูกบันทึกแล้ว</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <p className="text-sm text-gray-600 mb-1">ชื่อไฟล์:</p>
            <p className="font-semibold text-gray-800 mb-3">{uploadResult.fileName}</p>
            
            <p className="text-sm text-gray-600 mb-1">ขนาด:</p>
            <p className="font-semibold text-gray-800 mb-3">
              {(uploadResult.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
            
            <p className="text-sm text-gray-600 mb-1">อัปโหลดเมื่อ:</p>
            <p className="font-semibold text-gray-800">
              {new Date(uploadResult.uploadedAt).toLocaleString('th-TH')}
            </p>
          </div>

          {uploadResult.url && (
            <a
              href={uploadResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-3"
            >
              ดูไฟล์ที่อัปโหลด
            </a>
          )}

          <button
            onClick={handleReset}
            className="block w-full py-2 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            อัปโหลดไฟล์ใหม่
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentUpload;
