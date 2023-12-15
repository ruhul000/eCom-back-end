import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constants} from '../../config/constants';
import {HttpService} from '../services/http.service';
import {LayoutService} from '../services/layout.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../services/settings.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-sites',
    templateUrl: './sites.component.html',
    styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

    imageUrl = Constants.API_ENDPOINT;
    formGroup: FormGroup;
    amazonPhoto: { type: string, base64data: string } = {type: '', base64data: ''};
    aliExpressPhoto: { type: string, base64data: string } = {type: '', base64data: ''};

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private httpService: HttpService, private formBuilder: FormBuilder, public settingsService: SettingsService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (!(this.layoutService.userGroup === 'admin' || this.layoutService.userGroup === 'product_manager')) {
            this.router.navigate(['/']);
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
            phone: ['', Validators.compose([Validators.required])],
            dollarRate: ['', Validators.compose([Validators.required])],
            amazon_text: ['', Validators.compose([Validators.required])],
            ali_express_text: ['', Validators.compose([Validators.required])],
            proHeader1: ['', Validators.compose([Validators.required])],
            proLimit1: ['', Validators.compose([Validators.required])],
            proHeader2: ['', Validators.compose([Validators.required])],
            proLimit2: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required])],
            bdOffice: ['', Validators.compose([Validators.required])],
            chinaOffice: ['', Validators.compose([Validators.required])],
            footerAbout: ['', Validators.compose([Validators.required])]
        });
    }

    amazonPhotoUpload(event) {
        const files = event.target.files;
        if (files) {
            this.amazonPhoto.type = files[0].type;
            const reader = new FileReader();
            reader.onload = this._amazonPhotoUpload.bind(this);
            reader.readAsBinaryString(files[0]);
        }
    }

    _amazonPhotoUpload(readerEvt) {
        const self = this;
        const binaryString = readerEvt.target.result;
        const image = new Image();
        image.onload = function () {
            if (image.width === 600 && image.height === 300) {
                self.amazonPhoto.base64data = 'data:' + self.amazonPhoto.type + ';base64,' + btoa(binaryString);
                const body = new URLSearchParams();
                body.set('amazon_photo', self.amazonPhoto.base64data);
                self.httpService.makeRequest(Constants.SITES + 'update/amazon_photo', Constants.HTTP_POST, body, (err, res) => {
                    if (!err && res) {
                        self.settingsService = res.data;
                        self.settingsService.amazon_photo = res.data.amazon_photo;
                    }
                });
            } else {
                self.toastr.error('Image size doesn\'t match.', 'Error');
            }
        };
        image.src = 'data:' + self.amazonPhoto.type + ';base64,' + btoa(binaryString);
    }

    aliExpressPhotoUpload(event) {
        const files = event.target.files;
        if (files) {
            this.aliExpressPhoto.type = files[0].type;
            const reader = new FileReader();
            reader.onload = this._aliExpressPhotoUpload.bind(this);
            reader.readAsBinaryString(files[0]);
        }
    }

    _aliExpressPhotoUpload(readerEvt) {
        const self = this;
        const binaryString = readerEvt.target.result;

        const image = new Image();
        image.onload = function () {
            if (image.width === 600 && image.height === 300) {
                self.aliExpressPhoto.base64data = 'data:' + self.aliExpressPhoto.type + ';base64,' + btoa(binaryString);
                const body = new URLSearchParams();
                body.set('ali_express_photo', self.aliExpressPhoto.base64data);
                self.httpService.makeRequest(Constants.SITES + 'update/ali_express_photo', Constants.HTTP_POST, body, (err, res) => {
                    if (!err && res) {
                        self.settingsService = res.data;
                        self.settingsService.ali_express_photo = res.data.ali_express_photo;
                    }
                });
            } else {
                self.toastr.error('Image size doesn\'t match.', 'Error');
            }
        };
        image.src = 'data:' + self.aliExpressPhoto.type + ';base64,' + btoa(binaryString);
    }

    submit() {
        if (this.formGroup.valid) {
            const body = new URLSearchParams();
            body.set('phone', this.formGroup.value.phone);
            body.set('dollarRate', this.formGroup.value.dollarRate);
            body.set('amazon_text', this.formGroup.value.amazon_text);
            body.set('ali_express_text', this.formGroup.value.ali_express_text);
            body.set('proHeader1', this.formGroup.value.proHeader1);
            body.set('proLimit1', this.formGroup.value.proLimit1);
            body.set('proHeader2', this.formGroup.value.proHeader2);
            body.set('proLimit2', this.formGroup.value.proLimit2);
            body.set('email', this.formGroup.value.email);
            body.set('bdOffice', this.formGroup.value.bdOffice);
            body.set('chinaOffice', this.formGroup.value.chinaOffice);
            body.set('footerAbout', this.formGroup.value.footerAbout);
            this.httpService.makeRequest(Constants.SITES + 'update/others', Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    this.settingsService = res.data;
                    this.settingsService.phone = res.data.phone;
                    this.settingsService.dollarRate = res.data.dollarRate;
                    this.settingsService.amazon_text = res.data.amazon_text;
                    this.settingsService.ali_express_text = res.data.ali_express_text;
                    this.settingsService.proHeader1 = res.data.proHeader1;
                    this.settingsService.proLimit1 = res.data.proLimit1;
                    this.settingsService.proHeader2 = res.data.proHeader2;
                    this.settingsService.proLimit2 = res.data.proLimit2;
                    this.settingsService.email = res.data.email;
                    this.settingsService.bdOffice = res.data.bdOffice;
                    this.settingsService.chinaOffice = res.data.chinaOffice;
                    this.settingsService.footerAbout = res.data.footerAbout;
                }
            });
        }
    }

}
