// Cognito Service Layer
import { 
  cognitoClient,
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminGetUserCommand,
  AdminDeleteUserCommand
} from "../config/cognito";
import { 
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand,
  GlobalSignOutCommand,
  AdminUpdateUserAttributesCommand,
  AdminSetUserPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";

export class CognitoService {

  /**
   * Calculate SECRET_HASH for Cognito operations
   */
  private calculateSecretHash(username: string): string | undefined {
    if (!COGNITO_CLIENT_SECRET) return undefined;
    
    return createHmac("sha256", COGNITO_CLIENT_SECRET)
      .update(username + COGNITO_CLIENT_ID)
      .digest("base64");
  }

  /**
   * Sign up new user
   */
  async signUp(username: string, password: string, email: string, attributes?: Record<string, string>) {
    const userAttributes = [
      { Name: "email", Value: email },
      ...Object.entries(attributes || {}).map(([key, value]) => ({
        Name: key,
        Value: value
      }))
    ];

    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: userAttributes,
      SecretHash: this.calculateSecretHash(username)
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Confirm user sign up with verification code
   */
  async confirmSignUp(username: string, confirmationCode: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
      SecretHash: this.calculateSecretHash(username)
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Sign in user
   */
  async signIn(username: string, password: string) {
    const command = new InitiateAuthCommand({
      ClientId: COGNITO_CLIENT_ID,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: this.calculateSecretHash(username) || ""
      }
    });

    const response = await cognitoClient.send(command);
    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(username: string, refreshToken: string) {
    const command = new InitiateAuthCommand({
      ClientId: COGNITO_CLIENT_ID,
      AuthFlow: "REFRESH_TOKEN_AUTH",
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: this.calculateSecretHash(username) || ""
      }
    });

    const response = await cognitoClient.send(command);
    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn
    };
  }

  /**
   * Get user details
   */
  async getUser(username: string) {
    const command = new AdminGetUserCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Delete user
   */
  async deleteUser(username: string) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Initiate forgot password flow
   */
  async forgotPassword(username: string) {
    const command = new ForgotPasswordCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      SecretHash: this.calculateSecretHash(username)
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Confirm forgot password with code
   */
  async confirmForgotPassword(username: string, confirmationCode: string, newPassword: string) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
      SecretHash: this.calculateSecretHash(username)
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Change password (requires current password)
   */
  async changePassword(accessToken: string, previousPassword: string, proposedPassword: string) {
    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Sign out user globally
   */
  async globalSignOut(accessToken: string) {
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Update user attributes (admin)
   */
  async updateUserAttributes(username: string, attributes: Record<string, string>) {
    const userAttributes = Object.entries(attributes).map(([key, value]) => ({
      Name: key,
      Value: value
    }));

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username,
      UserAttributes: userAttributes
    });

    const response = await cognitoClient.send(command);
    return response;
  }

  /**
   * Set user password (admin - no verification needed)
   */
  async setUserPassword(username: string, password: string, permanent: boolean = true) {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username,
      Password: password,
      Permanent: permanent
    });

    const response = await cognitoClient.send(command);
    return response;
  }
}

export const cognitoService = new CognitoService();
