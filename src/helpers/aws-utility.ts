import AWS, { Credentials } from "aws-sdk";

export const sendEmail: (
  html: string,
  recepient: string,
  subject: string
) => Promise<string> = async (
  html: string,
  recipient: string,
  subject: string
) => {
  AWS.config.update({
    region: "us-east-1",
    credentials: new Credentials({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY as string,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY as string,
    }),
  });

  const options: AWS.SES.SendEmailRequest = {
    Source: "dropwebengineering@gmail.com",
    Destination: { ToAddresses: [recipient] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `GuessMyGeo - ${subject}`,
      },
    },
  };

  let result: string = "";

  const SES: AWS.SES = new AWS.SES();
  SES.sendEmail(options)
    .promise()
    .then(() => (result = ""))
    .catch((err) => (result = err.message));

  return result;
};
