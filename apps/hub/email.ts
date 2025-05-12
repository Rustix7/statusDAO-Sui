import nodemailer from "nodemailer"

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'api',
    pass: '7dfdbfdcb78632315af9f419dfc978af',
  }
});

// Configure the mailoptions object
// Send the email
export const sendEmail =(mailOptions : any) => transporter.sendMail(mailOptions, function(error : any, info : any){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});