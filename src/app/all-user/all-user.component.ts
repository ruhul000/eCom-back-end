import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../config/constants';
import {LayoutService} from '../services/layout.service';
import {User} from '../../models/User';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-all-user',
    templateUrl: './all-user.component.html',
    styleUrls: ['./all-user.component.css']
})

export class AllUserComponent implements OnInit {

    users: User[] = [];
    maxSize: number;
    itemsPerPage: number;
    totalItems: number;
    bigCurrentPage: number;
    numPages: number;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
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
        this.getUsers(this.bigCurrentPage, this.itemsPerPage);
    }

    getUsers(page, limit) {
        const body = new URLSearchParams();
        body.set('page', page);
        body.set('limit', limit);
        this.httpService.makeRequest(Constants.GET_USER, Constants.HTTP_POST, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.users = res.data;
                    this.totalItems = res.total;
                }
            }
        });
    }

    pageChanged(event: any): void {
        this.getUsers(event.page, this.itemsPerPage);
    }

    activateUser(id) {
        const body = new URLSearchParams();
        body.set('id', id);
        this.httpService.makeRequest(Constants.USER_URL + 'active', Constants.HTTP_POST, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.toastr.success('User successfully activated.', 'Success!');
                    this.getUsers(this.bigCurrentPage, this.itemsPerPage);
                }
            }
        });
    }

    deactivateUser(id) {
        const body = new URLSearchParams();
        body.set('id', id);
        this.httpService.makeRequest(Constants.USER_URL + 'deactivate', Constants.HTTP_POST, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.toastr.success('User successfully deactivated.', 'Success!');
                    this.getUsers(this.bigCurrentPage, this.itemsPerPage);
                }
            }
        });
    }
}
