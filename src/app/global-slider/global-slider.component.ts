import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constants} from '../../config/constants';
import {LayoutService} from '../services/layout.service';
import {Slider} from '../../models/Slider';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../services/http.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-global-slider',
    templateUrl: './global-slider.component.html',
    styleUrls: ['./global-slider.component.css']
})
export class GlobalSliderComponent implements OnInit {

    sliders: Slider[] = [];
    imageUrl = Constants.API_ENDPOINT;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
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
        this.getSliders();
    }

    getSliders() {
        this.httpService.makeRequest(Constants.GET_GLOBAL_SLIDERS, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.sliders = res.data;
                }
            }
        });
    }

    deleteSlider(id) {
        const body = new URLSearchParams();
        this.httpService.makeRequest(Constants.GET_GLOBAL_SLIDERS + 'delete/' + id, Constants.HTTP_POST, body, (err, res) => {
            if (!err && res) {
                if (res.status === 200) {
                    this.toastr.success('Deleted successfully.', 'Success!');
                    this.getSliders();
                } else {
                    this.toastr.error(res.messages, 'Error!');
                }
            }
        });
    }

}
