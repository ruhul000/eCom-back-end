import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../../../models/Category';
import {Constants} from '../../../../config/constants';
import {SubCategory} from '../../../../models/SubCategory';
import {LayoutService} from '../../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../../services/notifications.service';

@Component({
    selector: 'app-sub-category-edit',
    templateUrl: './sub-category-edit.component.html',
    styleUrls: ['./sub-category-edit.component.css']
})
export class SubCategoryEditComponent implements OnInit {

    formGroup: FormGroup;
    categories: Category[] = [];
    subCategory: SubCategory = new SubCategory();
    id: String;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, private activatedRouter: ActivatedRoute, public notificationsService: NotificationsService) {
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
        this.getSubCategory();
        this.getAllCategory();
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            category_id: ['', Validators.compose([Validators.required])]
        });
    }

    getAllCategory() {
        this.httpService.makeRequest(Constants.GET_CATEGORY, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.categories = success.data;
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            } else {
                this.toastr.error('Please try again.', 'Error!');
            }
        });
    }

    getSubCategory() {
        this.httpService.makeRequest(Constants.GET_SUB_CATEGORIES + 'show/' + this.id, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.subCategory = success.message;
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
            body.set('category_id', this.formGroup.value.category_id);

            this.httpService.makeRequest(Constants.GET_SUB_CATEGORIES + 'update/' + this.id, Constants.HTTP_POST, body, (error, success) => {
                if (!error && success) {
                    if (success.status === 200) {
                        this.toastr.success('Created successfully.', 'Success!');
                        this.router.navigate(['/sub-categories/all']);
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
