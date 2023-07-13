import { InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import visible from "../assets/icons/visible.png";
import unvisible from "../assets/icons/unvisible.png";
import "./PasswordForm.css";
import { SubmitHandler } from "react-hook-form/dist/types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../api/auth.service";
import { IPasswordFormFields, IPasswordFormProps } from "./interfaces/form";

const schema: yup.ObjectSchema<{
  pass: string;
  newPass: string;
  confirmPass: string;
}> = yup.object({
  pass: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
  newPass: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
  confirmPass: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .oneOf([yup.ref("newPass")], "Passwords must match"),
});

export const PasswordForm: React.FC<IPasswordFormProps> = ({
  setActionResultDialogOpen: setEditDialogOpen,
  setActionResult: setEditResult,
  setActionDetails: setEditDetails,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPasswordFormFields>({ resolver: yupResolver(schema) });

  const [passVisible, setPassVisible] = useState<boolean>(false);

  const [newPassVisible, setNewPassVisible] = useState<boolean>(false);

  const [confirmPassVisible, setConfirmPassVisible] = useState<boolean>(false);

  const authService: AuthService = new AuthService();

  const onSubmit: SubmitHandler<IPasswordFormFields> = async (
    data: IPasswordFormFields
  ) => {
    setEditDialogOpen(true);

    const result: string = await authService.changePass(
      data.pass,
      data.newPass
    );

    // succeeded
    if (typeof result === "string" && result !== "") {
      setEditResult("Password change failed.");

      return setEditDetails && setEditDetails(result);
    }

    setEditResult("Password changed.");

    setEditDetails && setEditDetails("You're password is saved.");
  };

  return (
    <form id="passwordForm" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoFocus
        margin="dense"
        label="Current password"
        type={passVisible ? "text" : "password"}
        fullWidth
        variant="standard"
        color="success"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <img
                loading="eager"
                src={passVisible ? visible : unvisible}
                alt="pass visibility"
                onClick={() => setPassVisible(!passVisible)}
              />
            </InputAdornment>
          ),
        }}
        {...register("pass")}
        data-error={errors.pass ? errors.pass.message : ""}
      />
      <TextField
        margin="dense"
        label="New password"
        type={newPassVisible ? "text" : "password"}
        fullWidth
        variant="standard"
        color="success"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <img
                loading="eager"
                src={newPassVisible ? visible : unvisible}
                alt="pass visibility"
                onClick={() => setNewPassVisible(!newPassVisible)}
              />
            </InputAdornment>
          ),
        }}
        {...register("newPass")}
        data-error={errors.newPass ? errors.newPass.message : ""}
      />
      <TextField
        margin="dense"
        label="Confirm new password"
        type={confirmPassVisible ? "text" : "password"}
        fullWidth
        variant="standard"
        color="success"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <img
                loading="eager"
                src={confirmPassVisible ? visible : unvisible}
                alt="pass visibility"
                onClick={() => setConfirmPassVisible(!confirmPassVisible)}
              />
            </InputAdornment>
          ),
        }}
        {...register("confirmPass")}
        data-error={errors.confirmPass ? errors.confirmPass.message : ""}
      />
    </form>
  );
};
