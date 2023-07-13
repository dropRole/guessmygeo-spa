import React, { useEffect, useState } from "react";
import "./AvatarForm.css";
import { SubmitHandler, useForm } from "react-hook-form";
import IUser from "../api/interfaces/user.interface";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../api/auth.service";
import { TextButton } from "../components/TextButton";
import defaultAvatar from "../assets/icons/default-avatar.png";
import { recordInputAction } from "../helpers/actions-utility";
import { streamUserAvatar } from "../helpers/auth-utility";
import { IAvatarFormProps } from "./interfaces/form";

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
  setActionResultDialogOpen: setUploadResultDialogOpen,
  setActionResult: setUploadResult,
  setActionDetails: setUploadDetails,
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
    setUploadResultDialogOpen(true);

    const formData: FormData = new FormData();
    formData.append("avatar", data.avatar[0]);

    const result: string = await authService.uploadAvatar(formData);

    // failed
    if (typeof result === "string" && result !== "") {
      setUploadResult("Avatar change failed.");

      return setUploadDetails && setUploadDetails(result);
    }

    const info: IUser | string = await authService.selectInfo();

    // succeeded
    if (typeof info !== "string") {
      streamUserAvatar(info.avatar as string, user, setUser);

      setUploadResult("Avatar changed.");

      setUploadDetails && setUploadDetails("You're avatar was uploaded.");
    }
  };

  const uploadAvatar: () => void = async () => {
    setUploadResultDialogOpen(true);

    const result: string = await authService.removeAvatar();

    // failed
    if (typeof result === "string" && result !== "") {
      setUploadResult("Avatar removal failed.");

      return setUploadDetails && setUploadDetails(result);
    }

    setUser({ ...user, avatar: defaultAvatar });

    setAvatarPreview(defaultAvatar);

    setUploadResult("Avatar removed.");

    setUploadDetails && setUploadDetails("You're avatar is set to default.");
  };

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
              onInput={(e: any) => {
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
            clickAction={() => uploadAvatar()}
          />
        )}
      </div>
    </form>
  );
};
