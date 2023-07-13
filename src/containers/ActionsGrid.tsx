import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import IAction from "../api/interfaces/action.interface";
import ActionsService from "../api/actions.service";
import { TextField } from "@mui/material";
import { TextButton } from "../components/TextButton";
import "./ActionsGrid.css";
import { IActionsGridProps, IGridAction } from "./interfaces/data-grid";

export const ActionsGrid: React.FC<IActionsGridProps> = ({
  setOpen: setDeletionResultDialogOpen,
  setActionResult: setDeletionResult,
}) => {
  const [actionPerformer, setActionPerformer] = useState<string>("");

  const [gridActions, setGridActions] = useState<IGridAction[]>([]);

  const [actionsToDelete, setActionsToDelete] = useState<string[]>([]);

  const [loadLimit, setLoadLimit] = useState<number>(100);

  const [loadPage, setLoadPage] = useState<number>(0);

  const [loadPageSize, setLoadPageSize] = useState<number>(25);

  const actionsService: ActionsService = new ActionsService();

  const selectActions: () => void = async () => {
    const userActions: IAction[] | string = await actionsService.selectActions(
      loadLimit,
      actionPerformer
    );

    // actions retrieved
    if (typeof userActions !== "string")
      setGridActions(
        userActions.map((userAction) => ({
          ...userAction,
          user: userAction.user.username,
        }))
      );
  };

  useEffect(() => {
    selectActions();
  }, [loadLimit]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 100,
    },
    { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
    { field: "component", headerName: "Component", flex: 1, minWidth: 150 },
    { field: "value", headerName: "Value(optional)", flex: 1, minWidth: 175 },
    { field: "url", headerName: "URL", minWidth: 100 },
    {
      field: "performedAt",
      headerName: "Performed at",
      flex: 1,
      minWidth: 175,
    },
    { field: "user", headerName: "User", flex: 1, minWidth: 100 },
  ];

  const filterUsersActions: (e: any) => void = async (e: any) => {
    setActionPerformer(e.target.value);

    setLoadLimit(100);

    setLoadPage(0);

    const userActions: IAction[] | string = await actionsService.selectActions(
      loadLimit,
      e.target.value
    );

    // actions retrieved
    if (typeof userActions !== "string") {
      setGridActions(
        userActions.map((userAction) => ({
          ...userAction,
          user: userAction.user.username,
        }))
      );
    }
  };

  const loadActions: (params: { [key: string]: any }) => void = async (params: {
    [key: string]: any;
  }) => {
    const {
      pagination: {
        paginationModel: { page: currentPage, pageSize: currentPageSize },
      },
    } = params;

    // next page
    if (currentPage > loadPage) {
      setLoadPage(loadPage);

      setLoadPageSize(currentPage * currentPageSize);

      const pageSizeAux = loadPageSize + currentPageSize;

      // top page limit met
      if (pageSizeAux === loadLimit) setLoadLimit(loadLimit + 100);
    }
  };

  const deleteAction: () => void = async () => {
    setDeletionResultDialogOpen(true);

    setDeletionResult("");

    let removedActions = 0;

    actionsToDelete.forEach(async (action) => {
      const removed: boolean | string = await actionsService.removeAction(action);

      // action removed
      if (typeof removed === "boolean" && removed) {
        removedActions++;

        setDeletionResult(
          `Deleted ${removedActions} of ${actionsToDelete.length}`
        );
      }
    });

    setLoadLimit(loadLimit + actionsToDelete.length);
  };

  return (
    <>
      <div id="actionPerformer">
        <p>User actions</p>
        <TextField
          label="Username"
          variant="outlined"
          color="success"
          onChange={filterUsersActions}
        />
      </div>
      <DataGrid
        rows={gridActions}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        pageSizeOptions={[25]}
        checkboxSelection
        filterMode="server"
        onRowSelectionModelChange={(model) =>
          setActionsToDelete(model as string[])
        }
        onStateChange={(params) => loadActions(params)}
      />
      {actionsToDelete.length ? (
        <TextButton
          type="button"
          className="btn-text btn-fill-dark action-del-btn"
          text="DELETE"
          clickAction={deleteAction}
        />
      ) : (
        <></>
      )}
    </>
  );
};
