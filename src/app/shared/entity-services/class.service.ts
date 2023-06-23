import { Injectable } from '@angular/core';
import { API_BASE_URL } from 'src/app/api-config';
import { Observable } from 'rxjs';
import {} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClassService {
  private readonly baseClassUrl = `${API_BASE_URL}/classes`;

  constructor(private http: HttpClient) {}

  ifClassDefined(): Observable<ClassDefined> {
    return this.http.get<ClassDefined>(`${this.baseClassUrl}/isDefined`);
  }

  getClasses(): Observable<ClassDto> {
    return this.http.get<ClassDto>(`${this.baseClassUrl}`);
  }

  saveClasses(classDto: ClassDto) {
    return this.http.post(`${this.baseClassUrl}`, classDto);
  }
}
export interface ClassDefined {
  isDefined: boolean;
}
export interface ClassDto {
  [key: number]: ClassDescription[];
}
export interface ClassDescription {
  sequence: number;
  name: string;
  id: number;
}
