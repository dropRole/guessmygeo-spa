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

interface IPasswordClaimFormProps {
  setForm: React.Dispatch<React.SetStateAction<"login" | "reset">>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  setDetails: React.Dispatch<React.SetStateAction<string>>;
}

interface IPasswordClaimFormFields {
  username: string;
}

const schema: yup.ObjectSchema<IPasswordClaimFormFields> = yup.object({
  username: yup.string().required().max(320),
});

export const PasswordClaimForm: React.FC<IPasswordClaimFormProps> = ({
  setForm,
  setOpen,
  setResult,
  setDetails,
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
    setOpen(true);

    const signResult: { email: string; jwt: string } | string =
      await authService.signPassResetJWT(data.username);

    // failed
    if (typeof signResult === "string") {
      setResult("An error occured.");

      return setDetails(signResult);
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
      setResult("An error occured.");

      return setDetails(sentResult);
    }

    setResult("Reset email sent.");

    setDetails(`The reset email was sent on the ${signResult.email} address.`);
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
        <span onClick={() => setForm("login")}>Login</span>
      </p>
    </form>
  );
};
