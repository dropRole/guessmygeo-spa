import React, { useState } from "react";
import { Nav } from "../layouts/Nav";
import { PasswordResetForm } from "../containers/PasswordResetForm";
import "./PasswordReset.css";
import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { TextButton } from "../components/TextButton";

export const PasswordReset: React.FC = () => {
  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [resetResult, setResetResult] = useState<string>("");

  const [resetDetails, setResetDetails] = useState<string>("");

  return (
    <>
      <Nav />
      <p id="passResetIntro">Reset password</p>
      <p>Input valid password and confirm it.</p>
      <PasswordResetForm
        setOpen={setResultDialogOpen}
        setResult={setResetResult}
        setDetails={setResetDetails}
      />
      <Dialog id="passResetResultDialog" open={resultDialogOpen}>
        <DialogContent>
          {resetResult ? (
            <>
              <p>{resetResult}</p>
              <p>{resetDetails}</p>
              <TextButton
                className="btn-text btn-fill-light"
                type="button"
                text="Close"
                clickAction={() => {
                  setResultDialogOpen(false);

                  setResetResult("");

                  setResetDetails("");
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
    </>
  );
};
