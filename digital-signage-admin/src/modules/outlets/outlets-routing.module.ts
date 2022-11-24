/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { OutletsModule } from './outlets.module';

/* Containers */
import * as outletsContainers from './containers';

/* Guards */
import * as outletsGuards from './guards';
import { SBRouteData } from '@modules/navigation/models';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: outletsContainers.OutletsComponent,
        data: {
            title: 'Outlets - Digital Signage Admin',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Outlets',
                    active: true,
                },
            ],
        } as SBRouteData,
    },
];

@NgModule({
    imports: [OutletsModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class OutletsRoutingModule {}
