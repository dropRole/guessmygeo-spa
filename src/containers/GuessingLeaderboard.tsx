import React, { useEffect, useRef, useState } from "react";
import { ILocation } from "../interfaces/location.interface";
import { IUser } from "../interfaces/user.interface";
import LocationsService from "../api/locations.service";
import { IGuess } from "../interfaces/guess.interface";
import "./GuessingLeaderboard.css";
import { LeaderboardGuesser } from "../containers/LeaderboardGuesser";
import { TextButton } from "../components/TextButton";

interface IGuessingLeaderboardProps {
  location: ILocation;
  user: IUser;
  locationGuessed: boolean;
}

export interface IGuesser extends IUser {
  result: number;
  guessedAt: Date;
  placement: number;
}

export const GuessingLeaderboard: React.FC<IGuessingLeaderboardProps> = ({
  location,
  user,
  locationGuessed,
}) => {
  const [locationGuessers, setLocationGuessers] = useState<IGuesser[]>([]);

  const [limit, setLimit] = useState<number>(10);

  const [loadMore, setLoadMore] = useState<boolean>(true);

  const [fetchError, setFetchError] = useState<string>("");

  const { current: guessersRef } = useRef<IUser[]>(locationGuessers);

const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    const getLocationGuessers: () => void = async () => {
      const guesses: IGuess[] | string = await locationsService.selectGuesses(
        limit,
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

        // limit exceeded
        if (limit > guesses.length) setLoadMore(false);

        return;
      }

      setFetchError(guesses);
    };

    getLocationGuessers();
  }, [guessersRef, limit, fetchError, locationGuessed]);

  return (
    <div id="guessingLeaderboard">
      <p>Leaderboard</p>
      {locationGuessers.map((guesser) => (
        <LeaderboardGuesser
          key={guesser.username}
          guesser={guesser}
          personalGuess={guesser.username === user.username && true }
        />
      ))}
      {loadMore && (
        <TextButton
          type="button"
          className="btn-text btn-outline"
          text="LOAD MORE"
          clickAction={() => setLimit(limit + 1)}
        />
      )}
    </div>
  );
};
