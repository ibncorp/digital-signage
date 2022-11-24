/* tslint:disable: ordered-imports*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import * as mediaComponents from './components';

/* Containers */
import * as mediaContainers from './containers';

/* Directives */
import * as mediaDirectives from './directives';

/* Guards */
import * as mediaGuards from './guards';

/* Services */
import * as mediaServices from './services';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ProgressbarModule } from 'ngx-bootstrap/progressbar';


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
        ...mediaServices.services,
        ...mediaGuards.guards,
        ...mediaDirectives.directives,
    ],
    declarations: [
        ...mediaContainers.containers,
        ...mediaComponents.components,
        ...mediaDirectives.directives,
    ],
    exports: [...mediaContainers.containers, ...mediaComponents.components],
})
export class MediaModule {}
