import { DAF } from "../..";
import { passwordRecoveryDAF } from "./passwordRecoveryDAF";
import { userDAF } from "./userDAF";

export const d1DAF: DAF = {
  passwordRecovery: passwordRecoveryDAF,
  user: userDAF
}