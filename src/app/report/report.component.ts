import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constants} from '../../config/constants';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../services/http.service';
import {Order} from '../../models/Order';
import {LayoutService} from '../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    bsValue = new Date();
    bsRangeValue: Date[];
    maxDate = new Date();
    orders: Order[];
    formGroup: FormGroup;
    grandTotal: number;
    status: string;

    constructor(private formBuilder: FormBuilder, public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        this.bsRangeValue = [this.bsValue, this.maxDate];
        this.status = 'All';
        this.layoutService.checkIsLogin();
        this.grandTotal = -1;
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
        this.formGroup = this.formBuilder.group({
            bsRangeValue: ['', Validators.compose([Validators.required])],
            status: ['', Validators.compose([Validators.required])]
        });
    }

    formSubmit() {
        if (this.formGroup.valid) {
            const body = new URLSearchParams();
            body.set('time', this.formGroup.value.bsRangeValue);
            body.set('orderStatus', this.formGroup.value.status);
            this.httpService.makeRequest(Constants.ORDER_POST + 'report', Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 404 || res.status === 500) {
                        this.toastr.error(res.messages, 'Error!');
                    } else {
                        this.orders = res.data;
                        this.grandTotal = res.total;
                    }
                }
            });
        }
    }
    printData() {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <link rel="stylesheet" href="assets/css/font-awesome/css/font-awesome.css">
        <!--<link rel="stylesheet" href="assets/css/bootstrap.min.css">-->
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="assets/js/vendors/isotope/isotope.css">
        <link rel="stylesheet" href="assets/js/vendors/slick/slick.css">
        <link rel="stylesheet" href="assets/js/vendors/rs-plugin/css/settings.css">
        <link rel="stylesheet" href="assets/js/vendors/select/jquery.selectBoxIt.css">
        <link rel="stylesheet" href="assets/css/subscribe-better.css">
        <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/jquery-ui.css">
        <link rel="stylesheet" href="assets/plugin/owl-carousel/owl.carousel.css">
        <link rel="stylesheet" href="assets/plugin/owl-carousel/owl.theme.css">
        <link rel="stylesheet" href="assets/css/style.css">
        <style>
        img{
        max-height: 50px;
        max-width: 50px;
        }
</style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();
    }
}
