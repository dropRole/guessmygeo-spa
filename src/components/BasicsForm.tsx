import { TextField } from "@mui/material";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import AuthService from "../api/auth.service";
import { recordInputAction } from "../helpers/actions-utility";
import Cookies from "universal-cookie";
import { IBasicsFormFields, IBasicsFormProps } from "./interfaces/form";

const schema: yup.ObjectSchema<IBasicsFormFields> = yup.object({
  email: yup.string().required().max(320),
  username: yup.string().required().min(4).max(20),
  name: yup.string().required().max(35),
  surname: yup.string().required().max(35),
});

export const BasicsForm: React.FC<IBasicsFormProps> = ({
  user,
  setUser,
  setActionResultDialogOpen: setEditResultDialogOpen,
  setActionResult: setEditResult,
  setActionDetails: setEditDetails,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IBasicsFormFields>({ resolver: yupResolver(schema) });

  const authService: AuthService = new AuthService();

  const cookies: Cookies = new Cookies();

  const onSubmit: SubmitHandler<IBasicsFormFields> = async (
    data: IBasicsFormFields
  ) => {
    setEditResultDialogOpen(true);

    const result: { jwt: string } | string = await authService.editInfo(
      data.username,
      data.name,
      data.surname,
      data.email
    );

    // failed
    if (typeof result === "string") {
      setEditResult("An error occured.");

      return setEditDetails && setEditDetails(result);
    }

    const { jwt } = result;

    cookies.set("guessmygeo_token", jwt, {
      path: "/",
      expires: new Date(
        new Date().setMilliseconds(new Date().getMilliseconds() + 86_400_000)
      ),
    });

    setUser({
      ...data,
      avatar: user.avatar,
    });

    setEditResult("Basics changed.");

    setEditDetails && setEditDetails("You're basics are saved.");
  };

  return (
    <form id="basicsForm" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoFocus
        margin="dense"
        label="Email"
        type="email"
        fullWidth
        variant="standard"
        color="success"
        {...register("email", { value: user.email })}
        data-error={errors.email ? errors.email.message : ""}
        onBlur={recordInputAction}
      />
      <TextField
        margin="dense"
        label="Username"
        type="text"
        fullWidth
        variant="standard"
        color="success"
        {...register("username", { value: user.username })}
        data-error={errors.username ? errors.username.message : ""}
        onBlur={recordInputAction}
      />
      <div id="fullnameControls">
        <TextField
          margin="dense"
          label="Name"
          type="text"
          variant="standard"
          color="success"
          {...register("name", { value: user.name })}
          data-error={errors.name ? errors.name.message : ""}
          onBlur={recordInputAction}
        />
        <TextField
          margin="dense"
          label="Surname"
          type="text"
          variant="standard"
          color="success"
          {...register("surname", { value: user.surname })}
          data-error={errors.surname ? errors.surname.message : ""}
          onBlur={recordInputAction}
        />
      </div>
    </form>
  );
};
