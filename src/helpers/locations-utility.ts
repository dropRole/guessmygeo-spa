import LocationsService from "../api/locations.service";
import { IGuess } from "../api/interfaces/guess.interface";
import ILocation from "../api/interfaces/location.interface";

const locationsService: LocationsService = new LocationsService();

export const getLocation: <StateType>(
  id: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => void = async <StateType>(
  id: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => {
  const location: ILocation | string = await locationsService.selectLocation(
    id
  );

  // location was fetched
  if (typeof location !== "string") updateState(location as StateType);
};

export const getGuess: <StateType>(
  id: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => void = async <StateType>(
  id: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => {
  const guess: IGuess | string = await locationsService.selectGuess(id);

  // location was fetched
  if (typeof guess !== "string") updateState(guess as StateType);
};

export const userGuessedLocation: <StateType>(
  id: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => void = async <StateType>(
  id: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => {
  const guessed: IGuess | false | string =
    await locationsService.guessedLocation(id);

  // checked if user guessed location
  if (typeof guessed !== "boolean" && typeof guessed !== "string") {
    updateState({ ...guessed } as StateType);

    return guessed;
  }
};

export const streamLocationImage: <StateType>(
  path: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => void = async <StateType>(
  path: string,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => {
  const image: Blob | string = await locationsService.streamImage(path);

  updateState(image as StateType);
};
