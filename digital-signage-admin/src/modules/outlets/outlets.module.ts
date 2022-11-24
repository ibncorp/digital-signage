/* tslint:disable: ordered-imports*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import * as outletsComponents from './components';

/* Containers */
import * as outletsContainers from './containers';

/* Directives */
import * as outletsDirectives from './directives';

/* Guards */
import * as outletsGuards from './guards';

/* Services */
import * as outletsServices from './services';
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
        ...outletsServices.services,
        ...outletsGuards.guards,
        ...outletsDirectives.directives,
    ],
    declarations: [
        ...outletsContainers.containers,
        ...outletsComponents.components,
        ...outletsDirectives.directives,
    ],
    exports: [...outletsContainers.containers, ...outletsComponents.components],
})
export class OutletsModule {}
