import { Region } from "./region.interface";

export interface District {
  id?: number,
  type: string,
  name: string,
  region: Region
};