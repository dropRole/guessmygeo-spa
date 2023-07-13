import IAction from "../../api/interfaces/action.interface";
import { IActionResultDialogProps } from "../../components/interfaces/dialog";

interface IActionsGridProps
  extends Pick<IActionResultDialogProps, "setOpen" | "setActionResult"> {}

interface IGridAction extends Omit<IAction, "user"> {
  user: string;
}

export type { IActionsGridProps, IGridAction };
