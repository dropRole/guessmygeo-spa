import React, { useState } from "react";
import { Nav } from "../layouts/Nav";
import { ActionsGrid } from "../containers/ActionsGrid";
import { ResultDialog } from "../components/ResultDialog";
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
        setResultDialogOpen={setResultDialogOpen}
        setActionDeletionResult={setActionDeletionResult}
      />
      <ResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        result={actionDeletionResult}
        setResult={setActionDeletionResult}
      />
    </>
  ) : (
    <Navigate to="/" />
  );
};
