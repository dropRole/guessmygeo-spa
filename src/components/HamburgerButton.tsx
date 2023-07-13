import React from "react";
import { recordClickAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";
import { IHamburgerButtonProps } from "./interfaces/button";

export const HamburgerButton: React.FC<IHamburgerButtonProps> = ({
  className,
  clickAction,
}) => {
  const cookies: Cookies = new Cookies();

  return (
    <button
      className={className}
      onClick={async () => {
        clickAction();

        // authenticated user without any privileges
        if (
          cookies.get("guessmygeo_token") &&
          !cookies.get("guessmygeo_privilege")
        )
          recordClickAction();
      }}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};
