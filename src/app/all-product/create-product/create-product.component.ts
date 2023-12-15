import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {Category} from '../../../models/Category';
import {SubCategory} from '../../../models/SubCategory';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

    createProduct: FormGroup;
    productImage: {}[] = [];
    productImageType: {}[] = [];
    showDiv: {}[] = [];
    counter: number;
    categories: Category[] = [];
    subCategories: SubCategory[] = [];
    showSubCategories: SubCategory[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, private fb: FormBuilder, public notificationsService: NotificationsService) {
        this.layoutService.checkIsLogin();
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
        this.createProduct = this.fb.group({
            name: ['', Validators.compose([Validators.required])],
            price: ['', Validators.compose([Validators.required])],
            discount: ['0'],
            shippingPrice: ['0'],
            detail: ['', Validators.compose([Validators.required])],
            category: ['', Validators.compose([Validators.required])],
            sub_category: ['', Validators.compose([Validators.required])],
            new: ['', Validators.compose([Validators.required])],
            status: ['', Validators.compose([Validators.required])],
            feature: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])]
        });
        this.getCategory();
        this.getSubCategories();
    }

    getCategory() {
        const body = new URLSearchParams();
        this.httpService.makeRequest(Constants.GET_CATEGORY, Constants.HTTP_GET, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.message, 'Error!');
                } else {
                    this.categories = res.data;
                }
            }
        });
    }

    getSubCategories() {
        this.httpService.makeRequest(Constants.GET_SUB_CATEGORIES, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.subCategories = res.message;
                }
            }
        });
    }

    getSubCategoryByCategory(categoryId) {
        this.showSubCategories = [];
        for (let i = 0; i < this.subCategories.length; i++) {
            if (this.subCategories[i].category_id._id === categoryId) {
                this.showSubCategories.push(this.subCategories[i]);
            }
        }
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
            if (image.width === 400 && image.height === 500) {
                self.productImage.push(base64name);
            } else {
                self.toastr.error('Image size doesn\'t match.', 'Error');
            }
        };
        image.src = base64name;
    }

    productSubmit() {
        if (this.createProduct.valid) {
            const body = new URLSearchParams();
            body.set('name', this.createProduct.value.name);
            body.set('price', this.createProduct.value.price);
            body.set('discount', this.createProduct.value.discount);
            // body.set('shippingPrice', this.createProduct.value.shippingPrice);
            body.set('shippingPrice', '0');
            body.set('status', this.createProduct.value.status);
            body.set('detail', this.createProduct.value.detail);
            body.set('sub_category', this.createProduct.value.sub_category);
            body.set('new', this.createProduct.value.new);
            body.set('feature', this.createProduct.value.feature);
            body.set('product_image', JSON.stringify(this.productImage));
            body.set('feature', this.createProduct.value.feature);
            body.set('description', this.createProduct.value.description);
            const com_name = [];
            for (let i = 1; i <= this.showDiv.length; i++) {
                com_name.push({
                    'name': this.createProduct.value['com_name_' + i],
                    'value': this.createProduct.value['com_value_' + i]
                });
            }
            body.set('components', JSON.stringify(com_name));
            this.httpService.makeRequest(Constants.PRODUCT_URL, Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 404 || res.status === 500) {
                        this.toastr.error(res.message, 'Error!');
                    } else {
                        localStorage.setItem('message', 'Product Successfully Created');
                        if (localStorage.getItem('redirectUrl')) {
                            this.router.navigate([localStorage.getItem('redirectUrl')]);
                        } else {
                            this.router.navigate(['/product/all']);
                        }

                        localStorage.removeItem('redirectUrl');
                    }
                }
            });
        }
    }

    createProComponent() {
        this.showDiv = this.showDiv.concat(1);
        this.createProduct.addControl('com_name_' + this.showDiv.length, new FormControl('', []));
        this.createProduct.addControl('com_value_' + this.showDiv.length, new FormControl('', []));
    }
}
