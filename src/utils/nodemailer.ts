import nodemailer from 'nodemailer';

const hostname = 'mail.privateemail.com';
const username = 'info@spsclipboard.com';
const password = 'JFP7akn1cvy!qyh0ryb';

export const nodeMail = nodemailer.createTransport({
   host: hostname,
   port: 587,
   secure: false,
   requireTLS: true,
   auth: {
      user: username,
      pass: password,
   },
   logger: true,
});
