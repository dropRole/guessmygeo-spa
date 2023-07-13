import { IGuess } from "./interfaces/guess.interface";
import ILocation from "./interfaces/location.interface";
import BaseHTTPService from "./base-http.service";

export default class LocationsService extends BaseHTTPService {
  async createLocation(formData: FormData): Promise<string> {
    return await this.post<string>("locations", formData, {
      "Content-Type": "multipart/form-data",
    });
  }

  async guessLocation(
    id: string,
    result: string
  ): Promise<{ [key: string]: string } | string> {
    return await this.post<{ [key: string]: string } | string>(
      `locations/guess/${id}`,
      { result }
    );
  }

  async selectLocations(
    limit: number,
    user?: string
  ): Promise<ILocation[] | string> {
    return await this.get<ILocation[] | string>(
      `locations?limit=${limit}${user ? `&user=${user}` : ""}`
    );
  }

  async selectLocation(id: string): Promise<ILocation | string> {
    return await this.get<ILocation>(`locations/${id}`);
  }

  async guessedLocation(id: string): Promise<IGuess | false | string> {
    return this.get<IGuess | false | string>(`locations/${id}/guessed-on`);
  }

  async streamImage(filename: string): Promise<Blob | string> {
    return await this.get<Blob>(`locations/image/${filename}`, {
      responseType: "blob",
      timeout: 30000,
    });
  }

  async selectGuesses(
    limit: number,
    id?: string,
    user?: string,
    results?: number
  ): Promise<IGuess[] | string> {
    return await this.get<IGuess[] | string>(
      `locations/guesses/all?limit=${limit}${id ? `&id=${id}` : ""}${
        user ? `&user=${user}` : ""
      }${results ? `&results=${results}` : ""}`
    );
  }

  async selectGuess(id: string): Promise<IGuess | string> {
    return await this.get<IGuess | string>(`locations/guess/${id}`);
  }

  async editLocation(formData: FormData): Promise<string> {
    return await this.patch<string>(
      `locations/${formData.get("id")}`,
      formData
    );
  }

  async deleteLocation(id: string): Promise<string> {
    return await this.delete<string>(`locations/${id}`);
  }
}
