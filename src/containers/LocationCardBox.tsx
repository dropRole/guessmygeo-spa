import React, { useEffect, useState } from "react";
import { ILocation } from "../interfaces/location.interface";
import { LocationCard } from "../containers/LocationCard";
import "./CardBox.css";
import { TextButton } from "../components/TextButton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IUser } from "../interfaces/user.interface";
import Cookies from "universal-cookie";
import LocationsService from "../api/locations.service";

interface ILocationCardBoxProps {
  user?: IUser;
}

export const LocationCardBox: React.FC<ILocationCardBoxProps> = ({ user }) => {
  const [locations, setLocations] = useState<ILocation[]>([]);

  const [limit, setLimit] = useState(3);

  const [loadMore, setLoadMore] = useState<boolean>(true);

  const [fetchError, setFetchError] = useState<string>("");

  const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    const getLocations: () => void = async () => {
      const locations: ILocation[] | string =
        await locationsService.selectLocations(limit);

      // fetch succeeded
      if (locations instanceof Array) {
        setLocations(locations);

        // limit exceeded
        if (limit > locations.length) setLoadMore(false);
      }

      // fethc failed
      if (typeof locations === "string") setFetchError(locations);
    };

    getLocations();
  }, [limit]);

  const navigate: NavigateFunction = useNavigate();

  const cookies: Cookies = new Cookies();

  return fetchError === "" ? (
    <div className="card-box flex-wrap">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} creator={user} />
      ))}
      {cookies.get("guessmygeo_token") ? (
        loadMore && (
          <p className="text-center">
            <TextButton
              className="btn-text btn-outline"
              type="button"
              text="LOAD MORE"
              clickAction={() => setLimit(limit + 6)}
            />
          </p>
        )
      ) : (
        <p className="text-center">
          <TextButton
            className="btn-text btn-fill-light"
            type="button"
            text="REGISTER"
            clickAction={() => navigate("/register")}
          />
        </p>
      )}
    </div>
  ) : (
    <p className="text-center text-warn">{fetchError}</p>
  );
};
