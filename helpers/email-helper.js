const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user) => {
  const token = jwt.sign(
      {userId: user.id},
      process.env.JWT_SECRET,
      {expiresIn: '1d'},
  );
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

  const msg = {
    to: user.email,
    from: process.env.SENDER_EMAIL,
    subject: 'Please verify your email',
    text: `Please verify your email by clicking on the link: ${
      verificationUrl
    }`,
    html: `<p>Please verify your email by clicking on the link: <a href="${
      verificationUrl
    }">Verify Email</a></p>`,
  };

  await sgMail.send(msg);
};

module.exports = {sendVerificationEmail};
