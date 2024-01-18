const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../envs/development.env"),
});

const { MAILTRAP_USER, MAILTRAP_PASS } = process.env;

const emailTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});

const sendEmail = async (data) => {
  const email = { ...data, from: MAILTRAP_USER };
  await emailTransport
    .sendMail(email)
    .then(() => console.log("✅ email sent successfully"))
    .catch((error) => console.log(error.message));
  return true;
};

module.exports = sendEmail;
