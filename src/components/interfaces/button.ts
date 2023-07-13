interface IButtonProps {
  className: string;
  clickAction: () => void;
}

interface IAddButtonProps extends IButtonProps {}

interface IHamburgerButtonProps extends IButtonProps {}

interface ITextButtonProps extends IButtonProps {
  type: "button" | "submit" | "reset";
  text: string;
  form?: string;
}

interface ISwitchButtonProps extends Pick<IButtonProps, "clickAction"> {
  title: string;
}

export type {
  IAddButtonProps,
  IHamburgerButtonProps,
  ITextButtonProps,
  ISwitchButtonProps,
};
