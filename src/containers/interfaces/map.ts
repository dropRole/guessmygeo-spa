export default interface IMapProps {
  initialCoords: { lat: number; lng: number };
  currentCoords: { lat: number; lng: number };
  setCurrentCoords: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number }>
  >;
  guessCoords?: { lat: number; lng: number } | undefined;
  disabled: boolean;
}
