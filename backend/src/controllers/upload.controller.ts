import { uploadFileToS3, validateFileType, validateFileSize } from "../utils/s3Upload";
import { S3_FOLDERS } from "../config/s3";

// Allowed file types for payment slips
const ALLOWED_PAYMENT_SLIP_TYPES = ['jpg', 'jpeg', 'png', 'pdf'];
const MAX_FILE_SIZE_MB = 5; // 5MB max

/**
 * Upload payment slip
 */
export const uploadPaymentSlip = async ({ body, set }: any) => {
  try {
    const { file, userId, rentalId } = body;

    // Validation
    if (!file) {
      set.status = 400;
      return {
        success: false,
        error: "No file provided"
      };
    }

    if (!userId) {
      set.status = 400;
      return {
        success: false,
        error: "User ID is required"
      };
    }

    // Get file data
    const fileName = file.name || 'payment-slip.jpg';
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileSize = fileBuffer.length;

    // Validate file type
    if (!validateFileType(fileName, ALLOWED_PAYMENT_SLIP_TYPES)) {
      set.status = 400;
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_PAYMENT_SLIP_TYPES.join(', ')}`
      };
    }

    // Validate file size
    if (!validateFileSize(fileSize, MAX_FILE_SIZE_MB)) {
      set.status = 400;
      return {
        success: false,
        error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`
      };
    }

    // Create folder path with rentalId if provided
    const folder = rentalId 
      ? `${S3_FOLDERS.PAYMENT_SLIPS}/${userId}/${rentalId}`
      : `${S3_FOLDERS.PAYMENT_SLIPS}/${userId}`;

    // Upload to S3
    const result = await uploadFileToS3(
      fileBuffer,
      fileName,
      folder
    );

    if (!result.success) {
      set.status = 500;
      return {
        success: false,
        error: result.error || "Failed to upload file"
      };
    }

    return {
      success: true,
      data: {
        key: result.key,
        url: result.url,
        fileName: fileName,
        fileSize: fileSize,
        uploadedAt: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('Error in uploadPaymentSlip:', error);
    set.status = 500;
    return {
      success: false,
      error: error.message || "Failed to upload payment slip"
    };
  }
};

/**
 * Upload warehouse image
 */
export const uploadWarehouseImage = async ({ body, set }: any) => {
  try {
    const { file, warehouseId } = body;

    if (!file) {
      set.status = 400;
      return {
        success: false,
        error: "No file provided"
      };
    }

    if (!warehouseId) {
      set.status = 400;
      return {
        success: false,
        error: "Warehouse ID is required"
      };
    }

    const fileName = file.name || 'warehouse-image.jpg';
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Validate image types only
    if (!validateFileType(fileName, ['jpg', 'jpeg', 'png', 'webp'])) {
      set.status = 400;
      return {
        success: false,
        error: "Invalid image type. Allowed: jpg, jpeg, png, webp"
      };
    }

    // Validate file size (10MB for images)
    if (!validateFileSize(fileBuffer.length, 10)) {
      set.status = 400;
      return {
        success: false,
        error: "Image size exceeds 10MB limit"
      };
    }

    // Upload to S3
    const folder = `${S3_FOLDERS.WAREHOUSE_IMAGES}/${warehouseId}`;
    const result = await uploadFileToS3(fileBuffer, fileName, folder);

    if (!result.success) {
      set.status = 500;
      return {
        success: false,
        error: result.error || "Failed to upload image"
      };
    }

    return {
      success: true,
      data: {
        key: result.key,
        url: result.url,
        fileName: fileName,
        uploadedAt: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('Error in uploadWarehouseImage:', error);
    set.status = 500;
    return {
      success: false,
      error: error.message || "Failed to upload warehouse image"
    };
  }
};
