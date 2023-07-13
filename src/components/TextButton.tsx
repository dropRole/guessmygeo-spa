import React from "react";
import { recordClickAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";
import { ITextButtonProps } from "./interfaces/button";

export const TextButton: React.FC<ITextButtonProps> = ({
  type,
  className,
  text,
  form,
  clickAction,
}) => {
  const cookies: Cookies = new Cookies();

  return (
    <button
      className={className}
      type={type}
      form={form}
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
      {text}
    </button>
  );
};
