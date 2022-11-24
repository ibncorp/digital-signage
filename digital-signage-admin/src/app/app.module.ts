import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule, 
        AppRoutingModule, 
        HttpClientModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(
            {
                timeOut: 5000,
                positionClass: 'toast-bottom-right',
                preventDuplicates: true,
            }
        ), // ToastrModule added
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        AuthGuard
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
