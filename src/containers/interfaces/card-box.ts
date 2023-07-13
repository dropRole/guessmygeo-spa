import ILocation from "../../api/interfaces/location.interface";
import IUser from "../../api/interfaces/user.interface";

interface ILocationCardBoxProps {
  user?: IUser;
  deletedLocation?: ILocation | undefined;
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
}

interface IGuessCardBoxProps {
  guesser?: IUser;
}

export type { ILocationCardBoxProps, IGuessCardBoxProps };
