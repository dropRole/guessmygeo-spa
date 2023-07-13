import React, { useState, useEffect } from "react";
import "./Card.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { streamLocationImage } from "../helpers/locations-utility";
import { IGuessCardProps } from "./interfaces/card";

export const GuessCard: React.FC<IGuessCardProps> = ({ guess }) => {
  const [locationImage, setLocationImage] = useState<Blob>(new Blob());

  useEffect(() => {
    streamLocationImage(guess.location.image as string, setLocationImage);
  }, []);

  const navigate: NavigateFunction = useNavigate();

  return (
    <div
      className="card"
      onClick={() =>
        navigate(`/location-guess?idLocations=${guess.location.id}`)
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
