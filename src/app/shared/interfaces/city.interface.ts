import { District } from "./district.interface";

export interface City {
  id?: number,
  type: string,
  name: string,
  district: District
};