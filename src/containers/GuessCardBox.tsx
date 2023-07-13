import React, { useEffect, useState } from "react";
import "./CardBox.css";
import { GuessCard } from "../containers/GuessCard";
import { SwitchButton } from "../components/SwitchButton";
import { TextButton } from "../components/TextButton";
import { IGuess } from "../api/interfaces/guess.interface";
import LocationsService from "../api/locations.service";
import { IGuessCardBoxProps } from "./interfaces/card-box";

export const GuessCardBox: React.FC<IGuessCardBoxProps> = ({ guesser }) => {
  const [guesses, setGuesses] = useState<IGuess[]>([]);

  const [loadLimit, setLoadLimit] = useState<number>(3);

  const [guessFilter, setGuessFilter] = useState<boolean>(true);

  const [fetchError, setFetchError] = useState<string>("");

  const locationsService: LocationsService = new LocationsService();

  const getGuesses: () => void = async () => {
    const guesses: IGuess[] | string = await locationsService.selectGuesses(
      loadLimit,
      undefined,
      guesser ? guesser.username : undefined,
      guessFilter ? 1 : 0
    );

    // guess fetch succeeded
    if (guesses instanceof Array) {
      setGuesses(guesses);
    }

    // guesses fetch failed
    if (typeof guesses === "string") setFetchError(guesses);
  };

  useEffect(() => {
    getGuesses();
  }, [loadLimit, guessFilter, guesser]);

  return fetchError === "" ? (
    <div className="card-box guesses-card-box flex-wrap">
      <p>
        <SwitchButton
          title={guessFilter ? "Closest" : "Farrest"}
          clickAction={() => setGuessFilter(!guessFilter)}
        />
      </p>
      {guesses.map((guess) => (
        <GuessCard key={guess.id} guess={guess} />
      ))}
      {loadLimit === guesses.length && (
        <p className="text-center">
          <TextButton
            className="btn-text btn-outline"
            type="button"
            text="LOAD MORE"
            clickAction={() => setLoadLimit(loadLimit + 6)}
          />
        </p>
      )}
    </div>
  ) : (
    <p className="text-center text-warn">{fetchError}</p>
  );
};
