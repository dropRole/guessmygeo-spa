import React, { useEffect, useState } from "react";
import "./GuessingForm.css";
import ILocation from "../api/interfaces/location.interface";
import imagePlaceholder from "../assets/icons/image-placeholder.png";
import LocationsService from "../api/locations.service";
import { Map } from "./Map";
import { TextField } from "@mui/material";
import { TextButton } from "../components/TextButton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/icons/default-avatar.png";
import { getGuess, streamLocationImage } from "../helpers/locations-utility";
import { IGuessingFormProps } from "./interfaces/form";
import { IGuess } from "../api/interfaces/guess.interface";

export const GuessingForm: React.FC<IGuessingFormProps> = ({
  location,
  idGuesses,
  locationGuess,
  setLocationGuess,
  setActionResultDialogOpen: setGuessResultDialogOpen,
  setActionResult: setGuessResult,
}) => {
  const [mapInitialCoords, setMapInitialCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [mapCurrentCoords, setMapCurrentCoords] =
    useState<typeof mapInitialCoords>(mapInitialCoords);

  const [mapGuessCoords, setMapGuessCoords] =
    useState<typeof mapCurrentCoords>();

  const [locationImage, setLocationImage] = useState<Blob | string>(
    imagePlaceholder
  );

  const [creatorAvatar, setCreatorAvatar] = useState<Blob | string>(
    defaultAvatar
  );

  const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    // location passed
    if (location) {
      streamLocationImage(location.image as string, setLocationImage);

      location.user.avatar &&
        streamLocationImage(location.user.avatar as string, setCreatorAvatar);

      // location guessa was fetched
      if (locationGuess) {
        setMapInitialCoords({
          lat: parseFloat(location.lat.toString()),
          lng: parseFloat(location.lon.toString()),
        });

        setMapCurrentCoords({
          lat: parseFloat(location.lat.toString()),
          lng: parseFloat(location.lon.toString()),
        });

        return;
      }

      // location guess passed
      if (idGuesses) {
        getGuess(idGuesses, setLocationGuess);

        return;
      }

      navigator.geolocation.getCurrentPosition((position) =>
        setMapInitialCoords({
          lat: parseFloat(position.coords.latitude.toString()),
          lng: parseFloat(position.coords.longitude.toString()),
        })
      );
    }
  }, [location, locationGuess]);

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

  const guessLocation: (e: any) => void = async (e: any) => {
    e.preventDefault();

    // location coords determined
    if (location) {
      setGuessResultDialogOpen(true);

      const distance: number = calculateHaversineDistance(location);

      const result: { [key: string]: string } | string =
        await locationsService.guessLocation(
          location.id,
          Math.round(distance).toString()
        );

      // guess created
      if (typeof result !== "string" && result.id) {
        navigate(
          `/location-guess?idLocations=${location.id}&idGuesses=${result.id}`
        );

        setMapInitialCoords({
          lat: parseFloat(location.lat.toString()),
          lng: parseFloat(location.lon.toString()),
        });

        const guess: IGuess | string = await locationsService.selectGuess(
          result.id
        );

        // currently recorded guess fetched
        if (typeof guess !== "string") setLocationGuess({ ...guess } as IGuess);

        setMapGuessCoords({
          lat: parseFloat(mapCurrentCoords.lat.toString()),
          lng: parseFloat(mapCurrentCoords.lng.toString()),
        });

        return setGuessResult("Guess created.");
      }

      setGuessResult(
        typeof result !== "string" ? (result.message as string) : ""
      );
    }
  };

  return (
    <form id="guessingForm" onSubmit={guessLocation}>
      <p>
        <span>{locationGuess ? "Took" : "Take"} a </span>
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
        initialCoords={mapInitialCoords}
        currentCoords={mapCurrentCoords}
        setCurrentCoords={setMapCurrentCoords}
        guessCoords={mapGuessCoords}
        disabled={locationGuess ? true : false}
      />
      <TextField
        margin="dense"
        label="Hint"
        type="text"
        fullWidth
        variant="standard"
        color="success"
        name="caption"
        value={location ? location.caption : ""}
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
        value={locationGuess ? locationGuess.result : ""}
        disabled={true}
      />
      {!locationGuess && (
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
            location &&
            navigate(
              `/profile?username=${location.user.username}&name=${location.user.name}&surname=${location.user.surname}&email=${location.user.email}&avatar=${location.user.avatar}`
            )
          }
          src={
            typeof creatorAvatar === "string"
              ? (creatorAvatar as string)
              : URL.createObjectURL(creatorAvatar as Blob)
          }
          alt="location creator"
        />
        <span>{`${location ? location.user.name : ""} ${
          location ? location.user.surname : ""
        }`}</span>
      </p>
    </form>
  );
};
