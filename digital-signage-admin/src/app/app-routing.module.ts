import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
        canActivate : [AuthGuard]
    },
    // {
    //     path: 'charts',
    //     loadChildren: () =>
    //         import('modules/charts/charts-routing.module').then(m => m.ChartsRoutingModule),
    //     canActivate : [AuthGuard]
    // },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('modules/dashboard/dashboard-routing.module').then(
                m => m.DashboardRoutingModule
            ),
        canActivate : [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('modules/auth/auth-routing.module').then(m => m.AuthRoutingModule),
    },
    {
        path: 'error',
        loadChildren: () =>
            import('modules/error/error-routing.module').then(m => m.ErrorRoutingModule),
    },
    // {
    //     path: 'tables',
    //     loadChildren: () =>
    //         import('modules/tables/tables-routing.module').then(m => m.TablesRoutingModule),
    // },
    {
        path: 'devices',
        loadChildren: () =>
            import('modules/devices/devices-routing.module').then(m => m.DevicesRoutingModule),
        canActivate : [AuthGuard]
    },
    {
        path: 'content-promo',
        loadChildren: () =>
            import('modules/promo/promo-routing.module').then(m => m.PromoRoutingModule),
        canActivate : [AuthGuard]
    },
    {
        path: 'content-video',
        loadChildren: () =>
            import('modules/video/video-routing.module').then(m => m.VideoRoutingModule),
            canActivate : [AuthGuard]
    },
    {
        path: 'content-menu',
        loadChildren: () =>
            import('modules/menu/menu-routing.module').then(m => m.MenuRoutingModule),
            canActivate : [AuthGuard]
    },
    {
        path: 'media',
        loadChildren: () =>
            import('modules/media/media-routing.module').then(m => m.MediaRoutingModule),
            canActivate : [AuthGuard]
    },
    {
        path: 'outlets',
        loadChildren: () =>
            import('modules/outlets/outlets-routing.module').then(m => m.OutletsRoutingModule),
            canActivate : [AuthGuard]
    },
    {
        path: 'version',
        loadChildren: () =>
            import('modules/utility/utility-routing.module').then(m => m.UtilityRoutingModule),
        canActivate : [AuthGuard]
    },
    {
        path: '**',
        pathMatch: 'full',
        loadChildren: () =>
            import('modules/error/error-routing.module').then(m => m.ErrorRoutingModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
