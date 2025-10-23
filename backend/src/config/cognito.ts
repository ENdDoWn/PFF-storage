// AWS Cognito Configuration
import { 
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminGetUserCommand,
  AdminDeleteUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

// Load environment variables
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID!;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

// Cognito Client Configuration
const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export {
  cognitoClient,
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminGetUserCommand,
  AdminDeleteUserCommand
};
