import { StringBoolean, StringWorkStatus, SchoolFinancingType, SchoolSupportName } from "../types";
import { InstitutionType } from "../enums/institution-type.enum";
import { Region } from "../enums/region.enum";

export interface RegistrySchool { // from external API
  institution_name: string,
  institution_id: number,
  is_checked: StringBoolean,
  short_name: string | null,
  state_name: StringWorkStatus,
  institution_type_name: InstitutionType,
  university_financing_type_name: SchoolFinancingType,
  koatuu_id: number,
  region_name: Region,
  koatuu_name: string, // unstructured
  address: string | null,
  parent_institution_id: number | null,
  governance_name: string,
  phone: string | null,
  fax: string | null,
  email: string | null,
  website: string | null,
  boss: string | null,
  support_name: SchoolSupportName,
  is_village: StringBoolean,
  is_mountain: StringBoolean,
  is_internat: StringBoolean,
  approved_count: number | null
};

// Example:
// {
//   "institution_name": "Еколого-природничий ліцей №116 міста Києва",
//   "institution_id": "148429",
//   "is_checked": "так",
//   "short_name": "Еколого-природничий ліцей №116 міста Києва",
//   "state_name": "працює",
//   "institution_type_name": "ліцей",
//   "university_financing_type_name": "Комунальна",
//   "koatuu_id": "8036100000",
//   "region_name": "КИЇВ",
//   "koatuu_name": "Київ",
//   "address": "провулок Сільськогосподарський, 2",
//   "parent_institution_id": null,
//   "governance_name": "Управління освіти Голосіївської районної в місті Києві державної адміністрації",
//   "phone": "(044)2589988",
//   "fax": "(044)2589988",
//   "email": "ecoprirodnichi116@gmail.com",
//   "website": "http:\/\/eco116.at.ua\/",
//   "boss": "Директор Авраменко Таміла Олексіївна",
//   "support_name": "ні",
//   "is_village": "ні",
//   "is_mountain": "ні",
//   "is_internat": "ні",
//   "approved_count": null
// }