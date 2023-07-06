import { ActionType } from "../helpers/actions-utility";
import { IUser } from "./user.interface";

export interface IAction {
    id: string;
    type: ActionType;
    component: string;
    value?: string;
    url: string;
    performedAt: Date;
    user: IUser;
}