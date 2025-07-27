const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create transporter  service that will send email like "gmail"
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2) Define email options
    const mailOpts = {
        from: 'E-shop App <abdelrhmanhafez510@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Send email
    await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
