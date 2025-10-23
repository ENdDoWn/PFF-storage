// Error Handling Middleware for Elysia
import { Elysia } from "elysia";

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

/**
 * Custom Application Errors
 */
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}

/**
 * Format error response
 */
function formatErrorResponse(
  error: Error | AppError,
  statusCode: number,
  path?: string
): ErrorResponse {
  return {
    error: error.name || "Error",
    message: error.message || "An error occurred",
    statusCode,
    timestamp: new Date().toISOString(),
    path
  };
}

/**
 * Error Handler Middleware Plugin for Elysia
 */
export const errorMiddleware = new Elysia()
  .onError(({ error, set, path }) => {
    // Log error for debugging
    console.error(`[Error] ${error.name}:`, error.message);
    
    if (process.env.NODE_ENV === "development") {
      console.error(error.stack);
    }

    // Handle custom AppError
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return formatErrorResponse(error, error.statusCode, path);
    }

    // Handle validation errors (Elysia default)
    if (error.name === "ValidationError") {
      set.status = 400;
      return formatErrorResponse(error, 400, path);
    }

    // Handle AWS SDK errors
    if (error.name && error.name.includes("AWS")) {
      set.status = 502;
      return formatErrorResponse(
        new Error("AWS service error: " + error.message),
        502,
        path
      );
    }

    // Handle DynamoDB errors
    if (error.name === "ResourceNotFoundException") {
      set.status = 404;
      return formatErrorResponse(error, 404, path);
    }

    if (error.name === "ConditionalCheckFailedException") {
      set.status = 409;
      return formatErrorResponse(error, 409, path);
    }

    // Handle Cognito errors
    if (error.name === "UserNotFoundException") {
      set.status = 404;
      return formatErrorResponse(new Error("User not found"), 404, path);
    }

    if (error.name === "NotAuthorizedException") {
      set.status = 401;
      return formatErrorResponse(new Error("Invalid credentials"), 401, path);
    }

    if (error.name === "UsernameExistsException") {
      set.status = 409;
      return formatErrorResponse(new Error("Username already exists"), 409, path);
    }

    // Default error handling
    set.status = 500;
    return formatErrorResponse(
      new Error(process.env.NODE_ENV === "production" 
        ? "Internal Server Error" 
        : error.message
      ),
      500,
      path
    );
  });

/**
 * Request Logger Middleware
 */
export const loggerMiddleware = new Elysia()
  .onRequest(({ request, path }) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${path}`);
  })
  .onResponse(({ request, path, set }) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${path} - ${set.status}`);
  });

/**
 * CORS Middleware
 */
export const corsMiddleware = new Elysia()
  .onBeforeHandle(({ set }) => {
    set.headers = {
      ...set.headers,
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true"
    };
  });
