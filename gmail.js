const { google } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
const credentials = require('./credentials.json');
const tokens = require('./token.json');

const getGmailService = () => {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  // const mailComposer = new MailComposer(options);
  var mail = new MailComposer(options).compile();
  // console.log("mail")
  // console.log(mail)
  // const message = await mailComposer.compile().build();
const message = await mail.build();
// console.log("messgag: ", message);
  return  encodeMessage(message);
};

const sendMail = async (options) => {
  // console.log("options")
  // console.log(options);
  const gmail = getGmailService();
  const rawMessage = await createMail(options);
  // console.log("rawMessage")
  // console.log(rawMessage)
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};

module.exports = sendMail;