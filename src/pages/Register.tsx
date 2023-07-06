import React, { useState } from "react";
import { Nav } from "../layouts/Nav";
import "./Register.css";
import defaultAvatar from "../assets/icons/default-avatar.png";
import { RegisterForm } from "../containers/RegisterForm";
import geolocationPattern from "../assets/icons/geolocation-pattern.png";
import largeTopLogoVector from "../assets/icons/large-top-logo-vector.png";
import largeBottomLogoVector from "../assets/icons/large-bottom-logo-vector.png";
import { Dialog, DialogContent, CircularProgress } from "@mui/material";
import { TextButton } from "../components/TextButton";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

export const Register: React.FC = () => {
  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [registerResult, setRegisterResult] = useState<string>("");

  const [registerDetails, setRegisterDetails] = useState<string>("");

  const cookies: Cookies = new Cookies();

  return !cookies.get("guessmygeo_privilege") &&
    !cookies.get("guessmygeo_token") ? (
    <div id="registerSectionDivider">
      <div>
        <Nav />
        <p id="registerIntro">Register</p>
        <p>You're name will appear on posts and your public profile.</p>
        <img src={defaultAvatar} alt="default avatar" />
        <RegisterForm
          setOpen={setResultDialogOpen}
          setResult={setRegisterResult}
          setDetails={setRegisterDetails}
        />
      </div>
      <div>
        <img
          loading="eager"
          src={geolocationPattern}
          alt="geolocation pattern"
        />
        <aside>
          <img src={largeTopLogoVector} alt="top logo vector" />
          <img src={largeBottomLogoVector} alt="bottom logo vector" />
        </aside>
      </div>
      <Dialog id="registerResultDialog" open={resultDialogOpen}>
        <DialogContent>
          {registerResult ? (
            <>
              <p>{registerResult}</p>
              <p>{registerDetails}</p>
              <TextButton
                className="btn-text btn-fill-light"
                type="button"
                text="Close"
                clickAction={() => {
                  setResultDialogOpen(false);

                  setRegisterResult("");

                  setRegisterDetails("");
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
    </div>
  ) : (
    <Navigate to="/" />
  );
};
