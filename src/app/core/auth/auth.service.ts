import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { handleErrorResponse } from '../helper/utils';
import { User } from '../user/user.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private backendUrl = environment.backendUrl;
    private _authenticated: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Initialize CSRF Token
     */
    private initializeCsrf(): Observable<any> {
        return this._httpClient.get(`${this.backendUrl}/sanctum/csrf-cookie`, {
            withCredentials: true,
        });
    }

    /**
     * Register a new user
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Observable<any> {
        return this.initializeCsrf().pipe(
            switchMap(() =>
                this._httpClient.post(`${this.backendUrl}/register`, user)
            ),
            switchMap(() => this.getUser()),
            catchError(handleErrorResponse)
        );
    }

    /**
     * Login user
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        return this.initializeCsrf().pipe(
            switchMap(() =>
                this._httpClient.post(`${this.backendUrl}/login`, credentials, {
                    withCredentials: true,
                })
            ),
            switchMap(() => this.getUser()),
            catchError(handleErrorResponse)
        );
    }

    /**
     * Logout user
     */
    signOut(): Observable<any> {
        return this._httpClient
            .post(`${this.backendUrl}/logout`, {}, { withCredentials: true })
            .pipe(
                switchMap(() => {
                    this._authenticated = false;
                    this._userService.user = null;
                    return of(true);
                }),
                catchError(handleErrorResponse)
            );
    }

    /**
     * Fetch authenticated user
     */
    getUser(): Observable<any> {
        return this._httpClient
            .get(`${this.backendUrl}/api/user`, { withCredentials: true })
            .pipe(
                switchMap((user: User) => {
                    console.log('getUser', user);
                    this._authenticated = true;
                    this._userService.user = user;
                    return of(user);
                }),
                catchError((error) => {
                    this._authenticated = false;
                    this._userService.user = null;
                    return throwError(() => error);
                })
            );
    }

    /**
     * Forgot Password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this.initializeCsrf().pipe(
            switchMap(() =>
                this._httpClient.post(
                    `${this.backendUrl}/forgot-password`,
                    { email },
                    { withCredentials: true }
                )
            ),
            catchError((error) => throwError(() => error))
        );
    }

    /**
     * Reset Password
     *
     * @param data
     */
    resetPassword(data: {
        token: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Observable<any> {
        return this.initializeCsrf().pipe(
            switchMap(() =>
                this._httpClient.post(
                    `${this.backendUrl}/reset-password`,
                    data,
                    { withCredentials: true }
                )
            ),
            catchError((error) => throwError(() => error))
        );
    }

    /**
     * Resend Email Verification
     */
    resendEmailVerification(): Observable<any> {
        return this.initializeCsrf().pipe(
            switchMap(() =>
                this._httpClient.post(
                    `${this.backendUrl}/email/verification-notification`,
                    {},
                    { withCredentials: true }
                )
            ),
            catchError((error) => throwError(() => error))
        );
    }

    /**
     * Check authentication status
     */
    check(): Observable<boolean> {
        return this.getUser().pipe(
            switchMap(() => of(true)),
            catchError(() => of(false))
        );
    }
}
