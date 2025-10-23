// Authentication Middleware for Elysia
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Load environment variables
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID!;
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";

// Create Cognito JWT Verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_CLIENT_ID,
});

export interface AuthUser {
  sub: string;
  username: string;
  email?: string;
  [key: string]: any;
}

/**
 * Verify Cognito JWT Token
 */
export async function verifyCognitoToken(token: string): Promise<AuthUser> {
  try {
    const payload = await verifier.verify(token);
    return {
      sub: payload.sub,
      username: payload.username || payload["cognito:username"] || "",
      email: payload.email,
      ...payload
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Auth Middleware Plugin for Elysia
 */
export const authMiddleware = new Elysia()
  .derive(async ({ headers, set }) => {
    const authHeader = headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      set.status = 401;
      throw new Error("Authorization token required");
    }

    try {
      const user = await verifyCognitoToken(token);
      return { user };
    } catch (error) {
      set.status = 401;
      throw new Error("Invalid authentication token");
    }
  });

/**
 * Optional Auth Middleware (doesn't throw if no token)
 */
export const optionalAuthMiddleware = new Elysia()
  .derive(async ({ headers }) => {
    const authHeader = headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      return { user: null };
    }

    try {
      const user = await verifyCognitoToken(token);
      return { user };
    } catch (error) {
      return { user: null };
    }
  });

/**
 * JWT Plugin Configuration (alternative to Cognito)
 */
export const jwtPlugin = jwt({
  name: "jwt",
  secret: JWT_SECRET,
  exp: "7d"
});
