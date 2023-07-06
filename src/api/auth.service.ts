import { IUser } from "../interfaces/user.interface";
import BaseHTTPService from "./base-http.service";

export default class AuthService extends BaseHTTPService {
  async register(
    username: string,
    pass: string,
    name: string,
    surname: string,
    email: string
  ): Promise<string> {
    return await this.post("auth/register", {
      username,
      pass,
      name,
      surname,
      email,
    });
  }

  async login(
    username: string,
    pass: string
  ): Promise<{ [key: string]: string }> {
    return await this.post<{ [key: string]: string }>("auth/login", {
      username,
      pass,
    });
  }

  async signPassResetJWT(
    username: string
  ): Promise<{ email: string; jwt: string } | string> {
    return await this.get(`auth/${username}/token/pass-reset`);
  }

  async selectInfo(): Promise<IUser | string> {
    return await this.get<IUser>("auth/me/info");
  }

  async streamAvatar(avatar: string): Promise<Blob> {
    return await this.get(`auth/me/avatar?avatar=${avatar}`, {
      responseType: "blob",
    });
  }

  async editInfo(
    username: string,
    name: string,
    surname: string,
    email: string
  ): Promise<{ jwt: string } | string> {
    return await this.patch("auth/me/info", { username, name, surname, email });
  }

  async changePass(
    pass: string | undefined,
    newPass: string,
    token: string = ""
  ): Promise<string> {
    // password reset
    if (pass === undefined && token !== "")
      return await this.patch(
        "auth/me/pass",
        { pass, newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    return await this.patch("auth/me/pass", { pass, newPass });
  }

  async uploadAvatar(formData: FormData): Promise<string> {
    return await this.patch("auth/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async removeAvatar(): Promise<string> {
    return await this.delete("auth/me/avatar");
  }
}
