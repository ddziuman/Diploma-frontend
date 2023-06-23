import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Teacher,
  TeachersService,
} from 'src/app/shared/entity-services/teachers.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})
export class TeachersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'email',
    'firstName',
    'lastName',
    'phoneNumber',
    'subjects',
  ];

  payloadChange$ = new BehaviorSubject({
    pageSize: 5,
    pageIndex: 0,
  });
  teachersData$: Observable<PaginatedItems<Teacher>>;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly teacherService: TeachersService
  ) {}

  ngOnInit(): void {
    this.teachersData$ = this.payloadChange$.pipe(
      switchMap((payload) => {
        return this.teacherService.getTeachersFromSchool(
          payload.pageIndex,
          payload.pageSize
        );
      })
    );
  }

  navigateToCreate() {
    this.router.navigate(['./create'], { relativeTo: this.route });
  }

  pageChange($event: PageEvent) {
    console.log($event);
    this.payloadChange$.next({
      pageIndex: $event.pageIndex,
      pageSize: $event.pageSize,
    });
  }
}

export interface PaginatedItems<T> {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  items: T[];
}
