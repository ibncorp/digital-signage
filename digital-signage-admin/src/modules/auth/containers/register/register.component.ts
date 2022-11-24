import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '@app/providers/custom-validators';
import { AuthService } from '@modules/auth/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-register',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './register.component.html',
    styleUrls: ['register.component.scss'],
})
export class RegisterComponent implements OnInit {

    registForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router : Router,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit() {
        this.registForm = this.formBuilder.group(
            {
                username: new FormControl('', [Validators.required]),
                firstname: new FormControl('', [Validators.required]),
                lastname: new FormControl('', [Validators.required]),
                email: new FormControl('', [Validators.required, Validators.email]),
                password: new FormControl('', [Validators.required, Validators.minLength(8)]),
                confirmPassword: new FormControl('', [Validators.required]),
            },{
                validators: CustomValidators.MatchValidator('password', 'confirmPassword')
            }
        );
    }

    register(){
        const data = this.registForm?.value;
        
        this.spinner.show();
        this.authService.register(data).subscribe(
            result => {
                this.spinner.hide();
                if(result.error != false){
                    this.toastr.error(result.message);
                }else{
                    this.router.navigate(['auth/login']);
                }
            }
        )
    }
}
