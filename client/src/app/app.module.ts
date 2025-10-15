import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { EventComponent } from './event/event.component';
import { RegisterComponent } from './register/register.component';

import { TimeFormatPipe } from './time-format.pipe';

@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent, 
    SearchComponent, 
    EventComponent, 
    RegisterComponent,
    TimeFormatPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
