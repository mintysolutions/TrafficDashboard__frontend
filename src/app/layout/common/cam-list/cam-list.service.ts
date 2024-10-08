import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Camera } from './cam-list.types';

@Injectable({ providedIn: 'root' })
export class CameraListService {
    private backendUrl = environment.backendUrl;
    private _camId: BehaviorSubject<string> = new BehaviorSubject(null);
    private _camList: BehaviorSubject<Camera[]> = new BehaviorSubject<Camera[]>(
        null
    );

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get camList$(): Observable<Camera[]> {
        return this._camList.asObservable();
    }

    get camId$(): Observable<string> {
        return this._camId.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getCamList(cam_type: string = 'count'): Observable<any> {
        return this._httpClient
            .get(`${this.backendUrl}/api/${cam_type}_cam`)
            .pipe(
                tap((response: Camera[]) => {
                    console.log('getCamList :>> ', response);
                    this._camList.next(response);
                    if (response.length > 0) {
                        this._camId.next(response[0].id);
                    }
                })
            );
    }

    selectCam(id: string) {
        this._camId.next(id);
    }

    getCountCameraStats(start?: Date, end?: Date): Observable<any> {
        console.log('this._camId :>> ', this._camId.value);
        let url = `${this.backendUrl}/api/count_cam/${this._camId.value}/stats`;
        if (start && end) {
            const formattedStartDate = start.toISOString().split('T')[0]; // '2024-10-01'
            const formattedEndDate = end.toISOString().split('T')[0]; // '2024-10-07'
            url += `?start=${formattedStartDate}&end=${formattedEndDate}`;
        }
        return this._httpClient.get(url).pipe(tap((response) => {}));
    }

    getSpeedTrafficbyCamId(): Observable<any> {
        let url = `${this.backendUrl}/api/speedtraffic/?cam_id=${this._camId.value}`;
        return this._httpClient.get(url).pipe(
            tap((response) => {
                console.log('getSpeedTrafficbyCamId :>> ', response);
            })
        );
    }

    getHeightTrafficbyCamId(): Observable<any> {
        let url = `${this.backendUrl}/api/heighttraffic/?cam_id=${this._camId.value}`;
        return this._httpClient.get(url).pipe(
            tap((response) => {
                console.log('getHeightTrafficbyCamId :>> ', response);
            })
        );
    }
}
