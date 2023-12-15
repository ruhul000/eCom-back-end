import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {Constants} from '../../../config/constants';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {Order} from '../../../models/Order';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable} from 'rxjs/Observable';
import {ISubscription} from 'rxjs/Subscription';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
    maxSize = 5;
    itemsPerPage = 10;
    totalItems = 0;
    bigCurrentPage = 1;
    orders: Order[];
    notificationModal: { showModal: boolean, receiverUsername: string, receiverUserId: string, message: string, orderId: string, showOrderNotification: boolean, showOrderNotificationDetail: { message: string, createdAt: string, subject: string }[] } = {
        showModal: false,
        receiverUsername: '',
        receiverUserId: '',
        message: '',
        orderId: '',
        showOrderNotification: false,
        showOrderNotificationDetail: []
    };
    private inervalData: ISubscription;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.layoutService.checkIsLogin();
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.orders = [];
        if (!this.layoutService.isLogin) {
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
        this.getOrders(this.bigCurrentPage, this.itemsPerPage);
        this.inervalData = Observable.interval(5000).subscribe(() => {
            if (this.layoutService.isLogin) {
                this.getOrders(this.bigCurrentPage, this.itemsPerPage);
            }

        });
    }

    ngOnDestroy() {
        this.inervalData.unsubscribe();
    }

    pageChanged(event: any): void {
        this.getOrders(event.page, this.itemsPerPage);
    }

    getOrders(page, limit) {
        const body = '?page=' + page.toString() + '&limit=' + limit.toString();
        this.httpService.makeRequest(Constants.GET_ORDER + body, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.orders = res.data;
                    this.totalItems = res.total;
                }
            }
        });
    }

    changeStatus(orderId, event) {
        const body = new URLSearchParams();
        body.set('orderId', orderId);
        body.set('status', event.target.value);
        this.httpService.makeRequest(Constants.ORDER_POST + 'edit/status', Constants.HTTP_POST, body, (err, res) => {
            if (!err && res) {
                if (res.status === 400) {
                    this.toastr.error('Order update unsuccessful.', 'Error!');
                } else {
                    this.toastr.success('Updated successfully.', 'Success!');
                }
            }
        });
    }

    showNotificationModal(order: Order) {
        if (order && order.user_id && order.user_id.name) {
            this.notificationModal.showModal = true;
            this.notificationModal.receiverUserId = order.user_id._id;
            this.notificationModal.orderId = order._id;
            this.notificationModal.receiverUsername = order && order.user_id && order.user_id.name ? order.user_id.name : '';
            this.notificationModal.message = '';
        } else {
            this.toastr.error('Sorry, without username you cannot sent notification.', 'Error!');
        }
    }

    sendNotification() {
        if (this.notificationModal.receiverUserId && this.notificationModal.message) {
            const body = new URLSearchParams();
            body.set('receiver', this.notificationModal.receiverUserId);
            body.set('message', this.notificationModal.message);
            body.set('orderId', this.notificationModal.orderId);
            body.set('subject', 'From Order');
            this.httpService.makeRequest(Constants.NOTIFICATIONS + 'create', Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    this.toastr.success('Notification successfully sent.', 'Success!');
                } else {
                    this.toastr.error('Notification cannot sent.', 'Error!');
                }
            });
        } else {
            this.toastr.error('Problem.', 'Error!');
        }
    }

    showOrderNotification(order: Order) {
        this.notificationModal.showOrderNotification = true;
        // this.notificationModal.showOrderNotificationDetail = order;
        this.httpService.makeRequest(Constants.NOTIFICATIONS + 'detail/' + order._id, Constants.HTTP_GET, {}, (error, response) => {
            if (!error && response && response.status === 200) {
                this.notificationModal.showOrderNotificationDetail = response.data;
            }
        });
    }
}
