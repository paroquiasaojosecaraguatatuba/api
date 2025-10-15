import { IUserDAF } from "./contracts/IUserDAF";
import { d1DAF } from "./implementations/d1";

export interface IDAF {
  user: IUserDAF
}

export const getDAF = (): IDAF => {
 return d1DAF
}