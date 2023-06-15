import React from "react";
import pageNotFound from "../assets/icons/404.png";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { TextButton } from "../components/TextButton";

export const PageNotFound: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <>
      <p id="notFound">
        <img src={pageNotFound} alt="page not found" />
        <span>Page was not found.</span>
        <TextButton
          className="btn-text btn-fill-dark"
          type="button"
          text="Home"
          clickAction={() => navigate("/")}
        />
      </p>
    </>
  );
};
