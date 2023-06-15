import ActionsService from "../api/actions.service";

export enum ActionType {
  Click = "Click",
  Scroll = "Scroll",
  Input = "Input",
}

const actionsService: ActionsService = new ActionsService();

export const recordClickAction: () => void = async () =>
  await actionsService.recordAction(
    ActionType.Click,
    "button",
    "",
    new URL(window.location.href)
  );

export const recordInputAction: (e: any) => void = async (e: any) =>
  await actionsService.recordAction(
    ActionType.Input,
    "input",
    e.target.value,
    new URL(window.location.href)
  );

export const recordScrollAction: () => void = async () =>
  await actionsService.recordAction(
    ActionType.Scroll,
    "document",
    `{ scrollX: ${window.scrollX}, scrollY: ${window.scrollY} }`,
    new URL(window.location.href)
  );
