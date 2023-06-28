import React, { useEffect, useState } from "react";
import { ILocation } from "../interfaces/location.interface";
import { LocationCard } from "../containers/LocationCard";
import "./CardBox.css";
import { TextButton } from "../components/TextButton";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { IUser } from "../interfaces/user.interface";
import Cookies from "universal-cookie";
import LocationsService from "../api/locations.service";

interface ILocationCardBoxProps {
  user?: IUser;
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
  deletedLocation?: ILocation | undefined;
}

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

  const [limit, setLimit] = useState(6);

  const [loadMore, setLoadMore] = useState<boolean>(true);

  const [fetchError, setFetchError] = useState<string>("");

  const locationsService: LocationsService = new LocationsService();

  const pathname: string = useLocation().pathname;

  useEffect(() => {
    const getLocations: () => void = async () => {
      const locations: ILocation[] | string =
        await locationsService.selectLocations(
          limit,
          user && pathname === "/profile" ? user.username : undefined
        );

      // locations fetch succeeded
      if (locations instanceof Array) {
        setLocations(locations);

        // limit of locations exceeded
        if (limit > locations.length) setLoadMore(false);
      }

      // locations fetch failed
      if (typeof locations === "string") setFetchError(locations);
    };

    getLocations();
  }, [user, limit, locationEdited, deletedLocation]);

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
