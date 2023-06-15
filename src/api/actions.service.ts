import { ActionType } from "../helpers/actions-utility";
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
}
