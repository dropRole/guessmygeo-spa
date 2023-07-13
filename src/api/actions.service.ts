import ActionType from "../helpers/types/action-type";
import IAction from "./interfaces/action.interface";
import BaseHTTPService from "./base-http.service";

export default class ActionsService extends BaseHTTPService {
  async recordAction(
    type: ActionType,
    component: string,
    value: string = "",
    url: URL
  ): Promise<string> {
    return await this.post<string>("actions", { type, component, value, url });
  }

  async selectActions(
    limit: number,
    search?: string
  ): Promise<IAction[] | string> {
    return await this.get<IAction[] | string>(
      `actions?limit=${limit}${search ? `&search=${search}` : ""}`
    );
  }

  async removeAction(id: string): Promise<boolean | string> {
    return await this.delete<boolean | string>(`actions/${id}`);
  }
}
