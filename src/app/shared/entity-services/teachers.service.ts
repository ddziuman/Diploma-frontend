import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from 'src/app/api-config';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { OrganizerDto } from '../interfaces/school-account.interface';
import { PaginatedItems } from 'src/app/admin/components/teachers/teachers.component';
import { WeekDays } from './schedule.service';
@Injectable()
export class TeachersService {
  private readonly baseTeachersURL = `${API_BASE_URL}/teachers`;

  constructor(private http: HttpClient) {}

  getTeachersFromSchool(
    pageIndex: number,
    pageSize: number,
    subjectId?: number[],
    weekDay?: WeekDays,
    slot?: number,
    preselectedTeacher?: number
  ): Observable<PaginatedItems<Teacher>> {
    let url = `${this.baseTeachersURL}?`;
    if (subjectId) {
      let subjects = subjectId.reduce((acc, current, index) => {
        const encoded = encodeURI(current.toString());

        const param = `subjectId=${encoded}`;

        if (!index) {
          return param;
        } else {
          return `${acc}&${param}`;
        }
      }, '');
      url = url + subjects;
    }
    return this.http.get<PaginatedItems<Teacher>>(url, {
      params: {
        pageIndex,
        pageSize,
        weekDay,
        slot,
        preselectedTeacher,
      },
    });
  }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${API_BASE_URL}/subjects`);
  }

  createTeacher(teacherDto: TeacherDto): Observable<{ teacherId: string }> {
    const url = `${this.baseTeachersURL}/create`;

    return this.http.post<{ teacherId: string }>(url, teacherDto);
  }
}

export interface TeacherDto extends OrganizerDto {
  subjects: number[];
}
export interface Teacher extends User {
  subjects: Subject[];
}

export interface Subject {
  name: string;
  id: number;
}
