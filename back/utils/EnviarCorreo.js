const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { Parametro } = require('../store/db');
const sendMail = async (config, destinatario, asunto, texto, html) => {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
  let mailOptions = {};
  mailOptions.from = config.user,
    mailOptions.to = destinatario;
  mailOptions.subject = asunto;
  mailOptions.text = texto;
  mailOptions.html = html;
  let resp = await transporter.sendMail(mailOptions);
  return resp;
}
const getConfiguracionEmail = async () => {
  const parametros = await Parametro.findAll(
      {
          where: { 'nombreGrupo': 'CONFIG_OAUTH2_GMAIL', estadoId: [1] },
          attributes: ['tipoDato', 'nombreVariable', 'valor']
      });
  const { valor: user } = parametros.find(item => item.nombreVariable === "user");
  const { valor: clientId } = parametros.find(item => item.nombreVariable === "clientId");
  const { valor: clientSecret } = parametros.find(item => item.nombreVariable === "clientSecret");
  const { valor: refreshToken } = parametros.find(item => item.nombreVariable === "refreshToken");
  const { valor: redirectUri } = parametros.find(item => item.nombreVariable === "redirectUri");
  const config = {};
  config.user=user;
  config.clientId=clientId;
  config.clientSecret=clientSecret;
  config.refreshToken=refreshToken;
  config.redirectUri=redirectUri;
  return config;
}

const sendMailoAuth2 = async (config,destinatario, asunto, texto, html) => {
  let response = {};
  try {
    const oAuth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
    oAuth2Client.setCredentials({ refresh_token: config.refreshToken });

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.user,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken:accessToken,
      },
    });

    let mailOptions = {};
    mailOptions.from = config.user,
      mailOptions.to = destinatario;
    mailOptions.subject = asunto;
    mailOptions.text = texto;
    mailOptions.html = html;
    let resultEmail = await transport.sendMail(mailOptions);
    response.code = 0;
    response.data = resultEmail;
  } catch (error) {
    response.code = 0;
    response.data = error;
  }
  return response;
}

module.exports = {
  sendMail,
  sendMailoAuth2,
  getConfiguracionEmail
}
