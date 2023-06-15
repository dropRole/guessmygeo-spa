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

export const Login: React.FC = () => {
  const [form, setForm] = useState<"login" | "reset">("login");

  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [loginResult, setLoginResult] = useState<string>("");

  const [loginDetails, setLoginDetails] = useState<string>("");

  return (
    <div id="loginSectionDivider">
      <div>
        <Nav />
        <p id="loginIntro">{form === "login" ? "Login" : "Reset"}</p>
        <p>
          {form === "login"
            ? "Welcome back to GuessMyGeo! We're glad you're back."
            : "Reset you're password in no time! Provide us with a valid username."}
        </p>
        <img src={defaultAvatar} alt="default avatar" />
        {form === "login" ? (
          <LoginForm
            setForm={setForm}
            setOpen={setResultDialogOpen}
            setResult={setLoginResult}
            setDetails={setLoginDetails}
          />
        ) : (
          <PasswordClaimForm
            setForm={setForm}
            setOpen={setResultDialogOpen}
            setResult={setLoginResult}
            setDetails={setLoginDetails}
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
          {loginResult ? (
            <>
              <p>{loginResult}</p>
              <p>{loginDetails}</p>
              <TextButton
                className="btn-text btn-fill-light"
                type="button"
                text="Close"
                clickAction={() => {
                  setResultDialogOpen(false);

                  setLoginResult("");

                  setLoginDetails("");
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
  );
};
