/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { MenuModule } from './menu.module';

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
        component: devicesContainers.MenuComponent,
        data: {
            title: 'Menu - Digital Signage Admin',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Menu',
                    active: true,
                },
            ],
        } as SBRouteData,
    },
];

@NgModule({
    imports: [MenuModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class MenuRoutingModule {}
