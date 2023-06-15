import { InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./RegisterForm.css";
import visible from "../assets/icons/visible.png";
import unvisible from "../assets/icons/unvisible.png";
import { TextButton } from "../components/TextButton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import AuthService from "../api/auth.service";
import { sendEmail } from "../helpers/aws-utility";
import { render } from "@react-email/render";
import { RegistrationEmail } from "../components/RegistrationEmail";

interface IRegisterFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  setDetails: React.Dispatch<React.SetStateAction<string>>;
}

interface IRegisterFormFields {
  email: string;
  name: string;
  surname: string;
  username: string;
  pass: string;
  confirmPass: string;
}

const schema: yup.ObjectSchema<IRegisterFormFields> = yup.object({
  email: yup.string().required().max(320),
  name: yup.string().required().max(35),
  surname: yup.string().required().max(35),
  username: yup.string().required().min(4).max(20),
  pass: yup
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
    .oneOf([yup.ref("pass")], "Passwords must match"),
});

export const RegisterForm: React.FC<IRegisterFormProps> = ({
  setOpen,
  setResult,
  setDetails,
}) => {
  const [passVisible, setPassVisible] = useState<boolean>(false);

  const [confirmPassVisible, setConfirmPassVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormFields>({ resolver: yupResolver(schema) });

  const authService: AuthService = new AuthService();

  const onSubmit: SubmitHandler<IRegisterFormFields> = async (
    data: IRegisterFormFields
  ) => {
    setOpen(true);

    const result: string = await authService.register(
      data.username,
      data.pass,
      data.name,
      data.surname,
      data.email
    );

    // succeeded
    if (result === "") {
      setResult("Register succeeded.");

      setDetails("You may login.");

      const html: string = render(
        <RegistrationEmail registrated={new Date()} username={data.username} />
      );

      return sendEmail(html, data.email, "Registration");
    }

    setResult("Register failed.");

    setDetails(result);
  };

  const navigate: NavigateFunction = useNavigate();

  return (
    <form id="registerForm" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoFocus
        margin="dense"
        label="Email"
        type="email"
        fullWidth
        variant="standard"
        color="success"
        {...register("email")}
        data-error={errors.email ? errors.email.message : ""}
      />
      <div id="fullnameInputs" className="display-flex justify-content-between">
        <TextField
          margin="dense"
          label="Name"
          type="text"
          variant="standard"
          color="success"
          {...register("name")}
          data-error={errors.name ? errors.name.message : ""}
        />
        <TextField
          margin="dense"
          label="Surname"
          type="text"
          variant="standard"
          color="success"
          {...register("surname")}
          data-error={errors.surname ? errors.surname.message : ""}
        />
      </div>
      <TextField
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
      <TextField
        margin="dense"
        label="Confirm password"
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
        className="btn-text btn-fill-light"
        type="submit"
        text="REGISTER"
        clickAction={() => {}}
      />
      <p className="display-flex justify-content-between">
        <span>Already have an account?</span>
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </form>
  );
};
