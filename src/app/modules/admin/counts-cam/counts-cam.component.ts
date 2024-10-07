import { CommonModule, CurrencyPipe, NgClass, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { CameraListService } from 'app/layout/common/cam-list/cam-list.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-counts-cam',
    templateUrl: './counts-cam.component.html',
    styleUrl: './counts-cam.component.scss',
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
        MatFormFieldModule, // Import this for <mat-form-field>
        MatInputModule, // Import this for <mat-input>
        MatButtonModule, // Import this for buttons
        MatDatepickerModule, // Import this for date pickers
        MatNativeDateModule,
    ],
})
export class CountsCamComponent {
    user: User;
    data: any;
    dateRangeForm: FormGroup;

    chartScenarioPeaks: any = {};

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _changeDetectorRef = inject(ChangeDetectorRef);

    constructor(
        private _userService: UserService,
        private _camService: CameraListService,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to the camera list and update the dataSource
        //  this._camService.camList$
        //  .pipe(takeUntil(this._unsubscribeAll))
        //  .subscribe((data) => {
        //      this.dataSource.data = data;
        //      this._changeDetectorRef.detectChanges();
        //  });

        // Subscribe to the selected camera ID changes and trigger the fetch function
        this._camService.camId$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((camId) => {
                if (camId) {
                    this.fetchCameraData();
                }
            });

        // Initialize the date range form
        this.dateRangeForm = this._formBuilder.group({
            start: [''],
            end: [''],
        });

        // Trigger the camera list fetch
        this._camService.getCamList().subscribe();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    fetchCameraData(): void {
        const start = this.dateRangeForm.get('start')?.value;
        const end = this.dateRangeForm.get('end')?.value;

        // Fetch selectedCamCounts and update the UI immediately upon success
        this._camService
            .getCountCameraStats(start, end)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    console.log('fetchCameraData :>> ', response);
                    this.data = response;
                    this._prepareChartData();
                    this._changeDetectorRef.detectChanges();
                },
                error: (err) =>
                    console.error(
                        'Error fetching detail selectedCamCounts',
                        err
                    ),
            });
    }

    filterByDateRange(): void {
        this.fetchCameraData();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _prepareChartData(): void {
        let labels: { [key: string]: string[] } = {};
        let series: { [key: string]: object[] } = {};
        let scenarios: string[] = [];

        this.data.time_peaks.forEach((scenarioData) => {
            const scenarioName = scenarioData.scenario;
            scenarios.push(scenarioName);
            labels[scenarioName] = Object.keys(scenarioData.peaks);
            series[scenarioName] = [
                {
                    name: 'Time Peaks',
                    type: 'column',
                    data: Object.values(scenarioData.peaks),
                },
            ];
        });
        console.log('_prepareChartData :>> ', labels);
        console.log('_prepareChartData :>> ', series);
        this.chartScenarioPeaks = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: labels,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };
    }
}
