// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or use your SMTP host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendReminderEmail(to, nickname) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Get Back to Solving on Codeforces!",
    text: `Hi ${nickname},\n\nWe've noticed you haven't submitted any problems on Codeforces in the past 7 days.\nGet back to problem solving and keep the streak alive! 🚀`,
  };

  await transporter.sendMail(mailOptions);
}

export default sendReminderEmail;
