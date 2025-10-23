// Type Definitions for PFF Storage Backend

/**
 * User Types
 */
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  attributes?: Record<string, any>;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  attributes?: Record<string, string>;
}

export interface UpdateUserInput {
  email?: string;
  attributes?: Record<string, string>;
}

/**
 * Authentication Types
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenInput {
  username: string;
  refreshToken: string;
}

export interface PasswordResetInput {
  username: string;
}

export interface PasswordResetConfirmInput {
  username: string;
  confirmationCode: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  accessToken: string;
  oldPassword: string;
  newPassword: string;
}

/**
 * Storage Types
 */
export interface StorageItem {
  id: string;
  userId: string;
  key: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface UploadFileInput {
  key: string;
  fileName: string;
  contentType: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface FileUploadResult {
  id: string;
  key: string;
  uploadUrl: string;
  expiresIn: number;
}

export interface FileDownloadResult {
  downloadUrl: string;
  expiresIn: number;
}

/**
 * DynamoDB Item Types
 */
export interface DynamoDBItem {
  PK: string;
  SK: string;
  [key: string]: any;
}

export interface QueryOptions {
  limit?: number;
  exclusiveStartKey?: Record<string, any>;
}

export interface QueryResult<T> {
  items: T[];
  lastEvaluatedKey?: Record<string, any>;
  count: number;
}

/**
 * Email Types
 */
export interface EmailData {
  to: string[];
  subject: string;
  body: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
}

export interface TemplatedEmailData {
  to: string[];
  templateName: string;
  templateData: Record<string, any>;
  from?: string;
}

/**
 * API Response Types
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    limit: number;
    nextToken?: string;
    hasMore: boolean;
  };
}

/**
 * AWS Configuration Types
 */
export interface AWSConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface S3Config extends AWSConfig {
  bucketName: string;
}

export interface DynamoDBConfig extends AWSConfig {
  tableName: string;
}

export interface CognitoConfig extends AWSConfig {
  userPoolId: string;
  clientId: string;
  clientSecret?: string;
}

/**
 * Environment Variables Type
 */
export interface EnvironmentVariables {
  // AWS
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  
  // DynamoDB
  DYNAMODB_TABLE_NAME: string;
  
  // S3
  S3_BUCKET_NAME: string;
  
  // Cognito
  COGNITO_USER_POOL_ID: string;
  COGNITO_CLIENT_ID: string;
  COGNITO_CLIENT_SECRET?: string;
  
  // SES
  SES_FROM_EMAIL: string;
  
  // Application
  NODE_ENV: "development" | "production" | "test";
  PORT: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  
  // CodePipeline (Optional)
  CODEPIPELINE_NAME?: string;
  CODEPIPELINE_BUCKET?: string;
}

/**
 * Utility Types
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Extended Request Context (for middleware)
 */
export interface RequestContext {
  user?: {
    sub: string;
    username: string;
    email?: string;
    [key: string]: any;
  };
  requestId?: string;
  startTime?: number;
}
