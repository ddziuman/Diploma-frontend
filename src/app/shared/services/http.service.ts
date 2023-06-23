import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class HttpService {
  baseUrl: string;
  constructor() {
    this.baseUrl = environment.apiUrl;
  }
}
