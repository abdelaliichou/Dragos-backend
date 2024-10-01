const nodemailer = require('nodemailer');

// Nodemailer
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
   service : "gmail",
    auth: {
      user: "sakchiheb007@gmail.com",
      pass: "rwlviqaiynkxzovz"
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'Chiheb from NutriBoost E-shop',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;