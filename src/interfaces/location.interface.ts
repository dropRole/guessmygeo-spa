import { IGuess } from "./guess.interface";
import { IUser } from "./user.interface";

export interface ILocation {
  id: string;
  lat: number;
  lon: number;
  image: string;
  caption: string;
  createadAt: Date;
  editedAt: Date;
  user: IUser;
  guesses: IGuess[];
}
