import React from "react";
import { ILocation } from "../interfaces/location.interface";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { TextButton } from "./TextButton";
import LocationsService from "../api/locations.service";
import "./LocationDeletionDialog.css";

interface ILocationDeletionDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  locationToDelete: ILocation | undefined;
  setResultDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationDeletionResult: React.Dispatch<React.SetStateAction<string>>;
  setDeletedLocation: React.Dispatch<React.SetStateAction<ILocation | undefined>>;
}

export const LocationDeletionDialog: React.FC<ILocationDeletionDialogProps> = ({
  open,
  setOpen,
  locationToDelete,
  setResultDialogOpen,
  setLocationDeletionResult,
  setDeletedLocation,
}) => {
  const locationsService: LocationsService = new LocationsService();

  return (
    <Dialog id="locationDeletionDialog" open={open}>
      <DialogContent>
        <p>Are you sure?</p>
        <p>This location will be deleted. There is no undo of this action.</p>
      </DialogContent>
      <DialogActions>
        <TextButton
          type="button"
          className="btn-text btn-fill-light"
          text="DELETE"
          clickAction={async () => {
            setOpen(false);

            setResultDialogOpen(true);

            // location for deletion determined
            if (locationToDelete) {
              const result: string = await locationsService.deleteLocation(
                locationToDelete.id
              );

              // deletion succeeded
              if (result === "") {
                setDeletedLocation(locationToDelete);

                return setLocationDeletionResult("Location is deleted.");
              }

              setLocationDeletionResult(result);
            }
          }}
        />
        <span onClick={() => setOpen(false)}>Cancel</span>
      </DialogActions>
    </Dialog>
  );
};
