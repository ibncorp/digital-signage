import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserService } from '@modules/auth/services';

@Component({
    selector: 'sb-top-nav-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './top-nav-user.component.html',
    styleUrls: ['top-nav-user.component.scss'],
})
export class TopNavUserComponent implements OnInit {

    fullName = '';
    email = '';

    constructor(
        public userService: UserService,
        private authService: AuthService,
        private router: Router
    ) {}
    
    ngOnInit() {
        this.fullName = localStorage.getItem('fullName') ?? '';
        this.email = localStorage.getItem('email') ?? '';
    }

    logout(){
        this.authService.logout();
        this.router.navigate(['auth/login'])
    }
}
