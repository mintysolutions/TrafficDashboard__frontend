import { CommonModule, CurrencyPipe, NgClass, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { CameraListService } from 'app/layout/common/cam-list/cam-list.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-height-cam',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatTableModule,
        NgIf,
        NgClass,
        ReactiveFormsModule,
        CurrencyPipe,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    templateUrl: './height-cam.component.html',
    styleUrl: './height-cam.component.scss',
})
export class HeightCamComponent {
    user: User;
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = [
        'id',
        'cam_name',
        'cam_ip',
        'detect_time',
        'height',
        'plate',
        'plate_size',
        'plate_sharp',
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _changeDetectorRef = inject(ChangeDetectorRef);

    constructor(
        private _userService: UserService,
        private _camService: CameraListService,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
        this._camService.camId$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((camId) => {
                if (camId) {
                    this.fetchCameraData();
                }
            });
        this._camService.getCamList('height').subscribe();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    fetchCameraData(): void {
        this._camService
            .getHeightTrafficbyCamId()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response;
                },
                error: (error) => console.error(error),
            });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
