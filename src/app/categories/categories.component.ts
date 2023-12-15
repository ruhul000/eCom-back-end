import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Category} from '../../models/Category';
import {Constants} from '../../config/constants';
import {HttpService} from '../services/http.service';
import {LayoutService} from '../services/layout.service';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    categories: Category[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public router: Router, public layoutService: LayoutService, private httpService: HttpService, public notificationsService: NotificationsService) {
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
        this.getCategories();
    }

    getCategories() {
        this.httpService.makeRequest(Constants.GET_CATEGORY, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.categories = res.data;
                }
            }
        });
    }

    deleteCategory(category: Category) {
        this.httpService.makeRequest(Constants.GET_CATEGORY + 'delete/' + category._id, Constants.HTTP_POST, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500 || res.status === 400) {
                    this.toastr.error(res.message, 'Error!');
                } else {
                    this.toastr.success(res.message, 'Success!');
                    this.getCategories();
                }
            }
        });
    }
}
