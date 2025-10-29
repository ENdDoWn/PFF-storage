import { S3Client } from "@aws-sdk/client-s3";

// Initialize S3 Client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  // credentials: {
  //   accessKeyId: process.env.LAB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
  //   secretAccessKey: process.env.LAB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  //   sessionToken: process.env.LAB_SESSION_TOKEN // Required for AWS Learner Lab
  // }
});

// S3 Bucket Configuration
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "pff-storage-uploads";
export const S3_REGION = process.env.AWS_REGION || "us-east-1";

// Folder structure in S3
export const S3_FOLDERS = {
  PAYMENT_SLIPS: "payment-slips",
  WAREHOUSE_IMAGES: "warehouse-images",
  USER_DOCUMENTS: "user-documents"
};
