/* tslint:disable: ordered-imports*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import * as devicesComponents from './components';

/* Containers */
import * as devicesContainers from './containers';

/* Directives */
import * as devicesDirectives from './directives';

/* Guards */
import * as devicesGuards from './guards';

/* Services */
import * as devicesServices from './services';
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
    providers: [
        DecimalPipe,
        ...devicesServices.services,
        ...devicesGuards.guards,
        ...devicesDirectives.directives,
    ],
    declarations: [
        ...devicesContainers.containers,
        ...devicesComponents.components,
        ...devicesDirectives.directives,
    ],
    exports: [...devicesContainers.containers, ...devicesComponents.components],
})
export class DevicesModule {}
