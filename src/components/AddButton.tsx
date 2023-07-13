import React from "react";
import { recordClickAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";
import { IAddButtonProps } from "./interfaces/button";

export const AddButton: React.FC<IAddButtonProps> = ({
  className,
  clickAction,
}) => {
  const cookies: Cookies = new Cookies();

  return (
    <button
      className={className}
      onClick={async () => {
        clickAction();

        // authenticated user
        if (cookies.get("guessmygeo_token")) recordClickAction();
      }}
    >
      <span></span>
      <span></span>
    </button>
  );
};
