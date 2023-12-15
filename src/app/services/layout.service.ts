import {Injectable} from '@angular/core';
import {Constants} from '../../config/constants';
import {HttpService} from './http.service';
import {NotificationsService} from './notifications.service';

@Injectable()
export class LayoutService {
    isLogin: boolean;
    userGroup: string;
    userName: string;
    userEmail: string;
    errorMessage: string;
    message: string;
    constructor(private httpService: HttpService, private notificationsService: NotificationsService) {
        this.isLogin = false;
        this.errorMessage = '';
        this.message = '';
        if (this.isLogin) {
            this.notificationsService.getNotifications();
        }

    }

    public checkIsLogin() {
        if (localStorage.getItem('accessToken')) {
            this.httpService.makeRequest(Constants.PROFILE, Constants.HTTP_GET, {}, (err, res) => {
                if (res.status === 200) {
                    this.isLogin = true;
                    // Profile found
                    if (res && res.message && res.message.scope) {
                        this.userGroup = res.message.scope;
                        this.userName = res.message.name;
                        this.userEmail = res.message.email;
                    }

                } else {
                    this.userGroup = '';
                    this.userName = '';
                    this.userEmail = '';
                    this.isLogin = false;
                }
            });
        } else {
            this.userGroup = '';
            this.userName = '';
            this.userEmail = '';
            this.isLogin = false;
        }
    }
}
