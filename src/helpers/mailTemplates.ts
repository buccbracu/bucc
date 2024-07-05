// TODO: Convert all these to HTML

function welcomeMail(name: String, email?: String, password?: String) {
  return `
Dear ${name},
Welcome to BUCC. We are excited to have you on board. Your portal is now ready for you to access. Please use the following credentials to login and complete your profile. Remember to completing your profile is mandatory and crucial for you to join our club groups.


Your login credentials are:
Email: ${email}
Password: ${password}

Please change your password after logging in with a strong one from Settings. See you soon!

Note: This is an automated email. Please do not reply to this email.

Regards,
BUCC Team
`;
}

function verifyMail(name: String, verifyToken: String) {
  return `
Dear ${name},
Please verify your email by clicking the link below:
${process.env.DOMAIN_URL}${process.env.NEXT_PUBLIC_API_URL}/users/verify?${verifyToken}`;
}

function resetMail(name: String, resetToken: String) {
  return `
    Dear ${name},
    Please reset your password by clicking the link below:
    ${process.env.DOMAIN_URL}/reset-password?token=${resetToken}`;
}

function sendVerifyToken(name: String, verifyToken: String) {
  return `
    Dear ${name},
    Please Copy the Token Below and Paste it in the Verification Page:
    ${verifyToken}`;
}

export { resetMail, sendVerifyToken, verifyMail, welcomeMail };
