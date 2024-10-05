import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private backendUrl = environment.backendUrl;
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<User> {
        return this._httpClient
            .get<User>(`${this.backendUrl}/api/user`, { withCredentials: true })
            .pipe(
                tap((user) => {
                    this._user.next(user);
                })
            );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient
            .patch<User>(`${this.backendUrl}/profile/update`, user, {
                withCredentials: true,
            })
            .pipe(
                map((response) => {
                    this._user.next(response);
                })
            );
    }

    /**
     * Change Password
     *
     * @param user
     */
    changePwd(obj): Observable<any> {
        return this._httpClient
            .put<User>(`${this.backendUrl}/profile/change-password`, obj, {
                withCredentials: true,
            })
            .pipe(
                map((response) => {
                    this._user.next(response);
                })
            );
    }
}
