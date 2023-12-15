import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../config/constants';
import {Product} from '../../models/Product';
import {LayoutService} from '../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-all-product',
    templateUrl: './all-product.component.html',
    styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {

    products: Product[] = [];
    maxSize: number;
    itemsPerPage: number;
    totalItems: number;
    bigCurrentPage: number;
    numPages: number;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router,
                private activatedRouter: ActivatedRoute, public httpService: HttpService,
                private layoutService: LayoutService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.layoutService.checkIsLogin();
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.maxSize = 5;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.bigCurrentPage = 1;
        this.numPages = 0;
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
        this.getProducts(this.bigCurrentPage, this.itemsPerPage);
    }

    pageChanged(event: any): void {
        this.getProducts(event.page, this.itemsPerPage);
    }

    getProducts(page, limit) {
        const body = new URLSearchParams();
        body.set('page', page);
        body.set('limit', limit);
        this.httpService.makeRequest(Constants.GET_PRODUCT + 'all', Constants.HTTP_POST, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    return this.toastr.error(res.messages, 'Error!');
                } else {
                    this.products = res.data;
                    this.totalItems = res.total;
                }
            }
        });
    }

    deleteProduct(id) {
        const body = new URLSearchParams();
        this.httpService.makeRequest(Constants.GET_PRODUCT + id, Constants.HTTP_DELETE, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    return this.toastr.error(res.messages, 'Error!');
                } else {
                    this.getProducts(this.bigCurrentPage, this.itemsPerPage);
                    return this.toastr.success(res.message, 'Success!');
                }
            }
        });
    }
}
