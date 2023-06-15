import React, { useState, useEffect } from "react";
import { ILocation } from "../interfaces/location.interface";
import LocationsService from "../api/locations.service";
import "./Card.css";
import lock from "../assets/icons/lock.png";
import { IUser } from "../interfaces/user.interface";
import { Tooltip } from "@mui/material";
import locationCreator from "../assets/icons/authorization.png";
import Cookies from "universal-cookie";
import { useLocation } from "react-router-dom";
import locationEdit from "../assets/icons/edit.png";
import locationDelete from "../assets/icons/delete.png";

interface ILocationCardProps {
  location: ILocation;
  creator?: IUser;
}

export const LocationCard: React.FC<ILocationCardProps> = ({
  location,
  creator,
}) => {
  const [locationImage, setLocationImage] = useState<Blob>(new Blob());

  const locationsService: LocationsService = new LocationsService();

  const cookies: Cookies = new Cookies();

  useEffect(() => {
    const getImage: (image: string) => void = async (image: string) => {
      const result: Blob = await locationsService.streamImage(image);

      // streamed image
      if (result instanceof Blob) setLocationImage(result);
    };

    getImage(location.image);
  }, []);

  const pathname: string = useLocation().pathname;

  return (
    <div className="card">
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
      {creator && location.user.username === creator.username ? (
        pathname !== "/profile" ? (
          <Tooltip placement="bottom" title="Creator of" enterTouchDelay={0}>
            <div className="location-creator">
              <img loading="lazy" src={locationCreator} alt="creator of" />
            </div>
          </Tooltip>
        ) : (
          <div className="location-settings">
            <aside>
              <img src={locationEdit} alt="edit location" />
            </aside>
            <aside>
              <img src={locationDelete} alt="delete location" />
            </aside>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};
