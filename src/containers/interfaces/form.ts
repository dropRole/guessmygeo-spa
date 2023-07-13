import { IGuess } from "../../api/interfaces/guess.interface";
import ILocation from "../../api/interfaces/location.interface";
import IUser from "../../api/interfaces/user.interface";
import { IActionResultDialogProps } from "../../components/interfaces/dialog";

interface IFormProps
  extends Pick<
    IActionResultDialogProps,
    "setActionResult" | "setActionDetails"
  > {
  setActionResultDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActionResult: React.Dispatch<React.SetStateAction<string>>;
  setActionDetails?: React.Dispatch<React.SetStateAction<string>>;
}

interface IFormFields {
  username: string;
  pass: string;
  newPass: string;
  confirmPass: string;
}

interface IAvatarFormProps extends IFormProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

interface IGuessingFormProps
  extends Pick<IFormProps, "setActionResult" | "setActionResultDialogOpen"> {
  location: ILocation | undefined;
  idGuesses: string;
  locationGuess: IGuess | undefined;
  setLocationGuess: React.Dispatch<React.SetStateAction<IGuess | undefined>>;
}

interface ILocationFormFields {
  id: string | undefined;
  caption: string | undefined;
  location: any;
}

interface ILoginFormProps extends IFormProps {
  setFormType: React.Dispatch<React.SetStateAction<"login" | "reset">>;
}

interface ILoginFormFields extends Pick<IFormFields, "username" | "pass"> {}

interface IPasswordFormProps extends IFormProps {}

interface IPasswordFormFields
  extends Pick<IFormFields, "pass" | "newPass" | "confirmPass"> {}

interface IPasswordResetFormProps
  extends Pick<IFormProps, "setActionResult" | "setActionResultDialogOpen"> {}

interface IPassResetFormFields
  extends Pick<IFormFields, "newPass" | "confirmPass"> {}

interface IRegisterFormProps extends IFormProps {}

interface IRegisterFormFields
  extends Pick<IFormFields, "username" | "pass" | "confirmPass"> {
  email: string;
  name: string;
  surname: string;
}

export type {
  IAvatarFormProps,
  IGuessingFormProps,
  ILocationFormFields,
  ILoginFormProps,
  ILoginFormFields,
  IPasswordFormProps,
  IPasswordFormFields,
  IPasswordResetFormProps,
  IPassResetFormFields,
  IRegisterFormProps,
  IRegisterFormFields,
};
