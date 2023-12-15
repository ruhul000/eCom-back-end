import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../services/http.service';
import {Constants} from '../../config/constants';
import {Division} from '../../models/Division';
import {LayoutService} from '../services/layout.service';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-divisions',
    templateUrl: './divisions.component.html',
    styleUrls: ['./divisions.component.css']
})
export class DivisionsComponent implements OnInit {

    divisions: Division[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private httpService: HttpService, public notificationsService: NotificationsService) {
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
        this.getDivisions();
    }

    getDivisions() {
        this.httpService.makeRequest(Constants.GET_DIVISIONS, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.divisions = res.data;
                }
            }
        });
    }

    deleteCategory(division: Division) {
        this.httpService.makeRequest(Constants.GET_DIVISIONS + 'delete/' + division._id, Constants.HTTP_POST, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500 || res.status === 400) {
                    this.toastr.error(res.message, 'Error!');
                } else {
                    this.toastr.success(res.message, 'Success!');
                    this.getDivisions();
                }
            }
        });
    }
}
