import React, { useEffect, useState } from "react";
import "./GuessingForm.css";
import { IGuess } from "../interfaces/guess.interface";
import { ILocation } from "../interfaces/location.interface";
import imagePlaceholder from "../assets/icons/image-placeholder.png";
import LocationsService from "../api/locations.service";
import { Map } from "./Map";
import { TextField } from "@mui/material";
import { TextButton } from "../components/TextButton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IUser } from "../interfaces/user.interface";
import defaultAvatar from "../assets/icons/default-avatar.png";
import AuthService from "../api/auth.service";

interface IGuessingFormProps {
  location: ILocation | undefined;
  guess: IGuess | undefined;
  setGuessResultDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGuessResult: React.Dispatch<React.SetStateAction<string>>;
  locationGuessed: boolean;
  setLocationGuessed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GuessingForm: React.FC<IGuessingFormProps> = ({
  guess,
  location,
  setGuessResultDialogOpen,
  setGuessResult,
  locationGuessed,
  setLocationGuessed,
}) => {
  const [locationImage, setLocationImage] = useState<Blob | string>(
    imagePlaceholder
  );

  const [mapCurrentCoords, setMapCurrentCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [mapExposeCoords, setMapExposeCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [mapGuessCoords, setMapGuessCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [locationCaption, setLocationCaption] = useState<string>("");

  const [errorDistance, setErrorDistance] = useState<string>("");

  const [locationCreator, setLocationCreator] = useState<IUser>({
    avatar: defaultAvatar,
  } as IUser);

  const authService: AuthService = new AuthService();

  const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    const streamImage: () => void = async () => {
      const image: Blob = await locationsService.streamImage(
        (location as ILocation).image
      );

      setLocationImage(image);
    };

    const streamCreatorsAvatar: () => void = async () => {
      const avatar: Blob = await authService.streamAvatar(
        (location as ILocation).user.avatar as string
      );

      setLocationCreator({ ...(location as ILocation).user, avatar });
    };

    // guess passed
    if (guess) setErrorDistance(`${guess.result}m`);
    
    // location passed
    if (location) {
      streamImage();

      setLocationCaption(location.caption);

      setLocationCreator({ ...location.user, avatar: defaultAvatar });

      // location creator uploaded an avatar
      if (location.user.avatar !== null) streamCreatorsAvatar();

      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setMapCurrentCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      setMapExposeCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [location, guess, locationGuessed]);

  const calculateHaversineDistance = (location: ILocation) => {
    const rad = (x: number) => {
      return (x * Math.PI) / 180;
    };

    let R: number = 6378137; // Earth’s mean radius in meter

    let dLat: number = rad(location.lat - mapCurrentCoords.lat);

    let dLong: number = rad(location.lon - mapCurrentCoords.lng);

    let a: number =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(mapCurrentCoords.lat)) *
        Math.cos(rad(location.lat)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);

    let c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d: number = R * c;

    return d; // returns the distance in meter
  };

  const navigate: NavigateFunction = useNavigate();

  return (
    <form
      id="guessingForm"
      onSubmit={async (e) => {
        e.preventDefault();

        // location coords determined
        if (location) {
          setGuessResultDialogOpen(true);

          const distance: number = calculateHaversineDistance(location);

          const result: { [key: string]: boolean | string } =
            await locationsService.guessLocation(
              location.id,
              Math.round(distance).toString()
            );

          // guess created
          if (result.id) {
            navigate(
              `/location-guess?idLocations=${location.id}&idGuesses=${result.id}`
            );

            setMapGuessCoords({
              lat: mapCurrentCoords.lat,
              lng: mapCurrentCoords.lng,
            });

            setMapExposeCoords({
              lat: parseFloat(location.lat.toString()),
              lng: parseFloat(location.lon.toString()),
            });

            setLocationGuessed(true);

            setErrorDistance(`${Math.round(distance).toString()}m`);

            return setGuessResult("Guess created.");
          }

          setGuessResult(result.message as string);
        }
      }}
    >
      <p>
        <span>{guess || locationGuessed ? "Took" : "Take"} a </span>
        <span>guess</span>
      </p>
      <img
        src={
          typeof locationImage === "string"
            ? locationImage
            : URL.createObjectURL(locationImage)
        }
        alt="preview"
      />
      <Map
        currentCoords={
          guess && location
            ? {
                lat: parseFloat(location.lat.toString()),
                lng: parseFloat(location.lon.toString()),
              }
            : mapCurrentCoords
        }
        setCurrentCoords={setMapCurrentCoords}
        exposeCoords={
          guess && location
            ? {
                lat: parseFloat(location.lat.toString()),
                lng: parseFloat(location.lon.toString()),
              }
            : mapExposeCoords
        }
        disabled={guess || locationGuessed ? true : false}
        guessCoords={mapGuessCoords}
      />
      <TextField
        margin="dense"
        label="Hint"
        type="text"
        fullWidth
        variant="standard"
        color="success"
        name="caption"
        value={locationCaption ? locationCaption : ""}
        disabled={true}
      />
      <TextField
        margin="dense"
        label="Error distance"
        type="text"
        fullWidth
        variant="standard"
        color="success"
        name="errorDistance"
        value={errorDistance ? errorDistance : ""}
        disabled={true}
      />
      {!guess && !locationGuessed && (
        <TextButton
          type="submit"
          form="guessingForm"
          className="btn-text btn-fill-light"
          text="GUESS"
          clickAction={() => {}}
        />
      )}
      <p id="locationCreator">
        <span>Created by</span>
        <img
          onClick={() =>
            navigate(
              `/profile?username=${locationCreator.username}&name=${locationCreator.name}&surname=${locationCreator.surname}&email=${locationCreator.email}&avatar=${location?.user.avatar}`
            )
          }
          src={
            typeof locationCreator.avatar === "string"
              ? (locationCreator.avatar as string)
              : URL.createObjectURL(locationCreator.avatar as Blob)
          }
          alt="location creator"
        />
        <span>{`${locationCreator.name ? locationCreator.name : ""} ${
          locationCreator.surname ? locationCreator.surname : ""
        }`}</span>
      </p>
    </form>
  );
};
