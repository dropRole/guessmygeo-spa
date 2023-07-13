import ILocation from "../../api/interfaces/location.interface";

interface IDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActionResultDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActionResult: React.Dispatch<React.SetStateAction<string>>;
  setActionDetails?: React.Dispatch<React.SetStateAction<string>>;
}

interface IDeletionDialogProps extends IDialogProps {
  toDelete: ILocation | undefined;
  setDeleted: React.Dispatch<React.SetStateAction<ILocation | undefined>>;
}

interface IActionResultDialogProps
  extends Pick<
    IDialogProps,
    "open" | "setOpen" | "setActionResult" | "setActionDetails"
  > {
  actionResult: string;
  actionDetails?: string;
}

export type { IDialogProps, IDeletionDialogProps, IActionResultDialogProps };
