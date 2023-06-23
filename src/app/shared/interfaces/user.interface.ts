import { Role } from "../enums/role.enum"
import { SchoolAccount } from "./school-account.interface"

export interface User {
  id?: number,
  email: string,
  passHash: string, // needs to be hashed,
  role?: Role,
  firstName?: string,
  lastName?: string,
  fatherName?: string,
  school?: SchoolAccount,
  phoneNumber?: string | null,
  class?: number | null // define 'class' later, for now: always 'null'
};