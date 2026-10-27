// TODO: Convert all these to HTML

function welcomeMail(name: String, email?: String, password?: String) {
  return `
Dear ${name},
Welcome to BUCC. Your account has been created successfully, and your portal is now ready to access.

After logging in complete your profile from Settings and also from Public Profile, Showcase your projects and add two-factor authentication. See you soon!

Note: This is an automated email. Please do not reply to this email.

Regards,
BUCC Web Team
Research and Development Department
`;
}

function verifyMail(name: String, verifyToken: String) {
  return `
Dear ${name},
Please verify your email by clicking the link below:
${process.env.DOMAIN_URL}${process.env.NEXT_PUBLIC_API_URL}/users/verify?${verifyToken}`;
}

function resetMail(resetToken: string) {
  return `
Dear Member,

You recently requested to reset your password for the BUCC Portal.
Please click the link below to set a new password:
${resetToken}

If you did not request this change, you can safely ignore this email. Your password will remain unchanged.

Regards,
BUCC Web Team
Research and Development Department
BRAC University Computer Club
`;
}

function resetMailHtml(resetUrl: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your BUCC Password</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="background-color: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
          BRAC University Computer Club
        </h1>
      </div>
      <div style="padding: 32px 28px; color: #1e293b; line-height: 1.6;">
        <p style="font-size: 15px; margin-top: 0;">Hello,</p>
        <p style="font-size: 15px;">We received a request to reset your password for the <strong>BUCC Portal</strong>.</p>
        <p style="font-size: 15px;">Click the button below to choose a new password. This link is single-use and will expire shortly:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">
            Reset Password
          </a>
        </div>
        <div style="font-size: 12px; color: #64748b; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; word-break: break-all; margin-top: 24px;">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #475569;">If the button doesn't work, copy and paste this link into your browser:</p>
          <a href="${resetUrl}" style="color: #0284c7;">${resetUrl}</a>
        </div>
        <p style="margin-top: 28px; margin-bottom: 0; font-size: 13px; color: #64748b;">
          If you did not request a password reset, you can safely ignore this email. Your account remains completely secure.
        </p>
      </div>
      <div style="padding: 16px 24px; background-color: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        &copy; ${new Date().getFullYear()} BRAC University Computer Club • Research and Development Department
      </div>
    </div>
  </body>
</html>
  `;
}

function sendVerifyToken(name: String, verifyToken: String) {
  return `
    Dear ${name},
    Please Copy the Token Below and Paste it in the Verification Page:
    ${verifyToken}`;
}

export { resetMail, resetMailHtml, sendVerifyToken, verifyMail, welcomeMail };
