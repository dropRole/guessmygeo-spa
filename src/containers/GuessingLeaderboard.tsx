import React, { useEffect, useRef, useState } from "react";
import IUser from "../api/interfaces/user.interface";
import LocationsService from "../api/locations.service";
import { IGuess, IGuesser } from "../api/interfaces/guess.interface";
import "./GuessingLeaderboard.css";
import { LeaderboardGuesser } from "../containers/LeaderboardGuesser";
import { TextButton } from "../components/TextButton";
import { IGuessingLeaderboardProps } from "./interfaces/leaderboard";

export const GuessingLeaderboard: React.FC<IGuessingLeaderboardProps> = ({
  location,
  user,
  locationGuessed,
}) => {
  const [locationGuessers, setLocationGuessers] = useState<IGuesser[]>([]);

  const { current: guessersRef } = useRef<IUser[]>(locationGuessers);

  const [loadLimit, setLoadLimit] = useState<number>(10);

  const [fetchError, setFetchError] = useState<string>("");

  const locationsService: LocationsService = new LocationsService();

  const getLocationGuessers: () => void = async () => {
    const guesses: IGuess[] | string = await locationsService.selectGuesses(
      loadLimit,
      location.id,
      undefined,
      1
    );

    // fetch succeeded
    if (typeof guesses !== "string") {
      let guesserCounter = 0;

      setLocationGuessers([
        ...guesses.map((guess) => {
          const guesser: IGuesser = {
            ...guess.user,
            result: guess.result,
            guessedAt: guess.guessedAt,
            placement: ++guesserCounter,
          };

          return guesser;
        }),
      ]);

      return;
    }
    setFetchError(guesses);
  };

  useEffect(() => {
    getLocationGuessers();
  }, [guessersRef, loadLimit, fetchError, locationGuessed]);

  return (
    <div id="guessingLeaderboard">
      <p>Leaderboard</p>
      {locationGuessers.map((guesser) => (
        <LeaderboardGuesser
          key={guesser.username}
          guesser={guesser}
          personalGuess={guesser.username === user.username && true}
        />
      ))}
      {loadLimit < locationGuessers.length && (
        <TextButton
          type="button"
          className="btn-text btn-outline"
          text="LOAD MORE"
          clickAction={() => setLoadLimit(loadLimit + 1)}
        />
      )}
    </div>
  );
};
