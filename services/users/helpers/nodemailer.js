const nodemailer = require("nodemailer");

function registerVerify(email, username, token) {
  let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "dodoru26@gmail.com",
      pass: process.env.NODEMAILER_PASS,
    },
  });
  let info = transporter.sendMail({
    from: "dodoru26@gmail.com",
    to: email,
    subject: "Verify your email!",
    html: `<p>Hello ${username}, please click <a href="http://localhost:8080/register/verify/${token}">here</a> to verify your email</p>`,
  });
}

module.exports = { registerVerify };
