import React, { useEffect, useState } from "react";
import defaultAvatar from "../assets/icons/default-avatar.png";
import "./LeaderboardGuesser.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { streamUserAvatar } from "../helpers/auth-utility";
import { ILeaderboardGuesserProps } from "./interfaces/leaderboard";

export const LeaderboardGuesser: React.FC<ILeaderboardGuesserProps> = ({
  guesser,
  personalGuess,
}) => {
  const [guesserAvatar, setGuesserAvatar] = useState<Blob | string>(
    defaultAvatar
  );

  useEffect(() => {
    guesser.avatar !== null &&
      streamUserAvatar<Blob | string>(
        guesser.avatar as string,
        undefined,
        setGuesserAvatar
      );
  }, [guesser]);

  const navigate: NavigateFunction = useNavigate();

  return (
    <div
      className={`leaderboard-guesser ${personalGuess ? "you-guesser" : ""}`}
      onClick={() =>
        navigate(
          `/profile?username=${guesser.username}&name=${guesser.name}&surname=${guesser.surname}&email=${guesser.email}&avatar=${guesser.avatar}`
        )
      }
    >
      <span className={`guesser-placement-${guesser.placement}`}>
        {guesser.placement}
      </span>
      <img
        src={
          typeof guesserAvatar === "string"
            ? guesserAvatar
            : URL.createObjectURL(guesserAvatar)
        }
        alt={`${guesser.name} ${guesser.surname}`}
      />
      <p>
        <span>
          {personalGuess ? "You" : `${guesser.name} ${guesser.surname}`}
        </span>
        <span>{new Date(guesser.guessedAt).toLocaleDateString()}</span>
      </p>
      <p className={personalGuess ? "you-guesser" : ""}>{guesser.result}m</p>
    </div>
  );
};
