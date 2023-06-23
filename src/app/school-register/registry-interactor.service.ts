import { Injectable } from '@angular/core';
import { RegistrySchool } from '../shared/interfaces/registry-school.interface';
import { SchoolAccount } from '../shared/interfaces/school-account.interface';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RegistryInteractorService {
  constructor(private http: HttpClient) {}

  private readonly baseSchoolAPI =
    'https://registry.edbo.gov.ua/api/institution';

  private fileType = 'json';

  getRegistrySchoolByCode(edebo: number): Observable<RegistrySchool> {
    // how to implement this?
    const getSchoolAPI = `${this.baseSchoolAPI}/?id=${edebo}&exp=${this.fileType}`;
    return this.http
      .get<RegistrySchool>(getSchoolAPI, {
        observe: 'body',
        responseType: 'json',
      })
      .pipe(catchError(this.handleError));
  }

  transformIntoSchoolAccount(regSchool: RegistrySchool) {
    const schoolAccount: SchoolAccount = {
      fullName: regSchool.institution_name,
      shortName: regSchool.short_name,
      edebo: regSchool.institution_id,
      workStatus: true,
      type: regSchool.institution_type_name,
      ownership: regSchool.university_financing_type_name,
      koatuuName: regSchool.koatuu_name, // defined later
      address: regSchool.address,
      phoneNumber: regSchool.phone,
      director: regSchool.boss,
    };
    return schoolAccount;
  }

  private handleError(error: HttpErrorResponse) {
    let displayMessage: string;
    if (error.status === 0) {
      console.error('Client-side / network error');
      displayMessage = 'Школу не знайдено: перевірте підключення до Інтернету';
    } else if (error.status === 404) {
      displayMessage = 'Школу не знайдено: код ЄДЕБО недійсний';
    } else {
      displayMessage =
        'Школу не знайдено: відсутній доступ до ЄДЕБО, спробуйте пізніше';
    }
    return throwError(() => new Error(displayMessage));
  }
}
