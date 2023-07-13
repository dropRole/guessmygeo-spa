import React, { useState, useEffect } from "react";
import { Nav } from "../layouts/Nav";
import { IntroSection } from "../components/IntroSection";
import { LocationCardBox } from "../containers/LocationCardBox";
import { Footer } from "../layouts/Footer";
import IUser from "../api/interfaces/user.interface";
import { GuessCardBox } from "../containers/GuessCardBox";
import "./Home.css";
import defaultAvatar from "../assets/icons/default-avatar.png";
import { SettingsDialog } from "../containers/SettingsDialog";
import { LocationDialog } from "../containers/LocationDialog";
import { recordScrollAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";
import { IGuesser } from "../api/interfaces/guess.interface";
import { Navigate } from "react-router-dom";
import { getUserInfo } from "../helpers/auth-utility";
import { ActionResultDialog } from "../components/ActionResultDialog";

export const Home: React.FC = () => {
  const [user, setUser] = useState<IUser>({ avatar: defaultAvatar } as IUser);

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const [locationDialogOpen, setLocationDialogOpen] = useState<boolean>(false);

  const [locationDialogType, setLocationDialogType] = useState<"add" | "edit">(
    "add"
  );

  const [actionResultDialogOpen, setActionResultDialogOpen] =
    useState<boolean>(false);

  const [actionResult, settingsEditResult] = useState<string>("");

  const [actionDetails, setSettingsEditDetails] = useState<string>("");

  const cookies: Cookies = new Cookies();

  useEffect(() => {
    // user logged in
    if (
      cookies.get("guessmygeo_token") &&
      !cookies.get("guessmygeo_privilege")
    ) {
      getUserInfo(setUser);

      document.addEventListener("scroll", recordScrollAction);
    }
  }, []);

  return !cookies.get("guessmygeo_privilege") ? (
    <div>
      <Nav
        user={user}
        setSettingsDialogOpen={setSettingsDialogOpen}
        setLocationDialogOpen={setLocationDialogOpen}
        setLocationDialogType={setLocationDialogType}
      />
      {!cookies.get("guessmygeo_token") ? (
        <IntroSection />
      ) : (
        <>
          <p id="personalGuesses">Personal best guesses</p>
          <p>
            Your personal best guesses appear here. Go on and try to beat your
            personal records or set a new one!
          </p>
          <GuessCardBox guesser={user as IGuesser} />
          <p id="newLocations">New Locations</p>
          <p>
            New uploads from users. Try to guess all the locations by pressing
            on a picture.
          </p>
        </>
      )}
      <LocationCardBox user={user} />
      {cookies.get("guessmygeo_token") && (
        <>
          <SettingsDialog
            user={user}
            setUser={setUser}
            open={settingsDialogOpen}
            setOpen={setSettingsDialogOpen}
            setActionResultDialogOpen={setActionResultDialogOpen}
            setActionResult={settingsEditResult}
            setActionDetails={setSettingsEditDetails}
          />
          <LocationDialog
            type={locationDialogType}
            open={locationDialogOpen}
            setOpen={setLocationDialogOpen}
          />
          <ActionResultDialog
            open={actionResultDialogOpen}
            setOpen={setActionResultDialogOpen}
            actionResult={actionResult}
            setActionResult={settingsEditResult}
            actionDetails={actionDetails}
            setActionDetails={setSettingsEditDetails}
          />
        </>
      )}
      <Footer />
    </div>
  ) : (
    <Navigate to="/panel" />
  );
};
