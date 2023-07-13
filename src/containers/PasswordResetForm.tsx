import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import AuthService from "../api/auth.service";
import { InputAdornment, TextField } from "@mui/material";
import visible from "../assets/icons/visible.png";
import unvisible from "../assets/icons/unvisible.png";
import "./PasswordResetForm.css";
import { TextButton } from "../components/TextButton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IPassResetFormFields,
  IPasswordResetFormProps,
} from "./interfaces/form";

const schema: yup.ObjectSchema<IPassResetFormFields> = yup.object({
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

export const PasswordResetForm: React.FC<IPasswordResetFormProps> = ({
  setActionResultDialogOpen: setResetResultDialogOpen,
  setActionResult: setResetResult,
}) => {
  const [newPassVisible, setNewPassVisible] = useState<boolean>(false);

  const [confirmPassVisible, setConfirmPassVisible] = useState<boolean>(false);

  const jwt: string = new URL(window.location.href).searchParams.get(
    "token"
  ) as string;

  const authService: AuthService = new AuthService();

  const navigate: NavigateFunction = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPassResetFormFields>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<IPassResetFormFields> = async (data) => {
    setResetResultDialogOpen(true);

    const result: string = await authService.changePass(
      undefined,
      data.newPass,
      jwt
    );

    // succeeded
    if (result === "") {
      setResetResult("Password is reset.");

      return setTimeout(() => navigate("/login"), 2000);
    }

    setResetResult("Password change failed.");
  };

  return (
    <form id="passResetForm" onSubmit={handleSubmit(onSubmit)}>
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
      <TextButton
        className="btn-text btn-fill-light width-100"
        type="submit"
        text="SUBMIT"
        clickAction={() => {}}
      />
    </form>
  );
};
