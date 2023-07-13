import AuthService from "../api/auth.service";
import IUser from "../api/interfaces/user.interface";
import defaultAvatar from "../assets/icons/default-avatar.png";

const authService: AuthService = new AuthService();

export const getUserInfo: <StateType>(
  updateState: React.Dispatch<React.SetStateAction<StateType>>,
  user?: IUser
) => void = async <StateType>(
  updateState: React.Dispatch<React.SetStateAction<StateType>>,
  user?: IUser
) => {
  const info: IUser | string = user ? user : await authService.selectInfo();

  // user info selected
  if (typeof info !== "string") {
    // user uploaded the avatar
    if (info.avatar !== null)
      return streamUserAvatar(info.avatar as string, info, updateState);
    updateState({ ...info, avatar: defaultAvatar } as StateType);
  }
};

export const streamUserAvatar: <StateType>(
  path: string,
  user: IUser | undefined,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => void = async <StateType>(
  path: string,
  user: IUser | undefined,
  updateState: React.Dispatch<React.SetStateAction<StateType>>
) => {
  const avatar: Blob | string = await authService.streamAvatar(path);
  
  user
    ? updateState({ ...user, avatar } as StateType)
    : updateState(avatar as StateType);
};
