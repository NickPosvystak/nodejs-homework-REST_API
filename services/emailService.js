const nodemailer = require("nodemailer");
const { serverConfig } = require("../config");
const path = require("path");
const { convert } = require("html-to-text");

const emailTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: serverConfig.MAILTRAP_USER,
    pass: serverConfig.MAILTRAP_PASS,
  },
});

// emailTransport.verify(function (error, success) {
//   if (error) {
//     console.log("SMTP connection error:", error);
//   } else {
//     console.log("SMTP connection success:", success);
//   }
// });


const sendEmail = async (data) => {
  const email = { ...data, from: "admin@example.com" };
  await emailTransport
    .sendMail(email)
    .then(() => console.log("email sent successfully"))
    .catch((error) => console.log(error.message));
  return true;
};

module.exports = sendEmail;





// const emailConfig = {
//   from: "admin@example.com",
//   to: "test@example.com",
//   subject: "Email Verification",
//   text: `Click the following link to verify your email: ${process.env.BASE_URL}/users/verify/${verificationToken}`,
//   html: `<p>Click the following link to verify your email:</p><p><a href="${process.env.BASE_URL}/users/verify/${verificationToken}">${process.env.BASE_URL}/users/verify/${verificationToken}</a></p>`,
// };
// async function main() {
//   const info = await emailTransport.sendMail(emailConfig);
// }

// main();