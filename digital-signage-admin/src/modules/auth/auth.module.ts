/* tslint:disable: ordered-imports*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import * as authComponents from './components';

/* Containers */
import * as authContainers from './containers';

/* Guards */
import * as authGuards from './guards';

/* Services */
import * as authServices from './services';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        AppCommonModule,
        NavigationModule,        
        NgxSpinnerModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [...authServices.services, ...authGuards.guards],
    declarations: [...authContainers.containers, ...authComponents.components],
    exports: [...authContainers.containers, ...authComponents.components],
})
export class AuthModule {}
