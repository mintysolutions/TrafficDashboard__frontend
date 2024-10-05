import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
    HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const csrfExtractor = inject(HttpXsrfTokenExtractor);
    const csrfToken = csrfExtractor.getToken()?.toString() || '';

    // console.log('req.method :>> ', req.method);
    // console.log('req.headers :>> ', req.headers);
    // console.log('csrfToken :>> ', csrfToken);
    const authReq = req.clone({
        withCredentials: true, // Ensures cookies are sent with the request
        headers: req.headers
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('X-XSRF-TOKEN', csrfToken),
    });

    return next(authReq).pipe(
        catchError((error: any) => {
            // If we receive a 401 Unauthorized response, logout the user
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.signOut();
                // location.reload();
            }
            return throwError(() => error);
        })
    );
};
