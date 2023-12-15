import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {User} from '../../../models/User';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Division} from '../../../models/Division';
import {District} from '../../../models/District';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

    userPersonalFormGroup: FormGroup;
    validationError: {};
    user: User;
    userId: string;
    divisions: Division[] = [];
    districts: District[] = [];
    showDistricts: District[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute,
                private httpService: HttpService, private formBuilder: FormBuilder, public notificationsService: NotificationsService) {
        this.layoutService.checkIsLogin();
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.user = new User();
        this.activatedRouter.params.subscribe(res => {
            this.userId = res.id;
        });
        this.getDivisions();
        this.getDistricts();
        this.getProfile();
        this.validationError = {};
        this.divisions = [];
        this.districts = [];
        this.showDistricts = [];

        if (layoutService.isLogin) {
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
        this.userPersonalFormGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.compose([Validators.required])],
            division: [''],
            district: [''],
            address_1: [''],
            address_2: [''],
            zip: [''],
            shippingEmail: [''],
            shippingPhone: [''],
            password: [''],
            userGroup: [''],
        });

    }

    getProfile() {
        this.httpService.makeRequest(Constants.PROFILE + this.userId, Constants.HTTP_GET, {}, (err, res) => {
            if (res.status === 200) {
                this.user = res.message;
                if (this.user && this.user.division && this.user.division._id) {
                    this.getDistrictsByDivision(this.user.division._id);
                }
            } else {
                this.toastr.error(res.message, 'Error!');
            }
        });
    }

    getDivisions() {
        this.httpService.makeRequest(Constants.GET_DIVISIONS, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.divisions = success.data;
                    if (this.user && this.user.division && this.user.division._id) {
                        this.getDistrictsByDivision(this.user.division._id);
                    }
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            } else {
                this.toastr.error('Please try again.', 'Error!');
            }
        });
    }

    getDistricts() {
        this.httpService.makeRequest(Constants.GET_DISTRICTS, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.districts = res.message;
                }
            }
        });
    }

    getDistrictsByDivision(event) {
        this.showDistricts = [];
        for (let i = 0; i < this.districts.length; i++) {
            if (this.districts[i].division_id._id === event) {
                this.showDistricts.push(this.districts[i]);
            }
        }
    }

    userPersonalFormSubmit() {
        if (this.userPersonalFormGroup.valid) {
            const body = new URLSearchParams();
            if (this.userPersonalFormGroup.value['name']) {
                body.set('name', this.userPersonalFormGroup.value['name']);
            }
            if (this.userPersonalFormGroup.value['email']) {
                body.set('email', this.userPersonalFormGroup.value['email']);
            }
            if (this.userPersonalFormGroup.value['phone']) {
                body.set('phone', this.userPersonalFormGroup.value['phone']);
            }
            if (this.userPersonalFormGroup.value['division']) {
                body.set('division', this.userPersonalFormGroup.value['division']);
            }
            if (this.userPersonalFormGroup.value['district']) {
                body.set('district', this.userPersonalFormGroup.value['district']);
            }
            if (this.userPersonalFormGroup.value['address_1']) {
                body.set('address_1', this.userPersonalFormGroup.value['address_1']);
            }
            if (this.userPersonalFormGroup.value['address_2']) {
                body.set('address_2', this.userPersonalFormGroup.value['address_2']);
            }
            if (this.userPersonalFormGroup.value['zip']) {
                body.set('zip', this.userPersonalFormGroup.value['zip']);
            }
            if (this.userPersonalFormGroup.value['shippingEmail']) {
                body.set('shippingEmail', this.userPersonalFormGroup.value['shippingEmail']);
            }
            if (this.userPersonalFormGroup.value['shippingPhone']) {
                body.set('shippingPhone', this.userPersonalFormGroup.value['shippingPhone']);
            }
            if (this.userPersonalFormGroup.value['password']) {
                body.set('password', this.userPersonalFormGroup.value['password']);
            }
            if (this.userPersonalFormGroup.value['userGroup']) {
                body.set('userGroup', this.userPersonalFormGroup.value['userGroup']);
            }
            this.httpService.makeRequest(Constants.PROFILE_EDIT + this.userId, Constants.HTTP_POST, body, (err, res) => {
                if (res.status === 200) {
                    this.toastr.success('Updated successfully.', 'Success!');
                } else if (res.status === 205) {
                    this.toastr.error('Please try again.', 'Error!');
                }
            });
        }
    }
}
