import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import React, { useEffect } from "react";
import { TextButton } from "./TextButton";
import "./ActionResultDialog.css";
import { IActionResultDialogProps } from "./interfaces/dialog";

export const ActionResultDialog: React.FC<IActionResultDialogProps> = ({
  open,
  setOpen,
  actionResult,
  setActionResult,
  actionDetails,
  setActionDetails,
}) => {
  useEffect(() => {}, [actionResult]);

  return (
    <Dialog
      id={`${actionDetails ? "detailedResultDialog" : "resultDialog"}`}
      open={open}
    >
      <DialogContent>
        {actionResult ? (
          <>
            <p>{actionResult}</p>
            {actionDetails && <p>{actionDetails}</p>}
            <TextButton
              type="button"
              className="btn-text btn-fill-light"
              text="Close"
              clickAction={() => {
                setOpen(false);

                setActionResult("");

                setActionDetails && setActionDetails("");
              }}
            />
          </>
        ) : (
          <div className="circular-progress">
            <CircularProgress color="success" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
