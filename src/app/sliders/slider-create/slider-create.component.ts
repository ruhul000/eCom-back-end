import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-slider-create',
    templateUrl: './slider-create.component.html',
    styleUrls: ['./slider-create.component.css']
})
export class SliderCreateComponent implements OnInit {

    productImage: {}[] = [];
    productImageType: {}[] = [];
    counter: number;
    categories: {};

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
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
        this.counter = 0;
    }

    ngOnInit() {
    }

    imageUpLoad(event) {
        const files = event.target.files;
        for (const file of files) {
            if (file) {
                this.productImageType.push(file.type);
                const reader = new FileReader();
                reader.onload = this._handleReaderLoaded.bind(this);
                reader.readAsBinaryString(file);
            }
        }
    }

    _handleReaderLoaded(readerEvt) {
        const self = this;
        const binaryString = readerEvt.target.result;
        const base64name = 'data:' + self.productImageType[this.counter++] + ';base64,' + btoa(binaryString);
        const image = new Image();
        image.onload = function () {
            if (image.width === 1200 && image.height === 350) {
                self.productImage.push(base64name);
            } else {
                self.toastr.error('Image size doesn\'t match.', 'Error');
            }
        };
        image.src = base64name;
    }

    sliderSubmit() {
        if (JSON.stringify(this.productImage)) {
            const body = new URLSearchParams();
            body.set('image', JSON.stringify(this.productImage));
            this.httpService.makeRequest(Constants.GET_SLIDERS + 'create', Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 404 || res.status === 500) {
                        this.toastr.error(res.message, 'Error!');
                    } else {
                        localStorage.setItem('message', 'Slider Successfully Created');
                        if (localStorage.getItem('redirectUrl')) {
                            this.router.navigate([localStorage.getItem('redirectUrl')]);
                        } else {
                            this.router.navigate(['/sliders/all']);
                        }

                        localStorage.removeItem('redirectUrl');
                    }
                }
            });
        } else {
            this.toastr.error('File not Selected.', 'Error!');
        }
    }

}
