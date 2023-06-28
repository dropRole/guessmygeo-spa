import React, { useEffect, useState } from "react";
import defaultAvatar from "../assets/icons/default-avatar.png";
import AuthService from "../api/auth.service";
import { IGuesser } from "./GuessingLeaderboard";
import "./LeaderboardGuesser.css";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface ILeaderboardGuesserProps {
  guesser: IGuesser;
  personalGuess: boolean;
}

export const LeaderboardGuesser: React.FC<ILeaderboardGuesserProps> = ({
  guesser,
  personalGuess,
}) => {
  const [avatar, setAvatar] = useState<Blob | string>(defaultAvatar);

  const authService: AuthService = new AuthService();

  useEffect(() => {
    const streamAvatar: () => void = async () => {
      const avatar: Blob = await authService.streamAvatar(
        guesser.avatar as string
      );

      setAvatar(avatar);
    };

    // user uploaded avatar
    if (guesser.avatar !== null) streamAvatar();
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
        src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
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
