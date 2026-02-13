/**
 * Email Service
 * 
 * Handles email operations for OTP and notifications
 */

import { api } from '@/lib/api-client';

// Email related types
interface SendOTPRequest {
  email: string;
  otp: string;
  purpose: 'password_reset' | 'email_verification' | 'login_verification';
}

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailTemplate {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
}

export const emailService = {
  /**
   * Send OTP email
   */
  sendOTP: async (data: SendOTPRequest): Promise<void> => {
    await api.post('/email/send-otp', data);
  },

  /**
   * Send custom email
   */
  sendEmail: async (data: SendEmailRequest): Promise<void> => {
    await api.post('/email/send', data);
  },

  /**
   * Send email using template
   */
  sendTemplateEmail: async (data: EmailTemplate): Promise<void> => {
    await api.post('/email/send-template', data);
  },

  /**
   * Generate 6-digit OTP
   */
  generateOTP: (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Format OTP email template
   */
  formatOTPEmail: (otp: string, purpose: string): { subject: string; html: string } => {
    const subject = purpose === 'password_reset' 
      ? 'TechAssassin - Password Reset OTP'
      : purpose === 'login_verification'
      ? 'TechAssassin - Login Verification OTP'
      : 'TechAssassin - Email Verification OTP';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
          }
          .title {
            color: #2563eb;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .otp-container {
            background-color: #f8fafc;
            border: 2px dashed #2563eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2563eb;
            margin: 10px 0;
          }
          .expiry {
            color: #64748b;
            font-size: 14px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
          .security-note {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">
              Tech<span style="color: #f59e0b;">Assassin</span>
            </div>
            <h2>${subject}</h2>
          </div>

          <div class="otp-container">
            <p style="margin-bottom: 10px;">Your verification code is:</p>
            <div class="otp-code">${otp}</div>
            <p class="expiry">This code will expire in 10 minutes</p>
          </div>

          <div class="security-note">
            <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your OTP via phone or email.
          </div>

          <p>If you didn't request this code, please ignore this email or contact our support team.</p>

          <div class="footer">
            <p>&copy; 2025 TechAssassin. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  },

  /**
   * Validate email format
   */
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Get email provider info
   */
  getEmailProvider: (email: string): string => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return 'unknown';
    
    if (domain.includes('gmail')) return 'gmail';
    if (domain.includes('yahoo')) return 'yahoo';
    if (domain.includes('outlook') || domain.includes('hotmail')) return 'outlook';
    if (domain.includes('protonmail')) return 'protonmail';
    if (domain.includes('icloud')) return 'icloud';
    
    return 'other';
  },
};
