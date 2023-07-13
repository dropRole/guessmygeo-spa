import React, { useEffect, useState } from "react";
import ILocation from "../api/interfaces/location.interface";
import { LocationCard } from "../containers/LocationCard";
import "./CardBox.css";
import { TextButton } from "../components/TextButton";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import LocationsService from "../api/locations.service";
import { ILocationCardBoxProps } from "./interfaces/card";

export const LocationCardBox: React.FC<ILocationCardBoxProps> = ({
  user,
  setLocationToEdit,
  setLocationDialogOpen,
  setLocationDialogType,
  locationEdited,
  setLocationDeletionDialogOpen,
  setLocationToDelete,
  deletedLocation,
}) => {
  const [locations, setLocations] = useState<ILocation[]>([]);

  const [loadLimit, setLoadLimit] = useState(6);

  const [fetchError, setFetchError] = useState<string>("");

  const locationsService: LocationsService = new LocationsService();

  const pathname: string = useLocation().pathname;

  const getLocations: () => void = async () => {
    const locations: ILocation[] | string =
      await locationsService.selectLocations(
        loadLimit,
        user && pathname === "/profile" ? user.username : undefined
      );

    // locations fetch succeeded
    if (locations instanceof Array) {
      setLocations(locations);
    }

    // locations fetch failed
    if (typeof locations === "string") setFetchError(locations);
  };

  useEffect(() => {
    getLocations();
  }, [user, loadLimit, locationEdited, deletedLocation]);

  const navigate: NavigateFunction = useNavigate();

  const cookies: Cookies = new Cookies();

  return fetchError === "" ? (
    <div className="card-box flex-wrap">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          setLocationToEdit={setLocationToEdit}
          setLocationDialogOpen={setLocationDialogOpen}
          setLocationDialogType={setLocationDialogType}
          locationEdited={locationEdited}
          setLocationDeletionDialogOpen={setLocationDeletionDialogOpen}
          setLocationToDelete={setLocationToDelete}
        />
      ))}
      {cookies.get("guessmygeo_token") ? (
        loadLimit === locations.length && (
          <p className="text-center">
            <TextButton
              className="btn-text btn-outline"
              type="button"
              text="LOAD MORE"
              clickAction={() => setLoadLimit(loadLimit + 6)}
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
