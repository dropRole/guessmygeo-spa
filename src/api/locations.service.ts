import { IGuess } from "../interfaces/guess.interface";
import { ILocation } from "../interfaces/location.interface";
import BaseHTTPService from "./base-http.service";

export default class LocationsService extends BaseHTTPService {
  async createLocation(formData: FormData): Promise<string> {
    return await this.post<string>("locations", formData, {
      "Content-Type": "multipart/form-data",
    });
  }

  async selectLocations(
    limit: number,
    user?: string
  ): Promise<ILocation[] | string> {
    return await this.get<ILocation[] | string>(
      `locations?limit=${limit}&user=${user ? user : ""}`
    );
  }

  async selectLocation(id: string): Promise<ILocation> {
    return await this.get<ILocation>(`locations/${id}`);
  }

  async streamImage(filename: string): Promise<Blob> {
    return await this.get<Blob>(`locations/image/${filename}`, {
      responseType: "blob",
      timeout: 30000,
    });
  }

  async selectPersonalGuesses(
    limit: number,
    id: string = "",
    results: number = 1
  ): Promise<IGuess[] | string> {
    return await this.get(
      `locations/guesses/me?limit=${limit}${
        id ? `&id=${id}` : ""
      }&results=${results}`
    );
  }

  async editLocation(formData: FormData): Promise<string> {
    return await this.patch(`locations/${formData.get("id")}`, formData);
  }

  async deleteLocation(id: string): Promise<string> {
    return await this.delete(`locations/${id}`);
  }
}
