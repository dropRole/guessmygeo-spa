import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./SettingsDialog.css";
import { BasicsForm } from "../components/BasicsForm";
import { TextButton } from "../components/TextButton";
import { PasswordForm } from "./PasswordForm";
import { AvatarForm } from "./AvatarForm";
import { ISettingsDialogProps } from "./interfaces/dialog";

export const SettingsDialog: React.FC<ISettingsDialogProps> = ({
  user,
  setUser,
  open,
  setOpen,
  setActionResultDialogOpen: setEditResultDialogOpen,
  setActionResult: setEditResult,
  setActionDetails: setEditDetails,
}) => {
  const [contentText, setContentText] = useState<string>(
    "Change your information."
  );

  const [content, setContent] = useState<string>("basicsForm");

  useEffect(() => {}, [content]);

  return (
    <Dialog id="settingsDialog" open={open}>
      <DialogTitle>
        Profile <span>settings</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
        {content === "basicsForm" && (
          <BasicsForm
            user={user}
            setUser={setUser}
            setActionResultDialogOpen={setEditResultDialogOpen}
            setActionResult={setEditResult}
            setActionDetails={setEditDetails}
          />
        )}
        {content === "passwordForm" && (
          <PasswordForm
            setActionResultDialogOpen={setEditResultDialogOpen}
            setActionResult={setEditResult}
            setActionDetails={setEditDetails}
          />
        )}
        {content === "avatarForm" && (
          <AvatarForm
            user={user}
            setUser={setUser}
            setActionResultDialogOpen={setEditResultDialogOpen}
            setActionResult={setEditResult}
            setActionDetails={setEditDetails}
          />
        )}
      </DialogContent>
      <DialogActions id="settingsActions">
        {content !== "basicsForm" && (
          <TextButton
            className="btn-text btn-fill-light"
            type="button"
            text="Change basics"
            clickAction={() => {
              setContent("basicsForm");
              setContentText("Change your information.");
            }}
          />
        )}
        {content !== "passwordForm" && (
          <TextButton
            className="btn-text btn-fill-dark"
            type="button"
            text="Change password"
            clickAction={() => {
              setContent("passwordForm");
              setContentText("Change your password.");
            }}
          />
        )}
        {content !== "avatarForm" && (
          <TextButton
            className="btn-text btn-fill-light"
            type="button"
            text="Change avatar"
            clickAction={() => {
              setContent("avatarForm");
              setContentText("Change your avatar.");
            }}
          />
        )}
        <p>
          <TextButton
            className="btn-text btn-fill-light"
            type="submit"
            form={content}
            text="SUBMIT"
            clickAction={() => {}}
          />
          <span onClick={() => setOpen(false)}>Cancel</span>
        </p>
      </DialogActions>
    </Dialog>
  );
};
