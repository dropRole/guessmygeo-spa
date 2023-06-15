import React from "react";
import { recordClickAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";

interface IHamburgerButtonProps {
  className: string;
  clickAction: () => void;
}

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

        // logged in user
        if (cookies.get("guessmygeo_token")) recordClickAction();
      }}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};
