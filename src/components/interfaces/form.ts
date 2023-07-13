import IUser from "../../api/interfaces/user.interface";
import { IDialogProps } from "./dialog";

interface IFormProps {
  setActionResult: React.Dispatch<React.SetStateAction<string>>;
  setActionDetails?: React.Dispatch<React.SetStateAction<string>>;
}

interface IFormFields {
  username: string;
}

interface IBasicsFormProps
  extends IFormProps,
    Pick<IDialogProps, "setActionResultDialogOpen"> {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

interface IBasicsFormFields extends IFormFields {
  email: string;
  name: string;
  surname: string;
}

interface IPasswordClaimFormProps
  extends IFormProps,
    Pick<IDialogProps, "setActionResultDialogOpen"> {
  setFormType: React.Dispatch<React.SetStateAction<"login" | "reset">>;
}

interface IPasswordClaimFormFields extends IFormFields {}

export type {
  IBasicsFormProps,
  IBasicsFormFields,
  IPasswordClaimFormProps,
  IPasswordClaimFormFields,
};
