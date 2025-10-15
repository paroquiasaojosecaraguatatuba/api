import { IPasswordRecoveryDAF } from "./contracts/IPasswordRecoveryDAF";
import { IUserDAF } from "./contracts/IUserDAF";
import { d1DAF } from "./implementations/d1";

export interface IDAF {
  passwordRecovery: IPasswordRecoveryDAF
  user: IUserDAF
}

export const getDAF = (): IDAF => {
 return d1DAF
}