import React from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { TextButton } from "./TextButton";
import LocationsService from "../api/locations.service";
import "./DeletionDialog.css";
import { IDeletionDialogProps } from "./interfaces/dialog";

export const DeletionDialog: React.FC<IDeletionDialogProps> = ({
  open,
  setOpen,
  toDelete,
  setActionResultDialogOpen: setDeletionResultDialogOpen,
  setActionResult: setDeletionResult,
  setDeleted,
}) => {
  const locationsService: LocationsService = new LocationsService();

  const deleteInstance: () => void = async () => {
    setOpen(false);

    setDeletionResultDialogOpen(true);

    // location for deletion determined
    if (toDelete) {
      let result: string = "";

      // deleting location
      if ("lat" in toDelete && "lon" in toDelete)
        result = await locationsService.deleteLocation(toDelete.id);

      // deletion succeeded
      if (result === "") {
        setDeleted(toDelete);

        return setDeletionResult("Instance is deleted.");
      }

      setDeletionResult(result);
    }
  };

  return (
    <Dialog id="deletionDialog" open={open}>
      <DialogContent>
        <p>Are you sure?</p>
        <p>This instance will be deleted. There is no undo of this action.</p>
      </DialogContent>
      <DialogActions>
        <TextButton
          type="button"
          className="btn-text btn-fill-light"
          text="DELETE"
          clickAction={() => deleteInstance()}
        />
        <span onClick={() => setOpen(false)}>Cancel</span>
      </DialogActions>
    </Dialog>
  );
};
