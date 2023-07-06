import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import React, { useEffect } from "react";
import { TextButton } from "./TextButton";
import "./ResultDialog.css";

interface IResultDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

export const ResultDialog: React.FC<IResultDialogProps> = ({
  open,
  setOpen,
  result,
  setResult,
}) => {
  useEffect(() => {}, [result])

  return (
    <Dialog id="resultDialog" open={open}>
      <DialogContent>
        {result ? (
          <>
            <p>{result}</p>
            <TextButton
              type="button"
              className="btn-text btn-fill-light"
              text="CLOSE"
              clickAction={() => {
                setOpen(false);

                setResult("");
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
