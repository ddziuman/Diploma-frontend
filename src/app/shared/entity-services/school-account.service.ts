import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from 'src/app/api-config';
import { Observable } from 'rxjs';
import {
  SchoolAccount,
  SchoolAccountDto,
} from '../interfaces/school-account.interface';
import { ItemExist } from '../interfaces/be-interfaces';

@Injectable()
export class SchoolAccountService {
  private readonly baseSchoolAccountURL = `${API_BASE_URL}/school-accounts`;

  constructor(private http: HttpClient) {}

  create(schoolAccount: SchoolAccountDto): Observable<SchoolAccount> {
    return this.http.post<SchoolAccount>(
      this.baseSchoolAccountURL,
      schoolAccount
    );
  }

  ifSchoolWithEdeboExists(edebo: number): Observable<ItemExist> {
    return this.http.get<ItemExist>(`${this.baseSchoolAccountURL}/${+edebo}`);
  }
}
