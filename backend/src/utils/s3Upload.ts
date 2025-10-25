import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET_NAME, S3_FOLDERS } from "../config/s3";

export interface UploadResult {
  success: boolean;
  key?: string;
  url?: string;
  error?: string;
}

/**
 * Upload a file to S3
 * @param file - File buffer
 * @param fileName - Original filename
 * @param folder - Folder in S3 (e.g., 'payment-slips')
 * @param userId - User ID for organizing files
 * @returns Upload result with S3 key and URL
 */
export const uploadFileToS3 = async (
  file: Buffer,
  fileName: string,
  folder: string = S3_FOLDERS.PAYMENT_SLIPS,
  userId?: string
): Promise<UploadResult> => {
  try {
    // Generate unique file key
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = userId 
      ? `${folder}/${userId}/${timestamp}_${sanitizedFileName}`
      : `${folder}/${timestamp}_${sanitizedFileName}`;

    // Determine content type
    const contentType = getContentType(fileName);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: contentType,
      // Make file publicly readable (optional, remove if you want private files)
      // ACL: 'public-read'
    });

    await s3Client.send(command);

    // Generate URL
    const url = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`;

    return {
      success: true,
      key: fileKey,
      url: url
    };
  } catch (error: any) {
    console.error('Error uploading file to S3:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
};

/**
 * Generate a presigned URL for secure file access
 * @param key - S3 file key
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned URL
 */
export const getPresignedUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

/**
 * Delete a file from S3
 * @param key - S3 file key
 * @returns Success boolean
 */
export const deleteFileFromS3 = async (key: string): Promise<boolean> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);
    return true;
  } catch (error: any) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
};

/**
 * Get content type from file extension
 */
function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const contentTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    // Default
    'txt': 'text/plain'
  };

  return contentTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Validate file type
 */
export const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(ext || '');
};

/**
 * Validate file size (in MB)
 */
export const validateFileSize = (fileSize: number, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};
