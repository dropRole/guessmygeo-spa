import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "./Map.css";

const loadGoogleMapsAPI: () => void = async () => {
  const loader: Loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API as string,
    version: "weekly",
  });
  await loader.load();

  (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
};

loadGoogleMapsAPI();

type GoogleMap = google.maps.Map;
type MapMarker = google.maps.Marker;
type MapSearchBox = google.maps.places.SearchBox;
type MapPolyline = google.maps.Polyline;

interface IMapProps {
  currentCoords: { lat: number; lng: number };
  setCurrentCoords: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number }>
  >;
  exposeCoords: { lat: number; lng: number };
  guessCoords?: { lat: number; lng: number };
  disabled: boolean;
}
export const Map: React.FC<IMapProps> = ({
  currentCoords,
  setCurrentCoords,
  exposeCoords,
  guessCoords,
  disabled,
}) => {
  const [map, setGoogleMap] = useState<GoogleMap>();

  const mapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const searchBoxRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const latLngRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map: GoogleMap = new google.maps.Map(mapRef.current, {
        center: exposeCoords,
        zoom:
          guessCoords && guessCoords.lat !== 0 && guessCoords.lng !== 0 ? 5 : 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        mapId: `MAP_ID_${Math.round(exposeCoords.lat)}_${Math.round(
          exposeCoords.lng
        )}`,
      });

      const searchBox: MapSearchBox = new google.maps.places.SearchBox(
        searchBoxRef.current as HTMLInputElement
      );

      const marker: MapMarker = new google.maps.Marker({
        map,
        position: currentCoords,
        title: "Current coords",
        draggable: !disabled,
        animation: google.maps.Animation.DROP,
        crossOnDrag: false,
      });

      google.maps.event.addListener(marker, "dragend", (e: any) =>
        setCurrentCoords({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      );

      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener("places_changed", () => {
        const place: google.maps.places.PlaceResult | undefined =
          searchBox.getPlaces()
            ? (searchBox.getPlaces() as google.maps.places.PlaceResult[])[0]
            : undefined;

        if (!place) return;

        // Clear out the old marker.
        marker.setMap(null);

        // Get the icon and location of the place
        const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();

        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        marker.setMap(map);
        marker.setTitle(place.name);
        marker.setPosition(place.geometry.location);
        marker.setDraggable(!disabled);
        marker.setAnimation(google.maps.Animation.DROP);

        setCurrentCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });

        if (place.geometry.viewport)
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        else bounds.extend(place.geometry.location);

        map.fitBounds(bounds);
      });

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        searchBoxRef.current as HTMLElement
      );

      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
        latLngRef.current as HTMLElement
      );
      // location guessed
      if (guessCoords && guessCoords.lat !== 0 && guessCoords.lng !== 0) {
        const locationMarker: MapMarker = new google.maps.Marker({
          map,
          position: exposeCoords,
          title: "Guessed coords",
          draggable: false,
          animation: google.maps.Animation.DROP,
          crossOnDrag: false,
        });

        const line: MapPolyline = new google.maps.Polyline({
          path: [
            new google.maps.LatLng(exposeCoords.lat, exposeCoords.lng),
            new google.maps.LatLng(guessCoords.lat, guessCoords.lng),
          ],
          strokeColor: "#00000",
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: map,
        });
      }

      setGoogleMap(map);
    }
  }, [exposeCoords]);

  return (
    <>
      <input
        id="mapSearchBox"
        ref={searchBoxRef}
        type="text"
        onKeyDown={(e: KeyboardEvent) => {
          // enter pressed
          if (e.key === "Enter") e.preventDefault();
        }}
        disabled={disabled}
      />
      <div ref={latLngRef} id="latLngDetails">
        <span>Lat</span>
        <span>Lng</span>
        <span>{currentCoords.lat.toFixed(2)}</span>
        <span>{currentCoords.lng.toFixed(2)}</span>
      </div>
      {typeof google === "object" &&
        typeof google.maps === "object" &&
        typeof google.maps.places === "object" && (
          <div id="googleMap" ref={mapRef}></div>
        )}
    </>
  );
};
