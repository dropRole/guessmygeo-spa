import React, { useState, useEffect } from "react";
import "./Card.css";
import { IGuess } from "../interfaces/guess.interface";
import LocationsService from "../api/locations.service";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface IGuessCardProps {
  guess: IGuess;
}

export const GuessCard: React.FC<IGuessCardProps> = ({ guess }) => {
  const [locationImage, setLocationImage] = useState<Blob>(new Blob());

  const locationsService: LocationsService = new LocationsService();

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const getImage: () => void = async () => {
      const result: Blob = await locationsService.streamImage(
        guess.location.image as string
      );

      // streamed location image
      if (result instanceof Blob) setLocationImage(result);
    };

    getImage();
  }, []);

  return (
    <div
      className="card"
      onClick={() =>
        navigate(
          `/location-guess?idLocations=${guess.location.id}`
        )
      }
    >
      <img
        loading="lazy"
        className="location-image"
        src={URL.createObjectURL(locationImage)}
        alt={guess.location.caption}
      />
      <div className="location-image-lock">
        <p className="guess-result">{guess.result}m</p>
      </div>
    </div>
  );
};
