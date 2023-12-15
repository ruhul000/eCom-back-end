import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {Division} from '../../../models/Division';
import {District} from '../../../models/District';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-districts-edit',
    templateUrl: './districts-edit.component.html',
    styleUrls: ['./districts-edit.component.css']
})
export class DistrictsEditComponent implements OnInit {

    formGroup: FormGroup;
    divisions: Division[] = [];
    district: District = new District();
    id: String;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private formBuilder: FormBuilder,
                private httpService: HttpService, private router: Router, private activatedRouter: ActivatedRoute, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.layoutService.checkIsLogin();
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.id = '';
        this.activatedRouter.params.subscribe(res => {
            this.id = res.id;
        });
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
        this.getDistrict();
        this.getAllDivision();
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            division_id: ['', Validators.compose([Validators.required])]
        });
    }

    getAllDivision() {
        this.httpService.makeRequest(Constants.GET_DIVISIONS, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.divisions = success.data;
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            } else {
                this.toastr.error('Please try again.', 'Error!');
            }
        });
    }

    getDistrict() {
        this.httpService.makeRequest(Constants.GET_DISTRICTS + 'show/' + this.id, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.district = success.message;
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
            body.set('division_id', this.formGroup.value.division_id);

            this.httpService.makeRequest(Constants.GET_DISTRICTS + 'update/' + this.id, Constants.HTTP_POST, body, (error, success) => {
                if (!error && success) {
                    if (success.status === 200) {
                        localStorage.setItem('message', 'Updated successfull.');
                        this.router.navigate(['/districts/all']);
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
