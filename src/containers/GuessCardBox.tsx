import React, { useEffect, useState } from "react";
import "./CardBox.css";
import { GuessCard } from "../containers/GuessCard";
import { SwitchButton } from "../components/SwitchButton";
import { TextButton } from "../components/TextButton";
import { IGuess } from "../interfaces/guess.interface";
import LocationsService from "../api/locations.service";

export const GuessCardBox: React.FC = () => {
  const [guesses, setGuesses] = useState<IGuess[]>([]);

  const [limit, setLimit] = useState<number>(3);

  const [filter, setFilter] = useState<boolean>(true);

  const [loadMore, setLoadMore] = useState<boolean>(true);

  const [fetchError, setFetchError] = useState<string>("");

  const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    const getGuesses: () => void = async () => {
      const guesses: IGuess[] | string =
        await locationsService.selectPersonalGuesses(limit, "", filter ? 1 : 0);

      // fetch succeeded
      if (guesses instanceof Array) {
        setGuesses(guesses);

        // limit exceeded
        if (limit > guesses.length) setLoadMore(false);
      }

      // fetch failed
      if (typeof guesses === "string") setFetchError(guesses);
    };

    getGuesses();
  }, [limit, filter]);

  return fetchError === "" ? (
    <div className="card-box guesses-card-box flex-wrap">
      <p>
        <SwitchButton
          title={filter ? "Closest" : "Farrest"}
          clickAction={() => setFilter(!filter)}
        />
      </p>
      {guesses.map((guess) => (
        <GuessCard key={guess.id} guess={guess} />
      ))}
      {loadMore && (
        <p className="text-center">
          <TextButton
            className="btn-text btn-outline"
            type="button"
            text="LOAD MORE"
            clickAction={() => setLimit(limit + 6)}
          />
        </p>
      )}
    </div>
  ) : (
    <p className="text-center text-warn">{fetchError}</p>
  );
};
