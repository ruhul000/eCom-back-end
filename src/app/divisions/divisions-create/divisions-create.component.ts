import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../config/constants';
import {Router} from '@angular/router';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-divisions-create',
    templateUrl: './divisions-create.component.html',
    styleUrls: ['./divisions-create.component.css']
})
export class DivisionsCreateComponent implements OnInit {

    formGroup: FormGroup;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService,
                private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.layoutService.checkIsLogin();
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (layoutService.isLogin) {
            if (this.layoutService.userGroup !== 'admin' && this.layoutService.userGroup !== 'product_manager') {
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
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])]
        });
    }

    submit() {
        if (this.formGroup.valid) {
            const body = new URLSearchParams();
            body.set('name', this.formGroup.value.name);
            // body.set('mother', null);

            this.httpService.makeRequest(Constants.GET_DIVISIONS + 'create', Constants.HTTP_POST, body, (error, success) => {
                if (!error && success) {

                    if (success.status === 200) {
                        localStorage.setItem('message', 'Division successfully created.');
                        this.router.navigate(['/divisions/all']);
                    } else {
                        this.toastr.error('Please try again.', 'Error!');
                    }
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            });
        }
    }

}
