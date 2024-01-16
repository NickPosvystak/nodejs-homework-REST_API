const nodemailer = require("nodemailer");
// const path = require("path");

require("dotenv").config();

// const { MAILTRAP_USER, MAILTRAP_PASS } = process.env;

const emailTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
    auth: {
    user: "f21de3a75574de",
    pass: "53f01b66c15e23",
  },
});


const sendEmail = async (data) => {
  const email = { ...data, from: "f21de3a75574de" };
  await emailTransport
    .sendMail(email)
    .then(() => console.log("✅ email sent successfully"))
    .catch((error) => console.log(error.message));
  return true;
};

module.exports = sendEmail;
