import React, { useState } from "react";
import { Nav } from "../layouts/Nav";
import { PasswordResetForm } from "../containers/PasswordResetForm";
import "./PasswordReset.css";
import { ActionResultDialog } from "../components/ActionResultDialog";

export const PasswordReset: React.FC = () => {
  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [resetResult, setResetResult] = useState<string>("");

  return (
    <>
      <Nav />
      <p id="passResetIntro">Reset password</p>
      <p>Input valid password and confirm it.</p>
      <PasswordResetForm
        setActionResultDialogOpen={setResultDialogOpen}
        setActionResult={setResetResult}
      />
      <ActionResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        actionResult={resetResult}
        setActionResult={setResetResult}
      />
    </>
  );
};
