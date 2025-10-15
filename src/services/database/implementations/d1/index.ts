import { IDAF } from "../..";
import { passwordRecoveryDAF } from "./passwordRecoveryDAF";
import { userDAF } from "./userDAF";

export const d1DAF: IDAF = {
  passwordRecovery: passwordRecoveryDAF,
  user: userDAF
}