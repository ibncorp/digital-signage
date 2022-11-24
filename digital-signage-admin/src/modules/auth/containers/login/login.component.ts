import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router : Router,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {}
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
        });
    }

    login(){
        const data = this.loginForm?.value;

        this.spinner.show();

        this.authService.login(data).subscribe(
            result => {
                this.spinner.hide();
                if(result.error != false){
                    this.toastr.error(result.message);
                }else{
                    localStorage.setItem('isLoggedIn', "true");
                    localStorage.setItem('fullName', result.results.data['fullName']);
                    localStorage.setItem('email', result.results.data['email']);
                    localStorage.setItem('accessToken', result.results.data['accessToken']);
                    this.router.navigate(['dashboard']);
                }
            }
        )

    }
}
