import nodemailer from 'nodemailer';
import 'dotenv/config'
import { NextRequest } from 'next/server';
import {welcomeMail,verifyMail,resetMail} from '@/helpers/mailTemplates'



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