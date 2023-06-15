import React from "react";
import "./Button.css";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch/Switch";
import { StyledComponent } from "@emotion/styled";
import bestResults from "../assets/icons/best-results.png";
import worstResults from "../assets/icons/worst-results.png";
import Tooltip from "@mui/material/Tooltip";

const CustomSwitch: StyledComponent<SwitchProps> = styled(Switch)(
  ({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url(${bestResults})`,
          backgroundSize: "22px",
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#233D4D",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(${worstResults})`,
        backgroundSize: "20px",
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  })
);

interface ISwitchButtonProps {
  title: string;
  clickAction: () => void;
}

export const SwitchButton: React.FC<ISwitchButtonProps> = ({
  title,
  clickAction,
}) => {
  return (
    <>
      <Tooltip
        children={
          <CustomSwitch defaultChecked onChange={() => clickAction()} />
        }
        title={title}
        placement="top"
        enterTouchDelay={0}
      />
    </>
  );
};
