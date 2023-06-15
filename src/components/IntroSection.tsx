import React from "react";
import "./IntroSection.css";
import { TextButton } from "./TextButton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import worldMap from "../assets/icons/world-map.png";

export const IntroSection: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <section>
      <div>
        <div>
          <p id="pre-intro">Explore the world with GuessMyGeo!</p>
          <p>
            GuessMyGeo is website that allows you to post an image and tag it on
            the map. Other users than try to locate it via Google Maps.
          </p>
          <TextButton
            className="btn-text btn-fill-light"
            type="button"
            text="REGISTER"
            clickAction={() => navigate("/register")}
          />
        </div>
        <img loading="eager" src={worldMap} alt="world map" />
      </div>
      <p id="post-intro">Try yourself at GuessMyGeo!</p>
      <p>
        Try to guess the location of image by selecting position on the map.
        When you guess it, it gives you the error distance.
      </p>
    </section>
  );
};
