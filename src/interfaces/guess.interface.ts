import { ILocation } from "./location.interface";
import { IUser } from "./user.interface";

export interface IGuess {
  id: string;
  result: number;
  guessedAt: Date;
  location: ILocation;
  user: IUser;
}
