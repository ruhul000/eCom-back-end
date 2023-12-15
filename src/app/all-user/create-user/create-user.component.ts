import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

    login: FormGroup;
    createUser: FormGroup;
    pass: string;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router,
                private activatedRouter: ActivatedRoute, private httpService: HttpService, private fb: FormBuilder, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.layoutService.checkIsLogin();
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (this.layoutService.isLogin) {
            if (this.layoutService.userGroup !== 'admin') {
                this.router.navigate(['/']);
            }
        } else {
            this.router.navigate(['/user/login']);
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
        this.createUser = this.fb.group({
            name: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.compose([Validators.required])],
            userGroup: [''],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        });
    }

    createUserSubmit() {
        if (this.createUser.valid) {
            const body = new URLSearchParams();
            body.set('name', this.createUser.value.name);
            body.set('email', this.createUser.value.email);
            body.set('phone', this.createUser.value.phone);
            body.set('password', this.createUser.value.password);
            body.set('group', this.createUser.value.userGroup);
            this.httpService.makeRequest(Constants.USER_CREATE, Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 404 || res.status === 500) {
                        this.toastr.error(res.messages, 'Error!');
                    } else {
                        localStorage.setItem('message', 'User successfully created.');
                        this.router.navigate(['/user/all']);
                    }
                }
            });
        }
    }
}
