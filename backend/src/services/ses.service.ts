// SES Service Layer
import { 
  SendEmailCommand, 
  SendTemplatedEmailCommand,
  CreateTemplateCommand,
  DeleteTemplateCommand
} from "@aws-sdk/client-ses";
import { sesClient } from "../config/aws";

export interface EmailOptions {
  to: string[];
  subject: string;
  body: string;
  from?: string;
  replyTo?: string[];
  cc?: string[];
  bcc?: string[];
}

export interface TemplatedEmailOptions {
  to: string[];
  templateName: string;
  templateData: Record<string, any>;
  from?: string;
  replyTo?: string[];
}

export class SESService {
  private defaultFromEmail: string;

  constructor() {
    this.defaultFromEmail = process.env.SES_FROM_EMAIL || "noreply@example.com";
  }

  /**
   * Send plain text or HTML email
   */
  async sendEmail(options: EmailOptions) {
    const command = new SendEmailCommand({
      Source: options.from || this.defaultFromEmail,
      Destination: {
        ToAddresses: options.to,
        CcAddresses: options.cc,
        BccAddresses: options.bcc
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: "UTF-8"
        },
        Body: {
          Html: {
            Data: options.body,
            Charset: "UTF-8"
          }
        }
      },
      ReplyToAddresses: options.replyTo
    });

    const response = await sesClient.send(command);
    return response;
  }

  /**
   * Send templated email
   */
  async sendTemplatedEmail(options: TemplatedEmailOptions) {
    const command = new SendTemplatedEmailCommand({
      Source: options.from || this.defaultFromEmail,
      Destination: {
        ToAddresses: options.to
      },
      Template: options.templateName,
      TemplateData: JSON.stringify(options.templateData),
      ReplyToAddresses: options.replyTo
    });

    const response = await sesClient.send(command);
    return response;
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, verificationCode: string) {
    return this.sendEmail({
      to: [email],
      subject: "Verify Your Email Address",
      body: `
        <h1>Email Verification</h1>
        <p>Please use the following code to verify your email address:</p>
        <h2>${verificationCode}</h2>
        <p>This code will expire in 24 hours.</p>
      `
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetLink: string) {
    return this.sendEmail({
      to: [email],
      subject: "Password Reset Request",
      body: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmail({
      to: [email],
      subject: "Welcome to PFF Storage!",
      body: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for signing up for PFF Storage.</p>
        <p>We're excited to have you on board!</p>
      `
    });
  }

  /**
   * Create email template
   */
  async createTemplate(
    templateName: string, 
    subject: string, 
    htmlBody: string, 
    textBody?: string
  ) {
    const command = new CreateTemplateCommand({
      Template: {
        TemplateName: templateName,
        SubjectPart: subject,
        HtmlPart: htmlBody,
        TextPart: textBody
      }
    });

    const response = await sesClient.send(command);
    return response;
  }

  /**
   * Delete email template
   */
  async deleteTemplate(templateName: string) {
    const command = new DeleteTemplateCommand({
      TemplateName: templateName
    });

    const response = await sesClient.send(command);
    return response;
  }
}

export const sesService = new SESService();
