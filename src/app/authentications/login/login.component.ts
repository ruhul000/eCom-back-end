import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';
import {Observable} from 'rxjs/Observable';
import {ISubscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    login: FormGroup;
    register: FormGroup;
    pass: string;
    validationError: { name: boolean, email: boolean, phone: boolean, password: boolean } = {
        name: false,
        email: false,
        phone: false,
        password: false
    };
    private inervalData: ISubscription;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router,
                private activatedRouter: ActivatedRoute, private httpService: HttpService, private fb: FormBuilder,
                private notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.layoutService.checkIsLogin();
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
            this.router.navigate(['/']);
        }
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
    }

    ngOnInit() {
        this.login = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
        });
        this.register = this.fb.group({
            name: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            confirmPassword: ['']
        });
        console.log('islogin', this.layoutService.isLogin);
        this.inervalData = Observable.interval(1000).subscribe(() => {
            if (this.layoutService.isLogin) {
                this.router.navigate(['']);
            }
        });
    }

    ngOnDestroy() {
        this.inervalData.unsubscribe();
    }

    loginSubmit() {
        if (this.login.valid) {
            const body = new URLSearchParams();
            body.set('email', this.login.value.email);
            body.set('password', this.login.value.password);
            this.httpService.makeRequest(Constants.USER_LOGIN, Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 200) {
                        if (this.layoutService.isLogin) {
                            this.notificationsService.getNotifications();
                        }
                        localStorage.setItem('accessToken', res.token);
                        localStorage.setItem('message', 'Login successful.');
                        this.layoutService.isLogin = true;
                        this.layoutService.userGroup = res.group;
                        this.layoutService.userName = res.name;
                        this.layoutService.userEmail = res.email;
                        if (localStorage.getItem('redirectUrl')) {
                            this.router.navigate([localStorage.getItem('redirectUrl')]);
                        } else {
                            this.router.navigate(['/']);
                        }
                        localStorage.removeItem('redirectUrl');
                    } else if (res.status === 201) {
                        this.toastr.error(res.message, 'Error!');
                    }
                }
            });
        }
    }
}
