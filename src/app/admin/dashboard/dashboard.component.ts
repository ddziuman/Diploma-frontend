import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/entity-services/user.service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  sidenavLinks = [
    { link: 'classes', label: 'Classes' },
    { link: 'teachers', label: 'Teachers' },
    { link: 'schedule', label: 'Schedule' },
  ];
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {}

  logOut() {
    this.userService.removeCookieJWT();
    this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
