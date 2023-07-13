import { InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./LoginForm.css";
import visible from "../assets/icons/visible.png";
import unvisible from "../assets/icons/unvisible.png";
import { TextButton } from "../components/TextButton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import AuthService from "../api/auth.service";
import Cookies from "universal-cookie";
import { ILoginFormFields, ILoginFormProps } from "./interfaces/form";

const schema: yup.ObjectSchema<ILoginFormFields> = yup.object({
  username: yup.string().required().min(4).max(20),
  pass: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
});

export const LoginForm: React.FC<ILoginFormProps> = ({
  setFormType,
  setActionResultDialogOpen: setLoginResultDialogOpen,
  setActionResult: setLoginResult,
  setActionDetails: setLoginDetails,
}) => {
  const [passVisible, setPassVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormFields>({ resolver: yupResolver(schema) });

  const authService: AuthService = new AuthService();

  const navigate: NavigateFunction = useNavigate();

  const cookies: Cookies = new Cookies();

  const onSubmit: SubmitHandler<ILoginFormFields> = async (
    data: ILoginFormFields
  ) => {
    setLoginResultDialogOpen(true);

    const result: { [key: string]: string } | string = await authService.login(
      data.username,
      data.pass
    );

    // succeeded
    if (typeof result !== "string") {
      setLoginResult("Login succeeded.");

      setLoginDetails && setLoginDetails("Redirecting.");

      setTimeout(() => {
        const { jwt, privilege } = result;

        // admin logged in
        if (privilege && privilege === "admin") {
          navigate("/panel");

          cookies.set("guessmygeo_privilege", "admin", {
            path: "/",
            expires: new Date(
              new Date().setMilliseconds(
                new Date().getMilliseconds() + 86400000
              )
            ),
          });
        } else navigate("/");

        cookies.set("guessmygeo_token", jwt, {
          path: "/",
          expires: new Date(
            new Date().setMilliseconds(new Date().getMilliseconds() + 86400000)
          ),
        });
      }, 2000);

      return;
    }

    setLoginResult("Login failed.");

    setLoginDetails && setLoginDetails(result);
  };

  return (
    <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
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
      <TextField
        margin="dense"
        label="Password"
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
      <TextButton
        className="btn-text btn-fill-light"
        type="submit"
        text="LOGIN"
        clickAction={() => {}}
      />
      <p className="display-flex justify-content-between">
        <span>Forgot you're password?</span>
        <span onClick={() => setFormType("reset")}>Reset</span>
      </p>
    </form>
  );
};
