import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {Category} from '../../../models/Category';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {SettingsService} from '../../services/settings.service';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    constructor(public settingsService: SettingsService, public toastr: ToastsManager, vcr: ViewContainerRef,
                public layoutService: LayoutService, public httpService: HttpService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
        this.getSettings();
    }

    getSettings() {
        this.httpService.makeRequest(Constants.SITES, Constants.HTTP_GET, {}, (err, res) => {
            this.settingsService = res.data;
        });
    }

    ngOnInit() {
    }


}
