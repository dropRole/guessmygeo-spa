import { IGuess } from "../../api/interfaces/guess.interface";
import ILocation from "../../api/interfaces/location.interface";
import { ILocationCardBoxProps } from "./card-box";

interface IGuessCardProps {
  guess: IGuess;
}

interface ILocationCardProps
  extends Exclude<ILocationCardBoxProps, ["user", "deletedLocation"]> {
  location: ILocation;
}

export type { IGuessCardProps, ILocationCardProps, ILocationCardBoxProps };
