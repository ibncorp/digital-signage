/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { MediaModule } from './media.module';

/* Containers */
import * as mediaContainers from './containers';

/* Guards */
import * as mediaGuards from './guards';
import { SBRouteData } from '@modules/navigation/models';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
    },
    {
        path: 'pictures',
        canActivate: [],
        component: mediaContainers.PictureComponent,
        data: {
            title: 'Media Pictures - Digital Signage Admin',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Pictures',
                    active: true,
                },
            ],
        } as SBRouteData,
    },
    {
        path: 'videos',
        canActivate: [],
        component: mediaContainers.VideoComponent,
        data: {
            title: 'Media Videos - Digital Signage Admin',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
                {
                    text: 'Videos',
                    active: true,
                },
            ],
        } as SBRouteData,
    }
];

@NgModule({
    imports: [MediaModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class MediaRoutingModule {}
