import nodemailer from 'nodemailer';
import 'dotenv/config'
import { NextRequest } from 'next/server';

const resetMail = `Sample Reset Mail Content`; //TODO
const verifyMail = `Sample Verify Mail Content`; //TODO
const welcomeMail = `Sample Welcome Mail Content`; //TODO


  export const sendMailSingle = async (emailType:String,userId:String) => {


try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.GMAIL_USERNAME,
              pass: process.env.GMAIL_APP_SECRET,
            },
          });

          



} catch (error:any) {
    throw new Error(error.message)
    
}



  };