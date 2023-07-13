import ILocation from "./location.interface";
import IUser from "./user.interface";

interface IGuess {
  id: string;
  result: number;
  guessedAt: Date;
  location: ILocation;
  user: IUser;
}

interface IGuesser extends IUser {
  result: number;
  guessedAt: Date;
  placement: number;
}

export type { IGuess, IGuesser };
