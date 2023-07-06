import React from "react";
import { recordClickAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";

interface ITextButtonProps {
  type: "button" | "submit" | "reset";
  className: string;
  text: string;
  form?: string;
  clickAction: () => void;
}

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

        // logged in user
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
