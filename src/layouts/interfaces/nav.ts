import IUser from "../../api/interfaces/user.interface";

export default interface INavProps {
  user?: IUser;
  setSettingsDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationDialogType?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
}
