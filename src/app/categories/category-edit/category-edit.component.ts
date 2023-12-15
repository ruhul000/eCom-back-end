import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../config/constants';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../../models/Category';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {

    formGroup: FormGroup;
    category: Category = new Category();

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, private activatedRouter: ActivatedRoute, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.layoutService.checkIsLogin();
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.activatedRouter.params.subscribe(res => {
            this.category._id = res.id;
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
        this.getCategory();
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])]
        });
    }

    getCategory() {
        this.httpService.makeRequest(Constants.GET_CATEGORY + 'show/' + this.category._id, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.toastr.success('Created successfully.', 'Success!');
                    this.category = success.message;
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

            this.httpService.makeRequest(Constants.GET_CATEGORY + 'update/' + this.category._id, Constants.HTTP_POST, body, (error, success) => {
                if (!error && success) {
                    if (success.status === 200) {
                        this.toastr.success('Created successfully.', 'Success!');
                        this.router.navigate(['/categories/all']);
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
