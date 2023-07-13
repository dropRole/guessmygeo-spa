interface IEmailProps {
  username: string;
}

interface IPasswordResetEmailProps extends IEmailProps {
  url: string;
  requested: Date;
}

interface IRegistrationEmailProps extends IEmailProps{
  registrated: Date;
}

export type { IPasswordResetEmailProps, IRegistrationEmailProps };
