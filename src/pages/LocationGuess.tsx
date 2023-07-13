import React, { useEffect, useState } from "react";
import IUser from "../api/interfaces/user.interface";
import defaultAvatar from "../assets/icons/default-avatar.png";
import { Nav } from "../layouts/Nav";
import { Footer } from "../layouts/Footer";
import ILocation from "../api/interfaces/location.interface";
import { IGuess } from "../api/interfaces/guess.interface";
import { GuessingForm } from "../containers/GuessingForm";
import { GuessingLeaderboard } from "../containers/GuessingLeaderboard";
import "./LocationGuess.css";
import { SettingsDialog } from "../containers/SettingsDialog";
import { LocationDialog } from "../containers/LocationDialog";
import { Navigate, useSearchParams } from "react-router-dom";
import { ActionResultDialog } from "../components/ActionResultDialog";
import Cookies from "universal-cookie";
import { getUserInfo } from "../helpers/auth-utility";
import { getLocation } from "../helpers/locations-utility";

export const LocationGuess: React.FC = () => {
  const [user, setUser] = useState<IUser>({ avatar: defaultAvatar } as IUser);

  const [location, setLocation] = useState<ILocation | undefined>();

  const [locationGuess, setLocationGuess] = useState<IGuess | undefined>();

  const [guessResultDialogOpen, setGuessResultDialogOpen] =
    useState<boolean>(false);

  const [guessResult, setGuessResult] = useState<string>("");

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const [locationDialogOpen, setLocationDialogOpen] = useState<boolean>(false);

  const [locationDialogType, setLocationDialogType] = useState<"add" | "edit">(
    "add"
  );

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getUserInfo(setUser);
    // location was guessed
    if (locationGuess) {
      const newURLParams: URLSearchParams = new URLSearchParams();
      newURLParams.append(
        "idLocations",
        searchParams.get("idLocations") as string
      );
      newURLParams.append("idGuesses", locationGuess.id);

      setSearchParams(newURLParams);

      return;
    }

    // if location id was mediated via URL
    if (searchParams.get("idLocations"))
      getLocation(searchParams.get("idLocations") as string, setLocation);
  }, [locationGuess]);

  const cookies: Cookies = new Cookies();

  return !cookies.get("guessmygeo_privilege") &&
    cookies.get("guessmygeo_token") ? (
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
          idGuesses={searchParams.get("idGuesses") as string}
          locationGuess={locationGuess}
          setLocationGuess={setLocationGuess}
          setActionResultDialogOpen={setGuessResultDialogOpen}
          setActionResult={setGuessResult}
        />
        {location && (
          <GuessingLeaderboard
            location={location}
            user={user}
            locationGuessed={locationGuess ? true : false}
          />
        )}
      </div>
      <ActionResultDialog
        open={guessResultDialogOpen}
        setOpen={setGuessResultDialogOpen}
        actionResult={guessResult}
        setActionResult={setGuessResult}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        setOpen={setSettingsDialogOpen}
        user={user}
        setUser={setUser}
        setActionResultDialogOpen={setGuessResultDialogOpen}
        setActionResult={setGuessResult}
      />
      <LocationDialog
        open={locationDialogOpen}
        setOpen={setLocationDialogOpen}
        type={locationDialogType}
      />
      <Footer />
    </>
  ) : (
    <Navigate to="/panel" />
  );
};
