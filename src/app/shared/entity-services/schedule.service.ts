import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from 'src/app/api-config';

@Injectable()
export class ScheduleService {
  private readonly baseClassUrl = `${API_BASE_URL}/schedule`;

  constructor(private httpClient: HttpClient) {}

  getScheduleByClass(classId: number): Observable<ScheduleDto> {
    const url = `${this.baseClassUrl}/${classId}`;

    return this.httpClient.get<ScheduleDto>(url);
  }

  saveSchedule(saveScheduleDto: SaveScheduleDto) {
    const url = `${this.baseClassUrl}/save`;

    return this.httpClient.post(url, saveScheduleDto);
  }
}
export enum WeekDays {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
}
export interface SaveScheduleDto {
  classId: number;
  schedule: ScheduleDto;
}
export type ScheduleDto = {
  [key in WeekDays]: {
    slot: number;
    subjectId: number;
    teacherId: number;
    description: string;
  }[];
};
