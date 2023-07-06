import React, { useEffect, useRef, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IAction } from "../interfaces/action.interface";
import ActionsService from "../api/actions.service";
import { TextField } from "@mui/material";
import { TextButton } from "../components/TextButton";
import "./ActionsGrid.css";

interface IActionsGridProps {
  setResultDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActionDeletionResult: React.Dispatch<React.SetStateAction<string>>;
}

interface IGridAction extends Omit<IAction, "user"> {
  user: string;
}

export const ActionsGrid: React.FC<IActionsGridProps> = ({
  setResultDialogOpen,
  setActionDeletionResult,
}) => {
  const [actionPerformer, setActionPerformer] = useState<string>("");

  const [gridActions, setGridActions] = useState<IGridAction[]>([]);

  const [actionsToDelete, setActionsToDelete] = useState<string[]>([]);

  const [limit, setLimit] = useState<number>(100);

  const [page, setPage] = useState<number>(0);

  const [pageSize, setPageSize] = useState<number>(25);

  const actionsService: ActionsService = new ActionsService();

  useEffect(() => {
    const selectActions: () => void = async () => {
      const userActions: IAction[] | string =
        await actionsService.selectActions(limit, actionPerformer);

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

    selectActions();
  }, [limit]);

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

  return (
    <>
      <div id="actionPerformer">
        <p>User actions</p>
        <TextField
          label="Username"
          variant="outlined"
          color="success"
          onChange={async (e) => {
            setActionPerformer(e.target.value);

            setLimit(100);

            setPage(0);

            const userActions: IAction[] | string =
              await actionsService.selectActions(limit, e.target.value);

            // actions retrieved
            if (typeof userActions !== "string") {
              setGridActions(
                userActions.map((userAction) => ({
                  ...userAction,
                  user: userAction.user.username,
                }))
              );
            }
          }}
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
        onStateChange={(params) => {
          const {
            pagination: {
              paginationModel: { page: currentPage, pageSize: currentPageSize },
            },
          } = params;
          
          // next page
          if (currentPage > page) {
            setPage(page);

            setPageSize(currentPage * currentPageSize);

            const pageSizeAux = pageSize + currentPageSize;

            // top page limit met
            if (pageSizeAux === limit) setLimit(limit + 100);
          }
        }}
      />
      {actionsToDelete.length ? (
        <TextButton
          type="button"
          className="btn-text btn-fill-dark action-del-btn"
          text="DELETE"
          clickAction={async () => {
            setActionDeletionResult("");

            setResultDialogOpen(true);

            let removedActions = 0;

            actionsToDelete.forEach(async (action) => {
              const removed: boolean = await actionsService.removeAction(
                action
              );

              // action removed
              if (removed) {
                removedActions++;

                setActionDeletionResult(
                  `Deleted ${removedActions} of ${actionsToDelete.length}`
                );
              }
            });

            setLimit(limit + actionsToDelete.length);
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};
