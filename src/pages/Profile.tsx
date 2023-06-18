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
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { TextButton } from "../components/TextButton";
import LocationsService from "../api/locations.service";

export const Profile = () => {
  const [user, setUser] = useState<IUser>({ avatar: defaultAvatar } as IUser);

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

  const [locationDeletionResult, setLocationDeletionResult] =
    useState<string>();

  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const authService: AuthService = new AuthService();

  const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    const getUserInfo: () => void = async () => {
      const info: IUser | string = await authService.selectInfo();

      // succeeded
      if (typeof info !== "string") {
        // uploaded user avatar
        if ((info as IUser).avatar !== null) {
          const avatar: Blob = await authService.streamAvatar(
            info.avatar as string
          );

          return setUser({ ...(info as IUser), avatar });
        }

        setUser({ ...(info as IUser), avatar: defaultAvatar });
      }
    };

    getUserInfo();
  }, []);

  return (
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
            typeof user.avatar === "string"
              ? user.avatar
              : URL.createObjectURL(user.avatar as Blob)
          }
          alt="user avatar"
        />
        <div>{`${user.name ?? ""} ${user.surname ?? ""}`}</div>
      </div>
      <p id="personalGuesses">Personal best guesses</p>
      <GuessCardBox />
      <p id="personalLocations">My locations</p>
      <LocationCardBox
        user={user}
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
      <Dialog id="locationDeletionDialog" open={locationDeletionDialogOpen}>
        <DialogContent>
          <p>Are you sure?</p>
          <p>This location will be deleted. There is no undo of this action.</p>
        </DialogContent>
        <DialogActions>
          <TextButton
            type="button"
            className="btn-text btn-fill-light"
            text="DELETE"
            clickAction={async () => {
              setLocationDeletionDialogOpen(false);

              setResultDialogOpen(true);

              // location for deletion determined
              if (locationToDelete) {
                const result: string = await locationsService.deleteLocation(
                  locationToDelete.id
                );

                // deletion succeeded
                if (result === "") {
                  setDeletedLocation(locationToDelete);

                  return setLocationDeletionResult("Location is deleted.");
                }

                setLocationDeletionResult(result);
              }
            }}
          />
          <span onClick={() => setLocationDeletionDialogOpen(false)}>
            Cancel
          </span>
        </DialogActions>
      </Dialog>
      <Dialog id="resultDialog" open={resultDialogOpen}>
        <DialogContent>
          {locationDeletionResult ? (
            <>
              <p>{locationDeletionResult}</p>
              <TextButton
                type="button"
                className="btn-text btn-fill-light"
                text="CLOSE"
                clickAction={() => {
                  setResultDialogOpen(false);

                  setLocationDeletionResult("");
                }}
              />
            </>
          ) : (
            <div className="circular-progress">
              <CircularProgress color="success" />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
};
