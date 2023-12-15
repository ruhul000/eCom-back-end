import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {Division} from '../../../models/Division';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-divisions-edit',
    templateUrl: './divisions-edit.component.html',
    styleUrls: ['./divisions-edit.component.css']
})
export class DivisionsEditComponent implements OnInit {

    formGroup: FormGroup;
    division: Division = new Division();

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private formBuilder: FormBuilder,
                private httpService: HttpService, private router: Router, private activatedRouter: ActivatedRoute, public notificationsService: NotificationsService) {
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
        this.activatedRouter.params.subscribe(res => {
            this.division._id = res.id;
        });
    }

    ngOnInit() {
        this.getDivision();
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])]
        });
    }

    getDivision() {
        this.httpService.makeRequest(Constants.GET_DIVISIONS + 'show/' + this.division._id, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.toastr.success('Created successfully.', 'Success!');
                    this.division = success.message;
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            } else {
                this.toastr.error('Please try again.', 'Error!');
            }
        });
    }

    submit() {
        if (this.formGroup.valid) {
            const body = new URLSearchParams();
            body.set('name', this.formGroup.value.name);

            this.httpService.makeRequest(Constants.GET_DIVISIONS + 'update/' + this.division._id, Constants.HTTP_POST, body, (error, success) => {
                if (!error && success) {
                    if (success.status === 200) {
                        localStorage.setItem('message', 'Division successfully updated.');
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
