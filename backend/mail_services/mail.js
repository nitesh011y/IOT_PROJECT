const nodemailer = require("nodemailer");

const send_mail = async () => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  await transporter.sendMail({
    from: "test@myapp.com",
    to: "niteshshedge011@gmail.com",
    subject: "Test Mail",
    text: "This mail is captured by Mailtrap Sandbox",
  });

  console.log("Mail sent to Mailtrap inbox");
};

module.exports = { send_mail };
