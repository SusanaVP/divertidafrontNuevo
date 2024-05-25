import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from "./components/components.module";
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [
        provideClientHydration(),
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        ComponentsModule,
        HttpClientModule,
        MatSnackBarModule,
        BrowserAnimationsModule
    ]
})
export class AppModule { }
