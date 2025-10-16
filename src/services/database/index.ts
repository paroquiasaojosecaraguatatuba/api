import { PasswordRecoveryDAF } from "./contracts/PasswordRecoveryDAF";
import { UserDAF } from "./contracts/UserDAF";
import { d1DAF } from "./implementations/d1";

export interface DAF {
  passwordRecovery: PasswordRecoveryDAF
  user: UserDAF
}

export const getDAF = () => {
 return d1DAF
}