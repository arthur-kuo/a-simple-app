const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user) => {
  console.log(user)
  const token = jwt.sign(
      {userId: user.id},
      process.env.JWT_SECRET,
      {expiresIn: '1d'},
  );
  const verificationUrl = `${process.env.APP_URL}/api/users/emailVerification?token=${token}`;

  const msg = {
    to: user.email,
    from: process.env.SENDER_EMAIL,
    templateId: process.env.TEMPLATE_ID,
    dynamicTemplateData: {
      verificationUrl: verificationUrl,
      username: user.name,
    },
  };
  console.log(msg)

  await sgMail.send(msg);
};

module.exports = {sendVerificationEmail};
