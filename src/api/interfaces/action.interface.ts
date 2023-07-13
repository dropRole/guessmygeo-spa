import ActionType from "../../helpers/types/action-type";
import IUser from "./user.interface";

export default interface IAction {
  id: string;
  type: ActionType;
  component: string;
  value?: string;
  url: string;
  performedAt: Date;
  user: IUser;
}
