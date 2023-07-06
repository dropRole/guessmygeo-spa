import { useEffect, useState } from "react";
import { Nav } from "../layouts/Nav";
import { Footer } from "../layouts/Footer";
import { IUser } from "../interfaces/user.interface";
import defaultAvatar from "../assets/icons/default-avatar.png";
import AuthService from "../api/auth.service";
import "./Profile.css";
import { GuessCardBox } from "../containers/GuessCardBox";
import { LocationCardBox } from "../containers/LocationCardBox";
import { ILocation } from "../interfaces/location.interface";
import { LocationDialog } from "../containers/LocationDialog";
import { SettingsDialog } from "../containers/SettingsDialog";
import { Navigate, useSearchParams } from "react-router-dom";
import { LocationDeletionDialog } from "../components/LocationDeletionDialog";
import { ResultDialog } from "../components/ResultDialog";
import Cookies from "universal-cookie";

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

  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [locationDeletionResult, setLocationDeletionResult] =
    useState<string>("");

  const [searchParams, setSearchParams] = useSearchParams();

  const authService: AuthService = new AuthService();

  const cookies: Cookies = new Cookies();

  useEffect(() => {
    const streamAvatar: (path: string) => Promise<Blob> = async (
      path: string
    ) => {
      const avatar: Blob = await authService.streamAvatar(path);

      return avatar;
    };

    const getUserInfo: () => void = async () => {
      const info: IUser | string = await authService.selectInfo();

      // succeeded
      if (typeof info !== "string") {
        // uploaded user avatar
        if ((info as IUser).avatar !== null)
          return setUser({
            ...(info as IUser),
            avatar: await streamAvatar(info.avatar as string),
          });

        setUser({ ...(info as IUser), avatar: defaultAvatar });
      }
    };

    const setSpectatedUserInfo: (spectatedUserInfo: IUser) => void = async (
      spectatedUserInfo: IUser
    ) => {
      // avatar uploaded
      if (spectatedUserInfo.avatar !== "null") {
        const avatar: Blob = await authService.streamAvatar(
          searchParams.get("avatar") as string
        );

        return setSpectatedUser({
          ...spectatedUserInfo,
          avatar,
        });
      }

      setSpectatedUser({ ...spectatedUserInfo, avatar: defaultAvatar });
    };

    // spectating user profile
    if (
      searchParams.get("username") &&
      searchParams.get("name") &&
      searchParams.get("surname") &&
      searchParams.get("email") &&
      searchParams.get("avatar")
    )
      setSpectatedUserInfo({
        username: searchParams.get("username") as string,
        name: searchParams.get("name") as string,
        surname: searchParams.get("surname") as string,
        email: searchParams.get("email") as string,
        avatar: searchParams.get("avatar") as string,
      });
    else setSpectatedUser(undefined);

    // user logged in
    if (cookies.get("guessmygeo_token") && !cookies.get("guessmygeo_privilege"))
      getUserInfo();
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
      <p id="personalGuesses">Personal best guesses</p>
      <GuessCardBox guesser={spectatedUser ? spectatedUser : user} />
      <p id="personalLocations">My locations</p>
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
      />
      <LocationDeletionDialog
        open={locationDeletionDialogOpen}
        setOpen={setLocationDeletionDialogOpen}
        locationToDelete={locationToDelete}
        setResultDialogOpen={setResultDialogOpen}
        setLocationDeletionResult={setLocationDeletionResult}
        setDeletedLocation={setDeletedLocation}
      />
      <ResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        result={locationDeletionResult}
        setResult={setLocationDeletionResult}
      />
      <Footer />
    </>
  ) : (
    <Navigate to="/panel" />
  );
};
