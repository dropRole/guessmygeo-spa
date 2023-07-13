import ILocation from "../../api/interfaces/location.interface";
import IUser from "../../api/interfaces/user.interface";
import { IDialogProps } from "../../components/interfaces/dialog";

interface ILocationDialogProps extends Pick<IDialogProps, "open" | "setOpen"> {
  type: "add" | "edit";
  locationToEdit?: ILocation;
  setLocationEdited?: React.Dispatch<
    React.SetStateAction<ILocation | undefined>
  >;
}

interface ISettingsDialogProps extends IDialogProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

export type { ILocationDialogProps, ISettingsDialogProps };
