import { useEffect, useState } from "react";
import { Nav } from "../layouts/Nav";
import { Footer } from "../layouts/Footer";
import IUser from "../api/interfaces/user.interface";
import defaultAvatar from "../assets/icons/default-avatar.png";
import "./Profile.css";
import { GuessCardBox } from "../containers/GuessCardBox";
import { LocationCardBox } from "../containers/LocationCardBox";
import ILocation from "../api/interfaces/location.interface";
import { LocationDialog } from "../containers/LocationDialog";
import { SettingsDialog } from "../containers/SettingsDialog";
import { Navigate, useSearchParams } from "react-router-dom";
import { DeletionDialog } from "../components/DeletionDialog";
import { ActionResultDialog } from "../components/ActionResultDialog";
import Cookies from "universal-cookie";
import { getUserInfo } from "../helpers/auth-utility";

export const Profile = () => {
  const [user, setUser] = useState<IUser>({ avatar: defaultAvatar } as IUser);

  const [spectatedUser, setSpectatedUser] = useState<IUser | undefined>(
    undefined
  );

  const [locationDialogOpen, setLocationDialogOpen] = useState<boolean>(false);

  const [locationDialogType, setLocationDialogType] = useState<"add" | "edit">(
    "add"
  );

  const [locationToEdit, setLocationToEdit] = useState<ILocation | undefined>(
    undefined
  );

  const [locationEdited, setLocationEdited] = useState<ILocation | undefined>(
    undefined
  );

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const [locationDeletionDialogOpen, setLocationDeletionDialogOpen] =
    useState<boolean>(false);

  const [locationToDelete, setLocationToDelete] = useState<
    ILocation | undefined
  >(undefined);

  const [deletedLocation, setDeletedLocation] = useState<ILocation | undefined>(
    undefined
  );

  const [actionResultDialogOpen, setDeletionDialogOpen] =
    useState<boolean>(false);

  const [deletionResult, setDeletionResult] = useState<string>("");

  const [searchParams, setSearchParams] = useSearchParams();

  const cookies: Cookies = new Cookies();

  useEffect(() => {
    // spectating user profile
    if (
      searchParams.get("username") &&
      searchParams.get("name") &&
      searchParams.get("surname") &&
      searchParams.get("email") &&
      searchParams.get("avatar")
    )
      getUserInfo(setSpectatedUser, {
        username: searchParams.get("username") as string,
        name: searchParams.get("name") as string,
        surname: searchParams.get("surname") as string,
        email: searchParams.get("email") as string,
        avatar: searchParams.get("avatar") as string,
      });
    else setSpectatedUser(undefined);

    // user logged in
    if (cookies.get("guessmygeo_token") && !cookies.get("guessmygeo_privilege"))
      getUserInfo(setUser);
  }, [searchParams]);

  return !cookies.get("guessmygeo_privilege") &&
    cookies.get("guessmygeo_token") ? (
    <>
      <Nav
        user={user}
        setLocationDialogOpen={setLocationDialogOpen}
        setLocationDialogType={setLocationDialogType}
        setSettingsDialogOpen={setSettingsDialogOpen}
      />
      <div id="profileInfo">
        <img
          src={
            spectatedUser
              ? typeof spectatedUser.avatar === "string"
                ? defaultAvatar
                : URL.createObjectURL(spectatedUser.avatar as Blob)
              : typeof user.avatar === "string"
              ? user.avatar
              : URL.createObjectURL(user.avatar as Blob)
          }
          alt="user avatar"
        />
        <div>{`${
          spectatedUser ? spectatedUser.name : user.name ? user.name : ""
        } ${
          spectatedUser
            ? spectatedUser.surname
            : user.surname
            ? user.surname
            : ""
        }`}</div>
      </div>
      <p id="personalGuesses">
        {spectatedUser ? "Best guesses" : "Personal best guesses"}
      </p>
      <GuessCardBox guesser={spectatedUser ? spectatedUser : user} />
      <p id="personalLocations">
        {spectatedUser ? "Locations" : "My locations"}
      </p>
      <LocationCardBox
        user={spectatedUser ? spectatedUser : user}
        setLocationToEdit={setLocationToEdit}
        setLocationDialogOpen={setLocationDialogOpen}
        setLocationDialogType={setLocationDialogType}
        locationEdited={locationEdited}
        setLocationDeletionDialogOpen={setLocationDeletionDialogOpen}
        setLocationToDelete={setLocationToDelete}
        deletedLocation={deletedLocation}
      />
      <LocationDialog
        open={locationDialogOpen}
        setOpen={setLocationDialogOpen}
        type={locationDialogType}
        locationToEdit={locationToEdit}
        setLocationEdited={setLocationEdited}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        setOpen={setSettingsDialogOpen}
        user={user}
        setUser={setUser}
        setActionResultDialogOpen={setDeletionDialogOpen}
        setActionResult={setDeletionResult}
      />
      <DeletionDialog
        open={locationDeletionDialogOpen}
        setOpen={setLocationDeletionDialogOpen}
        toDelete={locationToDelete}
        setActionResultDialogOpen={setDeletionDialogOpen}
        setActionResult={setDeletionResult}
        setDeleted={setDeletedLocation}
      />
      <ActionResultDialog
        open={actionResultDialogOpen}
        setOpen={setDeletionDialogOpen}
        actionResult={deletionResult}
        setActionResult={setDeletionResult}
      />
      <Footer />
    </>
  ) : (
    <Navigate to="/panel" />
  );
};
