import React, { useState, useEffect } from "react";
import { ILocation } from "../interfaces/location.interface";
import LocationsService from "../api/locations.service";
import "./Card.css";
import lock from "../assets/icons/lock.png";
import { IUser } from "../interfaces/user.interface";
import { Tooltip } from "@mui/material";
import locationCreator from "../assets/icons/authorization.png";
import Cookies from "universal-cookie";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import locationEdit from "../assets/icons/edit.png";
import locationDelete from "../assets/icons/delete.png";
import AuthService from "../api/auth.service";

interface ILocationCardProps {
  location: ILocation;
  setLocationToEdit?: React.Dispatch<
    React.SetStateAction<ILocation | undefined>
  >;
  setLocationDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationDialogType?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  locationEdited?: ILocation | undefined;
  setLocationDeletionDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationToDelete?: React.Dispatch<
    React.SetStateAction<ILocation | undefined>
  >;
}

export const LocationCard: React.FC<ILocationCardProps> = ({
  location,
  setLocationToEdit,
  setLocationDialogOpen,
  setLocationDialogType,
  locationEdited,
  setLocationDeletionDialogOpen,
  setLocationToDelete,
}) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const [locationImage, setLocationImage] = useState<Blob>(new Blob());

  const [guessedLocation, setGuessedLocation] = useState<boolean>(false);

  const authService: AuthService = new AuthService();

  const locationsService: LocationsService = new LocationsService();

  const cookies: Cookies = new Cookies();

  const pathname: string = useLocation().pathname;

  useEffect(() => {
    const getUserInfo: () => void = async () => {
      const info: IUser | string = await authService.selectInfo();

      // user info fetched
      if (typeof info !== "string") setUser({ ...info });
    };

    const getImage: (image: string) => void = async (image: string) => {
      const result: Blob = await locationsService.streamImage(image);

      // streamed location image
      if (result instanceof Blob) setLocationImage(result);
    };

    const guessedLocation: () => void = async () => {
      const guessed: string | false = await locationsService.guessedLocation(
        location.id
      );

      // location was guessed
      if (guessed) setGuessedLocation(true);
    };

    // user guessed location
    if (pathname === "/" && cookies.get("guessmygeo_token")) guessedLocation();

    // location being edited
    if (locationEdited && locationEdited.id === location.id) {
      getImage(locationEdited.image);

      return;
    }

    // user is logged in
    if (cookies.get("guessmygeo_token")) getUserInfo();

    getImage(location.image);
  }, [locationEdited]);

  const navigate: NavigateFunction = useNavigate();

  return !guessedLocation ? (
    <div
      className="card"
      onClick={() => {
        // logged in user is not an author
        if (user && user.username !== location.user.username)
          navigate(`/location-guess?idLocations=${location.id}`);
      }}
    >
      <img
        loading="lazy"
        className="location-image"
        src={URL.createObjectURL(locationImage)}
        alt={location.caption}
      />
      {!cookies.get("guessmygeo_token") && (
        <div className="location-image-lock">
          <img loading="lazy" src={lock} alt="location locked" />
        </div>
      )}
      {user && location.user.username === user.username ? (
        pathname !== "/profile" ? (
          <Tooltip placement="bottom" title="Creator of" enterTouchDelay={0}>
            <div className="location-creator">
              <img loading="lazy" src={locationCreator} alt="creator of" />
            </div>
          </Tooltip>
        ) : (
          <div className="location-settings">
            <aside
              onClick={() => {
                setLocationToEdit && setLocationToEdit({ ...location });

                setLocationDialogOpen && setLocationDialogOpen(true);

                setLocationDialogType && setLocationDialogType("edit");
              }}
            >
              <img src={locationEdit} alt="edit location" />
            </aside>
            <aside
              onClick={async () => {
                setLocationDeletionDialogOpen &&
                  setLocationDeletionDialogOpen(true);

                setLocationToDelete && setLocationToDelete(location);
              }}
            >
              <img src={locationDelete} alt="delete location" />
            </aside>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
};
