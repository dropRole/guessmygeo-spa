import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "./Map.css";
import IMapProps from "./interfaces/map";
import { GoogleMap, MapMarker, MapPolyline, MapSearchBox } from "./types/map";

const loadGoogleMapsAPI: () => void = async () => {
  const loader: Loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API as string,
    version: "weekly",
  });
  await loader.load();

  (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
};

loadGoogleMapsAPI();

export const Map: React.FC<IMapProps> = ({
  initialCoords,
  currentCoords,
  setCurrentCoords,
  guessCoords,
  disabled,
}) => {
  const [map, setGoogleMap] = useState<GoogleMap>();

  const mapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const searchBoxRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const latLngRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const configureGoogleMap: () => void = async () => {
    if (mapRef.current) {
      const map: GoogleMap = new google.maps.Map(mapRef.current, {
        center: new google.maps.LatLng({
          lat: parseFloat(initialCoords.lat.toString()),
          lng: parseFloat(initialCoords.lng.toString()),
        }),
        zoom: guessCoords ? 5 : 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
      });

      const marker: MapMarker = new google.maps.Marker({
        map,
        position: new google.maps.LatLng({
          lat: initialCoords.lat,
          lng: initialCoords.lng,
        }),
        title: "Current coords",
        draggable: !disabled,
        animation: google.maps.Animation.DROP,
        crossOnDrag: false,
      });

      const searchBox: MapSearchBox = new google.maps.places.SearchBox(
        searchBoxRef.current as HTMLInputElement
      );

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
      if (guessCoords) {
        const guessMarker: MapMarker = new google.maps.Marker({
          map,
          position: new google.maps.LatLng({
            lat: guessCoords.lat,
            lng: guessCoords.lng,
          }),
          title: "Guessed coords",
          draggable: false,
          animation: google.maps.Animation.DROP,
          crossOnDrag: false,
        });

        const line: MapPolyline = new google.maps.Polyline({
          path: [
            new google.maps.LatLng(initialCoords.lat, initialCoords.lng),
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
  };

  useEffect(() => {
    configureGoogleMap();
  }, [initialCoords, guessCoords]);

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
        <span>{parseFloat(currentCoords.lat.toString()).toFixed(2)}</span>
        <span>{parseFloat(currentCoords.lng.toString()).toFixed(2)}</span>
      </div>
      {typeof google === "object" &&
        typeof google.maps === "object" &&
        typeof google.maps.places === "object" && (
          <div id="googleMap" ref={mapRef}></div>
        )}
    </>
  );
};
