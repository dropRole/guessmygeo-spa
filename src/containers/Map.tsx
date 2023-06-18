import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "./Map.css";

const loader: Loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API as string,
  version: "weekly",
});

const loadGoogleMapsAPI: () => void = async () => {
  await loader.load();
  (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
};

loadGoogleMapsAPI();

type GoogleMap = google.maps.Map;
type MapMarker = google.maps.Marker;
type MapSearchBox = google.maps.places.SearchBox;

interface IMapProps {
  currentCoords: { lat: number; lng: number };
  setCurrentCoords: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number }>
  >;
  exposeCoords: { lat: number; lng: number };
  disabled: boolean;
}
export const Map: React.FC<IMapProps> = ({
  currentCoords,
  setCurrentCoords,
  exposeCoords,
  disabled,
}) => {
  const [map, setMap] = useState<GoogleMap>();

  const googleMap: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const googleSearchBox: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const latLngDetails: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (googleMap.current) {
      const map: GoogleMap = new google.maps.Map(googleMap.current, {
        center: exposeCoords,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        mapId: `MAP_ID_${Math.round(exposeCoords.lat)}_${Math.round(
          exposeCoords.lng
        )}`,
      });

      const searchBox: MapSearchBox = new google.maps.places.SearchBox(
        googleSearchBox.current as HTMLInputElement
      );

      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      let markers: MapMarker[] = [];

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener("places_changed", () => {
        const places: google.maps.places.PlaceResult[] | undefined =
          searchBox.getPlaces();

        if (places && places.length === 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();

        places?.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }

          const marker: MapMarker = new google.maps.Marker({
            map,
            title: place.name,
            position: place.geometry.location,
            draggable: true,
            animation: google.maps.Animation.DROP,
            crossOnDrag: false,
          });

          google.maps.event.addListener(marker, "dragend", (e: any) =>
            setCurrentCoords({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            })
          );

          // Create a marker for each place.
          markers.push(marker);

          setCurrentCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        googleSearchBox.current as HTMLElement
      );

      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
        latLngDetails.current as HTMLElement
      );

      const marker: MapMarker = new google.maps.Marker({
        map,
        position: currentCoords,
        title: "Current coords",
        draggable: true,
        animation: google.maps.Animation.DROP,
        crossOnDrag: false,
      });

      google.maps.event.addListener(marker, "dragend", (e: any) =>
        setCurrentCoords({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      );

      setMap(map);
    }
  }, [exposeCoords]);

  return (
    <>
      <input
        id="mapSearchBox"
        ref={googleSearchBox}
        type="text"
        onKeyDown={(e: KeyboardEvent) => {
          // enter pressed
          if (e.key === "Enter") e.preventDefault();
        }}
        disabled={disabled}
      />
      <div ref={latLngDetails} id="latLngDetails">
        <span>Lat</span>
        <span>Lng</span>
        <span>{currentCoords.lat.toFixed(2)}</span>
        <span>{currentCoords.lng.toFixed(2)}</span>
      </div>
      <div id="googleMap" className={disabled ? "disable-events" : ""} ref={googleMap}></div>
    </>
  );
};
