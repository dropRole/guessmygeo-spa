import React, { useState } from "react";
import { Nav } from "../layouts/Nav";
import { ActionsGrid } from "../containers/ActionsGrid";
import { ActionResultDialog } from "../components/ActionResultDialog";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

export const AdminPanel: React.FC = () => {
  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [actionDeletionResult, setActionDeletionResult] = useState<string>("");

  const cookies: Cookies = new Cookies();

  return cookies.get("guessmygeo_privilege") ? (
    <>
      <Nav />
      <ActionsGrid
        setOpen={setResultDialogOpen}
        setActionResult={setActionDeletionResult}
      />
      <ActionResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        actionResult={actionDeletionResult}
        setActionResult={setActionDeletionResult}
      />
    </>
  ) : (
    <Navigate to="/" />
  );
};
