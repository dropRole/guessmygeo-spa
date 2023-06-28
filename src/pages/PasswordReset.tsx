import React, { useState } from "react";
import { Nav } from "../layouts/Nav";
import { PasswordResetForm } from "../containers/PasswordResetForm";
import "./PasswordReset.css";
import { ResultDialog } from "../components/ResultDialog";

export const PasswordReset: React.FC = () => {
  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [resetResult, setResetResult] = useState<string>("");

  return (
    <>
      <Nav />
      <p id="passResetIntro">Reset password</p>
      <p>Input valid password and confirm it.</p>
      <PasswordResetForm
        setOpen={setResultDialogOpen}
        setResult={setResetResult}
      />
      <ResultDialog
        open={resultDialogOpen}
        setOpen={setResultDialogOpen}
        result={resetResult}
        setResult={setResetResult}
      />
    </>
  );
};
