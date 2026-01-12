"use server";

import nodemailer from "nodemailer";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (values: ContactFormValues) => {
  const { name, email, subject, message } = values;

  // Validation
  if (!name || !email || !subject || !message) {
    return { error: "All fields are required!" };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please provide a valid email address!" };
  }

  try {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_SECRET,
      },
    });

    // Email to BUCC
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: "bucc@bracu.ac.bd",
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    // Confirmation email to sender
    const confirmationMail = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Thank you for contacting BUCC",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <br>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <br>
        <p>Best regards,</p>
        <p>BRAC University Computer Club</p>
      `,
    };

    await transporter.sendMail(confirmationMail);

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return { error: "Failed to send message. Please try again later." };
  }
};
