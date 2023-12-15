import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {LottieAnimationViewModule} from 'ng-lottie';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {RatingModule} from 'ngx-bootstrap/rating';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';

import {LoginComponent} from './authentications/login/login.component';
import {LogoutComponent} from './authentications/logout/logout.component';
import {HttpService} from './services/http.service';
import {LayoutService} from './services/layout.service';
import {AppComponent} from './app.component';
import {HeaderComponent} from './template-layout/header/header.component';
import {FooterComponent} from './template-layout/footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProductDetailComponent} from './products/product-detail/product-detail.component';
import {MyAccountComponent} from './authentications/my-account/my-account.component';
import {ChangePasswordComponent} from './authentications/change-password/change-password.component';
import {OrderHistoryComponent} from './orders/order-history/order-history.component';
import {OrderDetailComponent} from './orders/order-detail/order-detail.component';
import {SidebarComponent} from './template-layout/sidebar/sidebar.component';
import {CreateProductComponent} from './all-product/create-product/create-product.component';
import {EditProductComponent} from './all-product/edit-product/edit-product.component';
import {AllProductComponent} from './all-product/all-product.component';
import {CreateUserComponent} from './all-user/create-user/create-user.component';
import {AllUserComponent} from './all-user/all-user.component';
import {EditUserComponent} from './all-user/edit-user/edit-user.component';
import {RequestComponent} from './request/request.component';
import {DivisionsComponent} from './divisions/divisions.component';
import {DivisionsCreateComponent} from './divisions/divisions-create/divisions-create.component';
import {DivisionsEditComponent} from './divisions/divisions-edit/divisions-edit.component';
import {DistrictsComponent} from './districts/districts.component';
import {DistrictsCreateComponent} from './districts/districts-create/districts-create.component';
import {DistrictsEditComponent} from './districts/districts-edit/districts-edit.component';
import {CategoriesComponent} from './categories/categories.component';
import {CategoryCreateComponent} from './categories/category-create/category-create.component';
import {CategoryEditComponent} from './categories/category-edit/category-edit.component';
import {SubCategoriesComponent} from './categories/sub-categories/sub-categories.component';
import {SubCategoryCreateComponent} from './categories/sub-categories/sub-category-create/sub-category-create.component';
import {SubCategoryEditComponent} from './categories/sub-categories/sub-category-edit/sub-category-edit.component';
import {SlidersComponent} from './sliders/sliders.component';
import {SliderCreateComponent} from './sliders/slider-create/slider-create.component';
import {GlobalSliderComponent} from './global-slider/global-slider.component';
import {GlobalSliderCreateComponent} from './global-slider/global-slider-create/global-slider-create.component';
import {NotificationComponent} from './notification/notification.component';
import {SitesComponent} from './sites/sites.component';
import {ProcessingComponent} from './processing/processing.component';
import {SettingsService} from './services/settings.service';
import {EmailConfirmComponent} from './authentications/email-confirm/email-confirm.component';
import {ForgotPasswordComponent} from './authentications/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './authentications/reset-password/reset-password.component';
import {NotificationsService} from './services/notifications.service';
import {FacebookModule} from 'ngx-facebook';
import {TermsAndConditionComponent} from './terms-and-condition/terms-and-condition.component';
import { ReportComponent } from './report/report.component';

const appRoutes: Routes = [
    {path: '', component: MyAccountComponent},
    {path: 'user/login', component: LoginComponent},
    {path: 'report', component: ReportComponent},
    {path: 'user/logout', component: LogoutComponent},
    {path: 'user/create_user', component: CreateUserComponent},
    {path: 'user/edit/:id', component: EditUserComponent},
    {path: 'user/all', component: AllUserComponent},
    {path: 'product/detail/:id', component: ProductDetailComponent},
    {path: 'product/create', component: CreateProductComponent},
    {path: 'product/edit/:id', component: EditProductComponent},
    {path: 'product/all', component: AllProductComponent},
    {path: 'dashboard', component: MyAccountComponent},
    {path: 'user/change_password', component: ChangePasswordComponent},
    {path: 'order/all', component: OrderHistoryComponent},
    {path: 'order/detail/:id', component: OrderDetailComponent},
    {path: 'request/all', component: RequestComponent},
    {path: 'divisions/all', component: DivisionsComponent},
    {path: 'divisions/create', component: DivisionsCreateComponent},
    {path: 'divisions/edit/:id', component: DivisionsEditComponent},
    {path: 'districts/all', component: DistrictsComponent},
    {path: 'districts/create', component: DistrictsCreateComponent},
    {path: 'districts/edit/:id', component: DistrictsEditComponent},
    {path: 'categories/all', component: CategoriesComponent},
    {path: 'categories/create', component: CategoryCreateComponent},
    {path: 'categories/edit/:id', component: CategoryEditComponent},
    {path: 'sub-categories/all', component: SubCategoriesComponent},
    {path: 'sub-categories/create', component: SubCategoryCreateComponent},
    {path: 'sub-categories/edit/:id', component: SubCategoryEditComponent},
    {path: 'sliders/all', component: SlidersComponent},
    {path: 'sliders/create', component: SliderCreateComponent},
    {path: 'notifications/all', component: NotificationComponent},
    {path: 'global-sliders/all', component: GlobalSliderComponent},
    {path: 'global-sliders/create', component: GlobalSliderCreateComponent},
    {path: 'settings', component: SitesComponent},
    {path: 'confirm-email/:token', component: EmailConfirmComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password/:token', component: ResetPasswordComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        ProductDetailComponent,
        MyAccountComponent,
        ChangePasswordComponent,
        OrderHistoryComponent,
        OrderDetailComponent,
        SidebarComponent,
        LogoutComponent,
        CreateProductComponent,
        EditProductComponent,
        CreateUserComponent,
        AllProductComponent,
        AllUserComponent,
        EditUserComponent,
        RequestComponent,
        DivisionsComponent,
        DivisionsCreateComponent,
        DivisionsEditComponent,
        DistrictsEditComponent,
        DistrictsCreateComponent,
        DistrictsComponent,
        CategoriesComponent,
        CategoryCreateComponent,
        CategoryEditComponent,
        SubCategoriesComponent,
        SubCategoryCreateComponent,
        SubCategoryEditComponent,
        SlidersComponent,
        SliderCreateComponent,
        GlobalSliderComponent,
        GlobalSliderCreateComponent,
        NotificationComponent,
        SitesComponent,
        ProcessingComponent,
        EmailConfirmComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        TermsAndConditionComponent,
        ReportComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        PaginationModule.forRoot(),
        CarouselModule.forRoot(),
        LottieAnimationViewModule.forRoot(),
        RouterModule.forRoot(
            appRoutes,
            {enableTracing: false}
        ),
        ReactiveFormsModule,
        InfiniteScrollModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        RatingModule.forRoot(),
        FacebookModule.forRoot(),
        IonRangeSliderModule
    ],
    providers: [HttpService, LayoutService, SettingsService, NotificationsService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
