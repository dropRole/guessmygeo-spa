import React, { useState, useEffect } from "react";
import "./Card.css";
import lock from "../assets/icons/lock.png";
import IUser from "../api/interfaces/user.interface";
import { Tooltip } from "@mui/material";
import locationCreator from "../assets/icons/authorization.png";
import Cookies from "universal-cookie";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import locationEdit from "../assets/icons/edit.png";
import locationDelete from "../assets/icons/delete.png";
import {
  userGuessedLocation,
  streamLocationImage,
} from "../helpers/locations-utility";
import { getUserInfo } from "../helpers/auth-utility";
import { ILocationCardProps } from "./interfaces/card";
import { IGuess } from "../api/interfaces/guess.interface";

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

  const [guessed, setGuessed] = useState<IGuess | false>(false);

  const cookies: Cookies = new Cookies();

  const pathname: string = useLocation().pathname;

  useEffect(() => {
    // user guessed location
    if (pathname === "/" && cookies.get("guessmygeo_token"))
      userGuessedLocation(location.id, setGuessed);

    // location being edited
    if (locationEdited && locationEdited.id === location.id) {
      streamLocationImage(locationEdited.image as string, setLocationImage);

      return;
    }

    // user is logged in
    if (cookies.get("guessmygeo_token")) getUserInfo(setUser);

    streamLocationImage(location.image as string, setLocationImage);
  }, [locationEdited]);

  const navigate: NavigateFunction = useNavigate();

  return !guessed ? (
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
