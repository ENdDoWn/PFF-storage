// S3 Service Layer
import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET_NAME } from "../config/aws";

export class S3Service {
  
  /**
   * Upload file to S3
   */
  async uploadFile(
    key: string, 
    body: Buffer | Uint8Array | Blob | string,
    contentType?: string
  ) {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType
    });
    
    const response = await s3Client.send(command);
    return response;
  }

  /**
   * Get file from S3
   */
  async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    });
    
    const response = await s3Client.send(command);
    return response;
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    });
    
    const response = await s3Client.send(command);
    return response;
  }

  /**
   * List files in S3 bucket
   */
  async listFiles(prefix?: string, maxKeys?: number) {
    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys
    });
    
    const response = await s3Client.send(command);
    return response.Contents;
  }

  /**
   * Get presigned URL for file upload
   */
  async getPresignedUploadUrl(
    key: string, 
    expiresIn: number = 3600,
    contentType?: string
  ) {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  }

  /**
   * Get presigned URL for file download
   */
  async getPresignedDownloadUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key
      });
      
      await s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string) {
    const command = new HeadObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    });
    
    const response = await s3Client.send(command);
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata
    };
  }
}

export const s3Service = new S3Service();
