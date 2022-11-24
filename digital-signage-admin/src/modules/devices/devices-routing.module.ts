/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { DevicesModule } from './devices.module';

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
        component: devicesContainers.DevicesComponent,
        data: {
            title: 'Devices - Digital Signage Admin',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Devices',
                    active: true,
                },
            ],
        } as SBRouteData,
    },
];

@NgModule({
    imports: [DevicesModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class DevicesRoutingModule {}
