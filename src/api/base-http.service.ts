import Cookies from "universal-cookie";
import axios, { AxiosResponse } from "axios";

export default class BaseHTTPService {
  private BASE_URL = process.env.REACT_APP_BASE_URL;

  private publicEndpoints: string[] = ["/locations"];

  checkForAuthorizationHeader(options: { [key: string]: any }): boolean {
    if (options.headers && options.headers.Authorization) return true;

    return false;
  }

  setAuthorizationHeader(): {} {
    const cookies: Cookies = new Cookies()

    const token: string | null = cookies.get("guessmygeo_token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async post<ResponseData>(
    endpoint: string,
    data: {},
    options: {} = {}
  ): Promise<ResponseData> {
    // authorization header not determined
    if (!this.checkForAuthorizationHeader(options))
      Object.assign(options, this.setAuthorizationHeader());

    let response: AxiosResponse;
    try {
      response = await axios.post(
        `${this.BASE_URL}/${endpoint}`,
        data,
        options
      );
    } catch (error: any) {
      return error.response ? error.response.data.message : error.message;
    }

    return response.data;
  }

  async get<ResponseData>(
    endpoint: string,
    options: {} = {}
  ): Promise<ResponseData> {
    let isPublic: boolean = false;

    this.publicEndpoints.forEach(
      (publicEndpoint) => (isPublic = publicEndpoint.includes(endpoint))
    );

    // not among public endpoints
    if (!isPublic) Object.assign(options, this.setAuthorizationHeader());

    let response: AxiosResponse;
    try {
      response = await axios.get(`${this.BASE_URL}/${endpoint}`, options);
    } catch (error: any) {
      return error.response ? error.response.data.message : error.message;
    }

    return response.data;
  }

  async patch<ResponseData>(
    endpoint: string,
    data: {},
    options: {} = {}
  ): Promise<ResponseData> {
    // authorization header not determined
    if (!this.checkForAuthorizationHeader(options))
      Object.assign(options, this.setAuthorizationHeader());

    let response: AxiosResponse;
    try {
      response = await axios.patch(
        `${this.BASE_URL}/${endpoint}`,
        data,
        options
      );
    } catch (error: any) {
      return error.response ? error.response.data.message : error.message;
    }

    return response.data;
  }

  async delete<ResponseData>(
    endpoint: string,
    options: {} = {}
  ): Promise<ResponseData> {
    // authorization header not determined
    if (!this.checkForAuthorizationHeader(options))
      Object.assign(options, this.setAuthorizationHeader());

    let response: AxiosResponse;
    try {
      response = await axios.delete(`${this.BASE_URL}/${endpoint}`, options);
    } catch (error: any) {
      return error.response ? error.response.data.message : error.message;
    }

    return response.data;
  }
}
