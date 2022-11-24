/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { PromoModule } from './promo.module';

/* Containers */
import * as devicesContainers from './containers';

/* Guards */
import * as devicesGuards from './guards';
import { SBRouteData } from '@modules/navigation/models';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: devicesContainers.PromoComponent,
        data: {
            title: 'Promo - Digital Signage Admin',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Promo',
                    active: true,
                },
            ],
        } as SBRouteData,
    },
];

@NgModule({
    imports: [PromoModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class PromoRoutingModule {}
