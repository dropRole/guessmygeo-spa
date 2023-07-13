import ActionsService from "../api/actions.service";

const actionsService: ActionsService = new ActionsService();

export const recordClickAction: () => void = async () =>
  await actionsService.recordAction(
    "Click",
    "button",
    "",
    new URL(window.location.href)
  );

export const recordInputAction: (e: any) => void = async (e: any) =>
  await actionsService.recordAction(
    "Input",
    "input",
    e.target.value,
    new URL(window.location.href)
  );

export const recordScrollAction: () => void = async () =>
  await actionsService.recordAction(
    "Scroll",
    "document",
    `{ scrollX: ${window.scrollX}, scrollY: ${window.scrollY} }`,
    new URL(window.location.href)
  );
