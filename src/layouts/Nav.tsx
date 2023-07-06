import React, { useState } from "react";
import { TextButton } from "../components/TextButton";
import "./Nav.css";
import topLogoVector from "../assets/icons/top-logo-vector.png";
import bottomLogoVector from "../assets/icons/bottom-logo-vector.png";
import { HamburgerButton } from "../components/HamburgerButton";
import { AddButton } from "../components/AddButton";
import chevron from "../assets/icons/chevron.png";
import lightChevron from "../assets/icons/light-chevron.png";
import { IUser } from "../interfaces/user.interface";
import {
  Location,
  useLocation,
  NavigateFunction,
  useNavigate,
} from "react-router-dom";
import { recordScrollAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";

interface INavProps {
  user?: IUser;
  setSettingsDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationDialogType?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
}

export const Nav: React.FC<INavProps> = ({
  user,
  setSettingsDialogOpen,
  setLocationDialogOpen,
  setLocationDialogType,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [navHeight, setNavheight] = useState<string>("uncollapse");

  const [navFlexDirection, setNavFlexDirection] = useState<string>("row");

  const [hamBtnAlign, setHamBtnAlign] = useState<string>("align-self-center");

  const [inscriptionDisplay, setInscriptionDisplay] =
    useState<string>("display-flex");

  const [inscriptionOpacity, setInscriptionOpacity] =
    useState<string>("opacity-1");

  const [addBtnDisplay, setAddBtnDisplay] = useState<string>("display-block");

  const [addBtnOpacity, setAddBtnOpacity] = useState<string>("opacity-1");

  const [menuWidth, setMenuWidth] = useState<string>("auto");

  const [menuItemDisplay, setMenuItemDisplay] =
    useState<string>("display-none");

  const [menuItemOpacity, setMenuItemOpacity] = useState<string>("opacity-0");

  const [authButtonsDisplay, setAuthButtonsDisplay] =
    useState<string>("display-none");

  const [authButtonsOpacity, setAuthButtonsOpacity] =
    useState<string>("opacity-0");

  // controls navbar collapsing setup
  const collapseNavbar: () => void = () => {
    setCollapsed(!collapsed);

    // if nav collapsed
    if (!collapsed) {
      setInscriptionOpacity("opacity-0");

      setAddBtnOpacity("opacity-0");

      setTimeout(() => {
        setNavheight("collapse");

        setHamBtnAlign("align-self-start");

        setInscriptionOpacity("opacity-0");

        setAddBtnDisplay("display-none");

        setMenuWidth("width-100");

        setMenuItemDisplay("display-flex");

        setAuthButtonsDisplay("display-flex");
      }, 250);

      setTimeout(() => {
        setNavFlexDirection("flex-column");

        setInscriptionDisplay("display-none");

        setMenuItemOpacity("opacity-1");

        setAuthButtonsOpacity("opacity-1");
      }, 500);
    } else {
      setMenuItemOpacity("opacity-0");

      setAuthButtonsOpacity("opacity-0");

      setTimeout(() => {
        setNavheight("uncollapse");

        setMenuItemDisplay("display-none");

        setInscriptionDisplay("display-flex");

        setAddBtnDisplay("display-block");

        setAuthButtonsDisplay("display-none");
      }, 250);

      setTimeout(() => {
        setNavFlexDirection("flex-row");

        setHamBtnAlign("align-self-center");

        setMenuWidth("auto");

        setInscriptionOpacity("opacity-1");

        setAddBtnOpacity("opacity-1");
      }, 500);
    }
  };

  const location: Location = useLocation();

  const navigate: NavigateFunction = useNavigate();

  const cookies: Cookies = new Cookies();

  return (
    <nav className={`${navFlexDirection} ${navHeight}`}>
      <div id="menu" className={menuWidth}>
        {cookies.get("guessmygeo_token") ? (
          <>
            {!(
              cookies.get("guessmygeo_privilege") &&
              cookies.get("guessmygeo_privilege") === "admin"
            ) && (
              <>
                <AddButton
                  className={`btn-add ${addBtnDisplay} ${addBtnOpacity}`}
                  clickAction={() => {
                    setLocationDialogOpen && setLocationDialogOpen(true);

                    setLocationDialogType && setLocationDialogType("add");
                  }}
                />
                <div
                  id="profileAvatar"
                  className={`${menuItemDisplay} ${menuItemOpacity}`}
                  onClick={() => navigate("/profile")}
                >
                  <img
                    loading="lazy"
                    src={
                      user && user.avatar && typeof user.avatar === "string"
                        ? user.avatar
                        : URL.createObjectURL(user?.avatar as Blob)
                    }
                    className="avatar"
                    alt="user avatar"
                  />
                  {user && user.username}
                </div>
                <div
                  className={`${menuItemDisplay} ${menuItemOpacity}`}
                  onClick={() =>
                    setSettingsDialogOpen && setSettingsDialogOpen(true)
                  }
                >
                  <span>Settings</span>
                  <img
                    loading="eager"
                    src={chevron}
                    className="right-chevron"
                    alt=">"
                  />
                </div>
              </>
            )}
            <div
              className={`${menuItemDisplay} ${menuItemOpacity}`}
              onClick={() => {
                navigate("/login");
                
                cookies.remove("guessmygeo_token");

                cookies.remove("guessmygeo_privilege");

                document.removeEventListener("scroll", recordScrollAction);

              }}
            >
              <span className="color-primary">Logout</span>
              <img
                loading="eager"
                src={lightChevron}
                className="right-chevron"
                alt=">"
              />
            </div>
          </>
        ) : (
          <div
            id="authButtons"
            className={`${authButtonsDisplay} ${authButtonsOpacity} width-100`}
          >
            {location.pathname !== "/register" && (
              <div className="justify-content-center width-100">
                <TextButton
                  className="btn-text btn-fill-light"
                  type="button"
                  text="REGISTER"
                  clickAction={() => navigate("/register")}
                />
              </div>
            )}
            {location.pathname !== "/login" && (
              <div className="justify-content-center width-100">
                <TextButton
                  className="btn-text btn-outline"
                  type="button"
                  text="LOGIN"
                  clickAction={() => navigate("/login")}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        id="inscription"
        className={`
        ${inscriptionDisplay} ${inscriptionOpacity}
          ${
            !cookies.get("guessmygeo_token")
              ? "flex-grow-1 justify-content-start"
              : ""
          } ${cookies.get("guessmygeo_privilege") ? "grow-inscription" : ""}`}
        onClick={() => navigate("/")}
      >
        <aside className="display-flex flex-column">
          <img loading="eager" src={topLogoVector} alt="logo vector"></img>
          <img loading="eager" src={bottomLogoVector} alt="logo vector"></img>
        </aside>
        <p>
          Guess<span>My</span>Geo
        </p>
      </div>
      <HamburgerButton
        className={`btn-hamburger ${
          collapsed ? "btn-hamburger-open" : ""
        } ${hamBtnAlign}`}
        clickAction={collapseNavbar}
      />
    </nav>
  );
};
