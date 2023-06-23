import { SchoolFinancingType } from '../types';
import { InstitutionType } from '../enums/institution-type.enum';
import { City } from './city.interface';

export interface SchoolAccount {
  fullName: string;
  shortName: string | null;
  edebo: number;
  workStatus: boolean;
  type: InstitutionType;
  ownership: SchoolFinancingType;
  koatuuName: string;
  address: string | null;
  phoneNumber: string | null;
  director: string | null;
}
export interface SchoolAccountDto {
  organizer: OrganizerDto;
  school: SchoolDto;
}
export interface OrganizerDto {
  email: string;
  fatherName: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordRepeat: string;
  phoneNumber: string;
  role: string;
}

export interface SchoolDto {
  address: string;
  director: string;
  edebo: string;
  fullName: string;
  koatuuName: string;
  ownership: string;
  schoolPhoneNumber: string;
  shortName: string;
  type: string;
}
