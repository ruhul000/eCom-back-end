import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../../config/constants';
import {Router} from '@angular/router';
import {Category} from '../../../../models/Category';
import {LayoutService} from '../../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../../services/notifications.service';

@Component({
    selector: 'app-sub-category-create',
    templateUrl: './sub-category-create.component.html',
    styleUrls: ['./sub-category-create.component.css']
})
export class SubCategoryCreateComponent implements OnInit {

    formGroup: FormGroup;
    categories: Category[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, public notificationsService: NotificationsService) {
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
            category_id: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])]
        });
        this.getCategories();
    }

    getCategories() {
        this.httpService.makeRequest(Constants.GET_CATEGORY, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.toastr.success('Created successfully.', 'Success!');
                    this.categories = success.data;
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
            body.set('category_id', this.formGroup.value.category_id);
            body.set('name', this.formGroup.value.name);

            this.httpService.makeRequest(Constants.GET_SUB_CATEGORIES + 'create', Constants.HTTP_POST, body, (error, success) => {
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
