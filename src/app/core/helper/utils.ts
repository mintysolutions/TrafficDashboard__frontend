import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export const formatLaravelErrorMessages = (errors: any): string => {
    let messages: string[] = [];
    for (const field in errors) {
        if (errors.hasOwnProperty(field)) {
            messages = messages.concat(errors[field]);
        }
    }
    return messages.join(' ');
};

export const handleErrorResponse = (
    error: HttpErrorResponse
): Observable<any> => {
    let errorMessage = 'Something went wrong!';
    console.log('handleErrorResponse :>> ', error);

    if (error.status === 422 && error?.error?.errors) {
        // Laravel validation error (422)
        errorMessage = formatLaravelErrorMessages(error?.error?.errors);
    } else if (error?.error?.message) {
        // General error message from the backend
        errorMessage = error?.error?.message;
    } else if (error.status === 500) {
        // Internal server error
        errorMessage = 'Internal server error. Please try again later.';
    } else if (error.status === 401) {
        // Unauthorized error
        errorMessage = 'You are not authorized to perform this action.';
    } else if (error.status === 404) {
        // Not found error
        errorMessage = 'Requested resource was not found.';
    }
    // You can handle other status codes as necessary
    return throwError(() => new Error(errorMessage));
};
