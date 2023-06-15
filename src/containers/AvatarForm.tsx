import React, { useEffect, useState } from "react";
import "./AvatarForm.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { IUser } from "../interfaces/user.interface";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../api/auth.service";
import { TextButton } from "../components/TextButton";
import defaultAvatar from "../assets/icons/default-avatar.png";
import ActionsService from "../api/actions.service";
import { recordInputAction } from "../helpers/actions-utility";

interface IAvatarFormProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditResult: React.Dispatch<React.SetStateAction<string>>;
  setEditDetails: React.Dispatch<React.SetStateAction<string>>;
}

const schema: yup.ObjectSchema<{ avatar: any }> = yup.object().shape({
  avatar: yup
    .mixed()
    .test("File required", "File is required", (filelist: any) => {
      if (filelist[0] === undefined) return false;

      return true;
    })
    .test(
      "File size",
      "File size exceeds the permitted size of 15000KB",
      (filelist: any) => {
        if (filelist[0]?.size > 15000) return false;

        return true;
      }
    )
    .test(
      "File type",
      "File is not of image/png MIME type",
      (filelist: any) => {
        if (filelist[0]?.type !== "image/png") return false;

        return true;
      }
    ),
});

export const AvatarForm: React.FC<IAvatarFormProps> = ({
  user,
  setUser,
  setDialogOpen,
  setEditResult,
  setEditDetails,
}) => {
  const [avatarPreview, setAvatarPreview] = useState<Blob | string>(
    user.avatar
  );

  useEffect(() => {}, [avatarPreview]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ avatar: File[] }>({ resolver: yupResolver(schema) });

  const authService: AuthService = new AuthService();

  const onSubmit: SubmitHandler<{ avatar: any }> = async (data: {
    avatar: FileList;
  }) => {
    setDialogOpen(true);

    const formData: FormData = new FormData();
    formData.append("avatar", data.avatar[0]);

    const result: string = await authService.uploadAvatar(formData);

    // failed
    if (typeof result === "string" && result !== "") {
      setEditResult("Avatar change failed.");

      return setEditDetails(result);
    }

    const info: IUser | string = await authService.selectInfo();

    // succeeded
    if (typeof info !== "string") {
      const avatar: Blob = await authService.streamAvatar(
        info.avatar as string
      );

      setUser({ ...info, avatar });

      setEditResult("Avatar changed.");

      setEditDetails("You're avatar was uploaded.");
    }
  };

  const actionsService: ActionsService = new ActionsService();

  return (
    <form id="avatarForm" onSubmit={handleSubmit(onSubmit)}>
      <div id="avatarChange">
        <div>
          <img
            loading="eager"
            src={
              typeof avatarPreview === "string"
                ? avatarPreview
                : URL.createObjectURL(avatarPreview)
            }
            alt="user avatar"
          />
        </div>
        {typeof user.avatar === "string" ? (
          <>
            <label htmlFor="avatar">CHOOSE AVATAR</label>
            <span
              data-error={errors.avatar ? errors.avatar.message : ""}
            ></span>
            <input
              id="avatar"
              type="file"
              onInput={async (e: any) => {
                setAvatarPreview(e.target.files[0]);

                recordInputAction(e);
              }}
              {...register("avatar")}
            />
          </>
        ) : (
          <TextButton
            className="btn-text btn-outline"
            type="button"
            text="REMOVE AVATAR"
            clickAction={async () => {
              setDialogOpen(true);

              const result: string = await authService.removeAvatar();

              // failed
              if (typeof result === "string" && result !== "") {
                setEditResult("Avatar removal failed.");

                return setEditDetails(result);
              }

              setUser({ ...user, avatar: defaultAvatar });

              setAvatarPreview(defaultAvatar);

              setEditResult("Avatar removed.");

              setEditDetails("You're avatar is set to default.");
            }}
          />
        )}
      </div>
    </form>
  );
};
