// AWS SDK Configuration
import { S3Client } from "@aws-sdk/client-s3";

// Load environment variables
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "pff-storage-bucket";

// S3 Client Configuration
const s3Client = new S3Client({
  region: AWS_REGION,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  // }
});

export {
  s3Client,
  S3_BUCKET_NAME,
  AWS_REGION
};
