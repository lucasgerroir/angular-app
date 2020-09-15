import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router){}

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/account']);
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  signup(email: string, password: string) {
    return this.http
    .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
    {
      email,
      password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn);
      })
    );
  }

  login(email: string, password: string) {
    return this.http
    .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
    {
      email,
      password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError),
    tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn);
    }));
  }

  autoLogin() {

    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration);
    }

  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() =>{
      this.logout();
    }, expirationDuration);
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'Unknown error has occured';

    if(!err.error || !err.error.error) {
      return throwError(errorMessage);
    }

    switch(err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This is a invalid email.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This is a invalid password.';
        break;
    }

    return throwError(errorMessage);
  }


  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

    const expirationDate  = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate );

      this.autoLogout(expiresIn * 1000);
      this.user.next(user);
      localStorage.setItem("userData", JSON.stringify(user));
  }
}
