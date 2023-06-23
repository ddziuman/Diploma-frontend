import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly cookieService: CookieService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.cookieService.get('jwt');
    return next.handle(this.addAuthorizationHeader(request, accessToken));
  }

  private addAuthorizationHeader(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    if (token) {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return request;
  }
}
