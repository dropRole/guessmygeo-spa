import React, { useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import defaultAvatar from "../assets/icons/default-avatar.png";
import { Nav } from "../layouts/Nav";
import { Footer } from "../layouts/Footer";
import LocationsService from "../api/locations.service";
import { ILocation } from "../interfaces/location.interface";
import { IGuess } from "../interfaces/guess.interface";
import { GuessingForm } from "../containers/GuessingForm";
import { GuessingLeaderboard } from "../containers/GuessingLeaderboard";
import "./LocationGuess.css";
import AuthService from "../api/auth.service";
import { SettingsDialog } from "../containers/SettingsDialog";
import { LocationDialog } from "../containers/LocationDialog";
import { useSearchParams } from "react-router-dom";
import { ResultDialog } from "../components/ResultDialog";

export const LocationGuess: React.FC = () => {
  const [user, setUser] = useState<IUser>({ avatar: defaultAvatar } as IUser);

  const [location, setLocation] = useState<ILocation | undefined>(undefined);

  const [locationGuess, setLocationGuess] = useState<IGuess | undefined>(
    undefined
  );

  const [locationGuessed, setLocationGuessed] = useState<boolean>(false);

  const [guessResultDialogOpen, setGuessResultDialogOpen] =
    useState<boolean>(false);

  const [guessResult, setGuessResult] = useState<string>("");

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const [locationDialogOpen, setLocationDialogOpen] = useState<boolean>(false);

  const [locationDialogType, setLocationDialogType] = useState<"add" | "edit">(
    "add"
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const authService: AuthService = new AuthService();

  const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    const getUserInfo: () => void = async () => {
      const info: IUser | string = await authService.selectInfo();

      // user uploaded avatar
      if ((info as IUser).avatar !== null) {
        const avatar: Blob = await authService.streamAvatar(
          (info as IUser).avatar as string
        );

        return setUser({ ...(info as IUser), avatar });
      }

      setUser({ ...(info as IUser), avatar: defaultAvatar });
    };

    getUserInfo();

    const selectLocation: () => void = async () => {
      const location: ILocation | string =
        await locationsService.selectLocation(
          searchParams.get("idLocations") as string
        );

      // fetch succeeded
      if (typeof location !== "string")
        setLocation({ ...(location as ILocation) });
    };

    const selectGuess: (id: string) => void = async (id: string) => {
      const guess: IGuess | string = await locationsService.selectGuess(id);

      // fetch succeeded
      if (typeof guess !== "string") setLocationGuess(guess);
    };

    const guessedLocation: () => void = async () => {
      const guessed: string | false = await locationsService.guessedLocation(
        searchParams.get("idLocations") as string
      );

      // location was guessed
      if (guessed) {
        selectGuess(guessed);

        const newURLParams: URLSearchParams = new URLSearchParams();
        newURLParams.append(
          "idLocations",
          searchParams.get("idLocations") as string
        );
        newURLParams.append("idGuesses", guessed as string);

        setSearchParams(newURLParams);
      }
    };

    // if location id was mediated via URL
    if (searchParams.get("idLocations")) {
      selectLocation();

      guessedLocation();
    }
  }, []);

  return (
    <>
      <Nav
        user={user}
        setSettingsDialogOpen={setSettingsDialogOpen}
        setLocationDialogOpen={setLocationDialogOpen}
        setLocationDialogType={setLocationDialogType}
      />
      <div id="guessingLayout">
        <GuessingForm
          location={location}
          guess={locationGuess}
          setGuessResultDialogOpen={setGuessResultDialogOpen}
          setGuessResult={setGuessResult}
          locationGuessed={locationGuessed}
          setLocationGuessed={setLocationGuessed}
        />
        {location && (
          <GuessingLeaderboard
            location={location}
            user={user}
            locationGuessed={locationGuessed}
          />
        )}
      </div>
      <ResultDialog
        open={guessResultDialogOpen}
        setOpen={setGuessResultDialogOpen}
        result={guessResult}
        setResult={setGuessResult}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        setOpen={setSettingsDialogOpen}
        user={user}
        setUser={setUser}
      />
      <LocationDialog
        open={locationDialogOpen}
        setOpen={setLocationDialogOpen}
        type={locationDialogType}
      />
      <Footer />
    </>
  );
};
