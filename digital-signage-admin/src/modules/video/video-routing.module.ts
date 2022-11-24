/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */

/* Containers */
import * as devicesContainers from './containers';

/* Guards */
import * as devicesGuards from './guards';
import { SBRouteData } from '@modules/navigation/models';
import { VideoModule } from './video.module';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: devicesContainers.VideoComponent,
        data: {
            title: 'Video - Digital Signage Admin',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Video',
                    active: true,
                },
            ],
        } as SBRouteData,
    },
];

@NgModule({
    imports: [VideoModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class VideoRoutingModule {}
