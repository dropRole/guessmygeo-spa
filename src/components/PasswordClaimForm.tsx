import { TextField } from "@mui/material";
import React from "react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./PasswordClaimForm.css";
import { TextButton } from "./TextButton";
import { render } from "@react-email/render";
import { PasswordResetEmail } from "./PasswordResetEmail";
import AuthService from "../api/auth.service";
import { sendEmail } from "../helpers/aws-utility";
import { IPasswordClaimFormFields, IPasswordClaimFormProps } from "./interfaces/form";

const schema: yup.ObjectSchema<IPasswordClaimFormFields> = yup.object({
  username: yup.string().required().max(320),
});

export const PasswordClaimForm: React.FC<IPasswordClaimFormProps> = ({
  setFormType,
  setActionResultDialogOpen: setClaimResultDialogOpen,
  setActionResult: setClaimResult,
  setActionDetails: setClaimDetails,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPasswordClaimFormFields>({ resolver: yupResolver(schema) });

  const authService: AuthService = new AuthService();

  const onSubmit: SubmitHandler<IPasswordClaimFormFields> = async (
    data: IPasswordClaimFormFields
  ) => {
    setClaimResultDialogOpen(true);

    const signResult: { [key: string]: string } | string =
      await authService.signPassResetJWT(data.username);

    // failed
    if (typeof signResult === "string") {
      setClaimResult("An error occured.");

      return setClaimDetails && setClaimDetails(signResult);
    }

    const html: string = render(
      <PasswordResetEmail
        username={data.username}
        url={`${window.location.origin}/pass-reset?token=${signResult.jwt}`}
        requested={new Date()}
      />,
      {
        pretty: true,
      }
    );

    const sentResult: string = await sendEmail(
      html,
      signResult.email,
      "Password reset"
    );

    // failed
    if (sentResult !== "") {
      setClaimResult("An error occured.");

      return setClaimDetails && setClaimDetails(sentResult);
    }

    setClaimResult("Reset email sent.");

    setClaimDetails && setClaimDetails(`The reset email was sent on the ${signResult.email} address.`);
  };

  return (
    <form id="resetForm" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoFocus
        margin="dense"
        label="Username"
        type="text"
        fullWidth
        variant="standard"
        color="success"
        {...register("username")}
        data-error={errors.username ? errors.username.message : ""}
      />
      <TextButton
        className="btn-text btn-fill-light"
        type="submit"
        text="RESET"
        clickAction={() => {}}
      />
      <p className="display-flex justify-content-between">
        <span>Remembered your password?</span>
        <span onClick={() => setFormType("login")}>Login</span>
      </p>
    </form>
  );
};
