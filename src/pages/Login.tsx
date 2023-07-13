import React, { useState } from "react";
import { Nav } from "../layouts/Nav";
import "./Login.css";
import defaultAvatar from "../assets/icons/default-avatar.png";
import geolocationPattern from "../assets/icons/geolocation-pattern.png";
import largeTopLogoVector from "../assets/icons/large-top-logo-vector.png";
import largeBottomLogoVector from "../assets/icons/large-bottom-logo-vector.png";
import { Dialog, DialogContent, CircularProgress } from "@mui/material";
import { TextButton } from "../components/TextButton";
import { LoginForm } from "../containers/LoginForm";
import { PasswordClaimForm } from "../components/PasswordClaimForm";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [type, setType] = useState<"login" | "reset">("login");

  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [result, setResult] = useState<string>("");

  const [resultDetails, setResultDetails] = useState<string>("");

  const cookies: Cookies = new Cookies();

  const loginIntro = "Welcome back to GuessMyGeo! We're glad you're back.";

  const resetIntro =
    "Reset you're password in no time! Provide us with a valid username.";

  return !cookies.get("guessmygeo_privilege") &&
    !cookies.get("guessmygeo_token") ? (
    <div id="loginSectionDivider">
      <div>
        <Nav />
        <p id="loginIntro">{type === "login" ? "Login" : "Reset"}</p>
        <p>{type === "login" ? loginIntro : resetIntro}</p>
        <img src={defaultAvatar} alt="default avatar" />
        {type === "login" ? (
          <LoginForm
            setFormType={setType}
            setActionResultDialogOpen={setResultDialogOpen}
            setActionResult={setResult}
            setActionDetails={setResultDetails}
          />
        ) : (
          <PasswordClaimForm
            setFormType={setType}
            setActionResultDialogOpen={setResultDialogOpen}
            setActionResult={setResult}
            setActionDetails={setResultDetails}
          />
        )}
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
      <Dialog id="loginResultDialog" open={resultDialogOpen}>
        <DialogContent>
          {result ? (
            <>
              <p>{result}</p>
              <p>{resultDetails}</p>
              <TextButton
                className="btn-text btn-fill-light"
                type="button"
                text="Close"
                clickAction={() => {
                  setResultDialogOpen(false);

                  setResult("");

                  setResultDetails("");
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
