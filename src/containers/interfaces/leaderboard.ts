import ILocation from "../../api/interfaces/location.interface";
import IUser from "../../api/interfaces/user.interface";
import { IGuesser } from "../../api/interfaces/guess.interface";

interface IGuessingLeaderboardProps {
  location: ILocation;
  user: IUser;
  locationGuessed: boolean;
}

interface ILeaderboardGuesserProps {
  guesser: IGuesser;
  personalGuess: boolean;
}

export type { IGuessingLeaderboardProps, ILeaderboardGuesserProps };
