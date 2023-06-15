import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./SettingsDialog.css";
import { BasicsForm } from "../components/BasicsForm";
import { TextButton } from "../components/TextButton";
import { PasswordForm } from "./PasswordForm";
import { AvatarForm } from "./AvatarForm";
import { IUser } from "../interfaces/user.interface";

interface ISettingsDialogProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsDialog: React.FC<ISettingsDialogProps> = ({
  user,
  setUser,
  open,
  setOpen,
}) => {
  const [contentText, setContentText] = useState<string>(
    "Change your information."
  );

  const [content, setContent] = useState<string>("basicsForm");

  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [editResult, setEditResult] = useState<string>("");

  const [editDetails, setEditDetails] = useState<string>("");

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
            setDialogOpen={setResultDialogOpen}
            setEditResult={setEditResult}
            setEditDetails={setEditDetails}
          />
        )}
        {content === "passwordForm" && (
          <PasswordForm
            setDialogOpen={setResultDialogOpen}
            setEditResult={setEditResult}
            setEditDetails={setEditDetails}
          />
        )}
        {content === "avatarForm" && (
          <AvatarForm
            user={user}
            setUser={setUser}
            setDialogOpen={setResultDialogOpen}
            setEditResult={setEditResult}
            setEditDetails={setEditDetails}
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
      <Dialog id="settingsResultDialog" open={resultDialogOpen}>
        <DialogContent>
          {editResult && editDetails ? (
            <>
              <p>{editResult}</p>
              <p>{editDetails}</p>
              <TextButton
                className="btn-text btn-fill-light"
                type="button"
                text="Close"
                clickAction={() => {
                  setEditResult("");

                  setEditDetails("");

                  setResultDialogOpen(false);
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
    </Dialog>
  );
};
