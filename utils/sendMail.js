const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const path = require('path');
const EmailTemplates = require('email-templates');

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
  }),
});

module.exports = async ({ to, subject, template, token, username }) => {
  const email = new EmailTemplates({
    send: true,
    message: { from: 'Pideals <hello@pideals.com>' },
    transport: transporter,
    preview: false,
  });

  return email.send({
    template: path.join(__dirname, '..', 'email', template),
    message: { to, subject },
    locals: {
      username,
      token,
      host:
        process.env.NODE_ENV === 'production'
          ? 'https://pideals.com'
          : 'http://127.0.0.1',
    },
  });
};
