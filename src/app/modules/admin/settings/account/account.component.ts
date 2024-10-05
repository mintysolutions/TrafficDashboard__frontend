import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class SettingsAccountComponent implements OnInit {
    @ViewChild('accountNgForm') accountNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    accountForm: UntypedFormGroup;
    showAlert: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Create the form
        this.accountForm = this._formBuilder.group({
            name: this.user.name,
            email: [this.user.email, Validators.email],
        });
    }

    updateProfile() {
        // Do nothing if the form is invalid
        if (this.accountForm.invalid) {
            return;
        }

        // Disable the form
        this.accountForm.disable();

        // Hide the alert
        this.showAlert = false;

        const entity = {
            id: this.user.id,
            name: this.accountForm.value.name,
            email: this.accountForm.value.email,
        };
        this._userService.update(entity).subscribe(
            (response) => {
                console.log('response :>> ', response);
                // Set the alert
                this.alert = {
                    type: 'success',
                    message: 'Profile updated successfully!',
                };
                this.showAlert = true;
                this.accountForm.enable();
            },
            (response) => {
                console.error(
                    'error',
                    response?.message ?? 'Something went wrong!'
                );
                this.accountForm.enable();
                this.accountNgForm.resetForm();
                this.alert = {
                    type: 'error',
                    message:
                        response?.message ??
                        'Something went wrong, please try again.',
                };
                this.showAlert = true;
            }
        );
    }
}
