import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountsCamService {
    private _camList: BehaviorSubject<any> = new BehaviorSubject(null);
    private _camStats: BehaviorSubject<any> = new BehaviorSubject(null);
    private _selectedCamStats: BehaviorSubject<any> = new BehaviorSubject(null);
    private backendUrl = environment.backendUrl;

    constructor(private _httpClient: HttpClient) {}

    get camList$(): Observable<any> {
        return this._camList.asObservable();
    }

    get camStats$(): Observable<any> {
        return this._camStats.asObservable();
    }

    get selectedCamStats$(): Observable<any> {
        return this._selectedCamStats.asObservable();
    }


    getCamList(): Observable<any> {
        return this._httpClient.get(`${this.backendUrl}/api/count_cam`).pipe(
            tap((response: any) => {
                this._camList.next(response);
            })
        );
    }

    getCamStats(camId: number, start?: string, end?: string): Observable<any> {
        let url = `${this.backendUrl}/api/count_cam/${camId}/stats`;
        if (start && end) {
            url += `?start=${start}&end=${end}`;
        }
        return this._httpClient.get(url).pipe(
            tap((response) => {
                this._selectedCamStats.next(response);
            })
        );
    }
}
