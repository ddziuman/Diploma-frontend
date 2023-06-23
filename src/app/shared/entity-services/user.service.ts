import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from 'src/app/api-config';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { CookieService } from 'ngx-cookie-service';
import { ItemExist } from '../interfaces/be-interfaces';
import { SchoolAccountDto } from '../interfaces/school-account.interface';
import jwtDecode from 'jwt-decode';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserService {
  private readonly baseUserURL = `${API_BASE_URL}/users`;

  user$: BehaviorSubject<CurrentUser & any> = new BehaviorSubject(null);
  constructor(private http: HttpClient, private cookieService: CookieService) {
    let jwt = this.cookieService.get('jwt');
    if (jwt) {
      this.user$.next((jwtDecode(jwt) as { user: CurrentUser }).user);
    }
  }

  create(schoolAccountDto: SchoolAccountDto): Observable<User> {
    const url = this.baseUserURL + `/create`;
    return this.http.post<User>(url, schoolAccountDto);
  }

  getUserByEmail(email: string): Observable<User> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<User>(`${this.baseUserURL}/${encodedEmail}`);
  }

  isUserExist(email: string): Observable<ItemExist> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<ItemExist>(
      `${this.baseUserURL}/exist/${encodedEmail}`
    );
  }

  login(user: User): Observable<{ JWT: string }> {
    return this.http
      .post<{ JWT: string }>(`${this.baseUserURL}/login`, user, {
        observe: 'body',
      })
      .pipe(
        tap(({ JWT }) => {
          this.user$.next((jwtDecode(JWT) as { user: CurrentUser }).user);
          this.removeCookieJWT();
          this.setCookieJWT(JWT);
        })
      );
  }
  removeCookieJWT(): void {
    this.cookieService.delete('jwt');
  }
  private setCookieJWT(jwt: string): void {
    this.cookieService.set('jwt', jwt);
  }
}

export interface CurrentUser {
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
