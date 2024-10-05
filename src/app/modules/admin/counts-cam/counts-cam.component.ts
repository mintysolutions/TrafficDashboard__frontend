import { CommonModule, CurrencyPipe, NgClass, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewChild,
    ViewEncapsulation,
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { CountsCamService } from 'app/modules/admin/counts-cam/counts-cam.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
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
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['id', 'cam_ip', 'cam_name', 'code'];
    selectedRow: any = null;
    selectedCamCounts: any = null;
    camCounts: any = null;
    peaks: any = null;
    dateRangeForm: FormGroup;

    chartAllCameraCounts: ApexOptions = {};
    chartScenarioTotalCounts: ApexOptions = {};

    @ViewChild(MatPaginator) paginator: MatPaginator;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _countsCamService: CountsCamService,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
        // Get the data
        this._countsCamService.camList$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.dataSource.data = data;
            });

        // Initialize date range form
        this.dateRangeForm = this._formBuilder.group({
            start: [''],
            end: [''],
        });
    }

    ngAfterViewInit(): void {
        // Set the paginator after the view has been initialized
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    selectRow(row: any): void {
        if (this.selectedRow?.id !== row.id) {
            this.selectedRow = row;
            this.fetchCountsData();
            this.fetchAllCameraCounts();
        }
    }

    fetchAllCameraCounts(): void {
        const start = this.dateRangeForm.get('start')?.value;
        const end = this.dateRangeForm.get('end')?.value;

        // Fetch selectedCamCounts and update the UI immediately upon success
        this._countsCamService
            .getAllCamStats(start, end)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (camCounts) => {
                    console.log('camCounts :>> ', camCounts);
                    this.camCounts = camCounts;
                    this._prepareChartData();
                },
                error: (err) =>
                    console.error(
                        'Error fetching detail selectedCamCounts',
                        err
                    ),
            });
    }

    fetchCountsData(): void {
        if (!this.selectedRow) {
            return;
        }

        const start = this.dateRangeForm.get('start')?.value;
        const end = this.dateRangeForm.get('end')?.value;

        // Fetch selectedCamCounts and update the UI immediately upon success
        this._countsCamService
            .getCamStats(this.selectedRow.id, start, end)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (selectedCamCounts) => {
                    console.log('selectedCamCounts :>> ', selectedCamCounts);
                    this.selectedCamCounts = selectedCamCounts;
                },
                error: (err) =>
                    console.error(
                        'Error fetching detail selectedCamCounts',
                        err
                    ),
            });
    }

    // Filter data based on date range
    filterByDateRange(): void {
        this.fetchCountsData();
        this.fetchAllCameraCounts();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _prepareChartData(): void {
        const allCameraCountsLabels = this.camCounts.map(
            (obj) => obj.camera_ip
        );
        const allCameraCountsSeries = [
            {
                name: 'Total Objects',
                type: 'line',
                data: this.camCounts.map((obj) => obj.total_objects),
            },
        ];
        this.chartAllCameraCounts = {
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
            labels: allCameraCountsLabels,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: allCameraCountsSeries,
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
