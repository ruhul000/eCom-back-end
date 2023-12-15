import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../config/constants';
import {Router} from '@angular/router';
import {Division} from '../../../models/Division';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-districts-create',
    templateUrl: './districts-create.component.html',
    styleUrls: ['./districts-create.component.css']
})
export class DistrictsCreateComponent implements OnInit {

    formGroup: FormGroup;
    divisions: Division[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, public notificationsService: NotificationsService) {
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
        this.formGroup = this.formBuilder.group({
            division_id: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])]
        });
        this.getCategories();
    }

    getCategories() {
        this.httpService.makeRequest(Constants.GET_DIVISIONS, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.toastr.success('Created successfully.', 'Success!');
                    this.divisions = success.data;
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            } else {
                this.toastr.error('Please try again.', 'Error!');
            }
        });
    }

    submit() {
        if (this.formGroup.valid) {
            const body = new URLSearchParams();
            body.set('division_id', this.formGroup.value.division_id);
            body.set('name', this.formGroup.value.name);

            this.httpService.makeRequest(Constants.GET_DISTRICTS + 'create', Constants.HTTP_POST, body, (error, success) => {
                if (!error && success) {

                    if (success.status === 200) {
                        localStorage.setItem('message', 'District successfully created.');
                        this.router.navigate(['/districts/all']);
                    } else {
                        this.toastr.error('Please try again.', 'Error!');
                    }
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            });
        }
    }

}
